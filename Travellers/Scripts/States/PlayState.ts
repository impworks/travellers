class PlayState extends Phaser.State {
     
    // -----------------------
    // Constructor
    // -----------------------

    constructor() {
        super();
    }

    // -----------------------
    // Fields
    // -----------------------

    layers: {
        background: Phaser.Group;
        checkers: Phaser.Group;
        floor: Phaser.Group;
        objects: Phaser.Group;
        foreground: Phaser.Group;
        ui: Phaser.Group;
    };

    level: LevelBase;

    characters: {
        all: Character[];
        selected: Character;
    }

    areasState: {
        current: number;
        lastActive: number;
        lastInactive: number;
    }

    stepState: {
        stepDir: Direction;
        stepsUntilNextArea: number;
        originalSteps: number;
    }

    clickState: {
        isClicked: boolean;
    }

    pathMap: {
        cellX: number;
        cellY: number;
        map: number[][];
    }

    behaviours: BehaviourManager;

    // -----------------------
    // Resource loading
    // -----------------------

    preload() {
        var assets = {
            Backgrounds: {
                'checkers': false
            },
            Sprites: {
                'column': false,
                'wall': false,
                'path-pellet': false,
                'path-error': false,
                'char': { width: 96, height: 96, frames: 2 }
            }
        };

        _.forIn(assets, (content, dir) => {
            _.forIn(content, (anim, sprite) => {
                var name = dir + '/' + sprite;
                var path = 'Assets/' + name + '.png';
                if (anim === false)
                    this.load.image(name, path);
                else
                    this.load.spritesheet(name, path, anim.width, anim.height, anim.frames);
            });
        });
    }

    // -----------------------
    // Initialization
    // -----------------------

    create() {
        this.layers = {
            background: this.add.group(),
            checkers: this.add.group(),
            floor: this.add.group(),
            objects: this.add.group(),
            foreground: this.add.group(),
            ui: this.add.group()
        };

        this.layers.background.add(new Background(this.game));

        this.clickState = {
            isClicked: false
        };

        this.pathMap = {
            map: null,
            cellX: 0,
            cellY: 0
        };

        this.initLevel();
        this.createCharacters();
        this.calculatePathMap();

        this.behaviours = new BehaviourManager(this);
    }

    initLevel() {

        /// <summary>Initializes the scene.</summary>

        this.level = new Level1(this.game);

        this.advanceStepState(0);

        var xMax = (this.level.worldWidth + 1) * Constants.FIELD_WIDTH + (Constants.SCREEN_WIDTH - Constants.FIELD_WIDTH);
        var yMax = (this.level.worldHeight + 1) * Constants.FIELD_HEIGHT + (Constants.SCREEN_HEIGHT - Constants.FIELD_HEIGHT);

        this.game.world.setBounds(0, 0, xMax, yMax);

        this.areasState = {
            lastActive: 0,
            lastInactive: 0,
            current: 0
        };

        this.activateArea(this.level.areas[0]);
        this.activateNextAreas(0);
    }

    createCharacters() {

        /// <summary>Creates characters and adds them to the scene.</summary>

        this.characters = {
            all: [
                new Character(this, 1, 1),
                new Character(this, 1, 4)
            ],
            selected: null
        };

        // temp: remove walls from cells where players are
        this.layers.objects.children.forEach((obj:LevelObject) => {
            var char = _.find(this.characters.all, ch => obj.cellX === ch.cellX && obj.cellY === ch.cellY);
            if (char)
                obj.destroy();
        });

        this.layers.objects.addMultiple(this.characters.all);
    }

    // -----------------------
    // World stepping
    // -----------------------

    advanceStepState(areaId: number) {

        /// <summary>Calculates the new stepState which is used for stepping from current area towards the next one.</summary>

        if (areaId === this.level.areas.length - 1) {
            // end of level reached
            this.stepState = null;
            return;
        }

        var curr = this.level.areas[areaId];
        var next = this.level.areas[areaId + 1];

        var dir = Util.getDirection(curr.areaX, curr.areaY, next.areaX, next.areaY);
        var steps = dir === Direction.Left || dir === Direction.Right ? Constants.CELLS_HORIZONTAL : Constants.CELLS_VERTICAL;

        this.stepState = {
            stepDir: dir,
            stepsUntilNextArea: steps,
            originalSteps: steps
        };
    }

    processStep() {

        /// <summary>Scrolls one step in current direction. Possibly activates new areas as they come into playfield.</summary>

        if (!this.stepState) {
            return;
        }

        // update remaining steps and current cell
        this.stepState.stepsUntilNextArea--;
        var vec = Util.getDirectionVector(this.stepState.stepDir);
        this.pathMap.cellX += vec.x;
        this.pathMap.cellY += vec.y;

        // if not the end of the playfield, scroll further
        this.behaviours.add(new ScrollBehaviour(this.stepState.stepDir, this.game));

        if (this.stepState.stepsUntilNextArea === 0) {

            // current area has finished: recalculate new direction
            this.areasState.current++;
            this.advanceStepState(this.areasState.current);

        } else if (this.stepState.stepsUntilNextArea === 1) {

            // new area is about to be shown in the upcoming scroll
            this.activateNextAreas(this.areasState.current + 1);

        } else if (this.stepState.stepsUntilNextArea === this.stepState.originalSteps - 1) {

            // existing area is out of view
            this.deactivatePreviousAreas(this.areasState.current);
        }

        this.deactivateAbandonedObjects();
        this.calculatePathMap();

        console.log('objects: ' + this.layers.objects.countLiving() + ', areas: ' + this.layers.checkers.countLiving());
    }

    // -----------------------
    // Input handling
    // -----------------------

    processClick() {

        /// <summary>Processes a click event on the scene.</summary>

        var ptr = Util.getPointer(this.game.input);
        var pm = this.pathMap;
        var chars = this.characters;

        // no click
        if (!ptr.isDown) {
            if (this.clickState.isClicked) {
                this.clickState.isClicked = false;
            }
            return;
        }

        // click already handled
        if (this.clickState.isClicked) {
            return;
        }

        var cellX = Math.floor((ptr.worldX - Constants.FIELD_OFFSET) / Constants.CELL_SIZE);
        var cellY = Math.floor((ptr.worldY - Constants.FIELD_OFFSET) / Constants.CELL_SIZE);

        if (Util.isInside(cellX, cellY, pm.cellX, pm.cellY)) {

            // find the clicked object
            var obj = this.findObject(cellX, cellY);
            if (!obj && chars.selected) {

                // find the path
                this.behaviours.add(
                    new ObjectFindPathBehaviour(
                        chars.selected,
                        pm,
                        cellX,
                        cellY,
                        path => this.onPathFound(path, chars.selected, cellX, cellY)
                        )
                    );

            } else if (obj instanceof Character) {

                // select the character
                (<Character>obj).setSelected(true);

            }
        } else {

            // deselect current character if any
            if (chars.selected) {
                chars.selected.setSelected(false);
            }

        }

        this.clickState.isClicked = true;
    }

    // -----------------------
    // Callbacks
    // -----------------------

    private onPathFound(path: EasyStar.Position[], char: Character, cellX: number, cellY: number) {

        /// <summary>Pathfinding completed: display an error marker or start movement.</summary>

        if (!path) {
            // no path found: display an error indication
            this.layers.floor.add(new PathPellet(this.game, cellX, cellY, false));
            return;
        }

        // create pellets for points
        var points = _.map(
            path,
            p => {
                var x = p.x + this.pathMap.cellX;
                var y = p.y + this.pathMap.cellY;
                return { x: x, y: y, pellet: new PathPellet(this.game, x, y, true) };
            }
        );

        this.layers.floor.addMultiple(_.map(points, p => p.pellet));

        this.behaviours.add(new ObjectPathBehaviour(char, points, () => this.onPathFinished(char)));
    }

    private onPathFinished(char: Character) {

        /// <summary>Path movement completed: update path map, scroll the screen, move players.</summary>

        // recalculate path map for current character
        this.calculatePathMap();

        // scroll screen
        if (this.stepState) {
            this.processStep();
        }

        char.setSelected(false);
    }

    // -----------------------
    // Utilities
    // -----------------------

    findObject(cellX: number, cellY: number): LevelObject {

        /// <summary>Finds object at specified cell coordinates.</summary>

        return _.find(<LevelObject[]>this.layers.objects.children, ch => ch.cellX === cellX && ch.cellY === cellY);
    }

    calculatePathMap() {

        /// <summary>Refreshes the pass-through map of current screen.</summary>

        var pm = this.pathMap;
        var map = Util.create2DArray(Constants.CELLS_HORIZONTAL, Constants.CELLS_VERTICAL, 0);
        this.layers.objects.children.forEach((obj: LevelObject) => {
            if (!Util.isInside(obj.cellX, obj.cellY, pm.cellX, pm.cellY))
                return;

            map[obj.cellY - pm.cellY][obj.cellX - pm.cellX] = obj instanceof Wall || obj instanceof Character ? 1 : 0;
        });

        this.pathMap.map = map;
    }

    // -----------------------
    // Area activation and deactivation
    // -----------------------

    activateNextAreas(current: number) {

        /// <summary>Activates upcoming areas before they should appear in the playfield.</summary>

        var origin = this.level.areas[current];
        if (!origin) {
            return;
        }

        for (var idx = this.areasState.lastActive + 1; idx < this.level.areas.length; idx++) {
            var temp = this.level.areas[idx];
            if (Math.abs(origin.areaX - temp.areaX) <= 1 && Math.abs(origin.areaY - temp.areaY) <= 1) {

                // area is adjacent to current one: activate!
                this.activateArea(temp);
                this.areasState.lastActive++;

            } else {

                // stop on first non-aligned entry
                return;
            }
        }
    }

    deactivatePreviousAreas(current: number) {

        /// <summary>Deactivates areas after they have left the playfield.</summary>

        var origin = this.level.areas[current];
        if (!origin) {
            return;
        }

        for (var idx = current - 1; idx > this.areasState.lastInactive; idx--) {
            var temp = this.level.areas[idx];
            if (Math.abs(origin.areaX - temp.areaX) <= 1 && Math.abs(origin.areaY - temp.areaY) <= 1) {

                // area is adjacent to current one: deactivate!
                this.deactivateArea(temp);
                this.areasState.lastInactive++;

            } else {

                // stop on first non-aligned entry
                return;
            }
        }
    }

    activateArea(area: LevelArea) {

        /// <summary>Creates a checkers background for area and imports its objects into playfield.</summary>

        this.layers.checkers.add(new Checkers(this.game, area.areaX, area.areaY));
        this.layers.objects.addMultiple(area.createObjects());
    }

    deactivateArea(area: LevelArea) {

        /// <summary>Removes the checkers background from playfield.</summary>

        _.find(<Checkers[]>this.layers.checkers.children, x => x.areaX === area.areaX && x.areaY === area.areaY).destroy(true);

        this.layers.objects.children.forEach((obj: LevelObject) => {
            if (Util.isInsideArea(obj, area)) {
                obj.destroy(true);
            }
        });
    }

    deactivateAbandonedObjects() {
        
        /// <summary>Removes the objects after they have left the playfield.</summary>

        if (!this.stepState) {
            return;
        }

        var x = this.pathMap.cellX;
        var y = this.pathMap.cellY;
        var width = 1;
        var height = 1;
        var margin = 3;

        if (this.stepState.stepDir === Direction.Right) {
            x -= margin;
            height = Constants.CELLS_VERTICAL;
        } else if (this.stepState.stepDir === Direction.Left) {
            x += margin + Constants.CELLS_HORIZONTAL;
            height = Constants.CELLS_VERTICAL;
        } else if (this.stepState.stepDir === Direction.Down) {
            y -= margin;
            width = Constants.CELLS_HORIZONTAL;
        } else if (this.stepState.stepDir === Direction.Up) {
            y += margin + Constants.CELLS_VERTICAL;
            width = Constants.CELLS_HORIZONTAL;
        }

        this.layers.objects.children.forEach((obj: LevelObject) => {
            if (Util.isInside(obj.cellX, obj.cellY, x, y, width, height)) {
                obj.destroy(true);
            }
        });
    }

    // -----------------------
    // Game logic
    // -----------------------

    update() {

        this.layers.objects.sort('y', Phaser.Group.SORT_ASCENDING);
        this.behaviours.update();

        if (!this.behaviours.hasBlocking()) {
            this.processClick();
        }
    }
}