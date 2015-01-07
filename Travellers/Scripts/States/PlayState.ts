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
    }

    stepState: {
        stepDir: Direction;
        stepsUntilNextArea: number;
        cellX: number;
        cellY: number;
    }

    clickState: {
        isClicked: boolean;
    }

    pathMap: number[][];

    behaviours: BehaviourManager;

    // -----------------------
    // Resource loading
    // -----------------------

    preload() {
        var assets = {
            Backgrounds: {
                checkers: false
            },
            Sprites: {
                column: false,
                wall: false,
                char: { width: 96, height: 96, frames: 2 }
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
            objects: this.add.group(),
            foreground: this.add.group(),
            ui: this.add.group()
        };

        this.layers.background.add(new Background(this.game));

        this.initLevel();
        this.createCharacters();
        this.calculatePathMap();

        this.behaviours = new BehaviourManager(this);

        this.clickState = {
            isClicked: false
        };
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
            current: 0
        };

        this.activateArea(this.level.areas[0]);
        this.activateNextAreas();
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
    // Helpers
    // -----------------------

    activateNextAreas() {

        /// <summary>Activates upcoming areas before they should appear in the playfield.</summary>

        var areas = this.level.areas;
        var origin = areas[this.areasState.current+1];

        for (var idx = this.areasState.lastActive + 1; idx < areas.length; idx++) {
            var temp = areas[idx];
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

    activateArea(area: LevelArea) {
        
        /// <summary>Creates a checkers background for area and imports its objects into playfield.</summary>

        this.layers.checkers.add(new Checkers(this.game, area.areaX, area.areaY));
        this.layers.objects.addMultiple(area.createObjects());
    }

    removeArea(area: LevelArea) {

        /// <summary>Removes the checkers background and abandoned objects from playfield.</summary>

        _.find(<Checkers[]>this.layers.checkers.children, x => x.areaX === area.areaX && x.areaY === area.areaY).destroy(true);

        // todo: remove objects from scene
    }

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
        this.stepState = {
            stepDir: dir,
            stepsUntilNextArea: dir === Direction.Left || dir === Direction.Right ? Constants.CELLS_HORIZONTAL : Constants.CELLS_VERTICAL,
            cellX: curr.areaX * Constants.CELLS_HORIZONTAL,
            cellY: curr.areaY * Constants.CELLS_VERTICAL
        };
    }

    step() {

        /// <summary>Scrolls one step in current direction. Possibly activates new areas as they come into playfield.</summary>

        if (this.behaviours.hasBlocking() || !this.stepState) {
            return;
        }

        // update remaining steps and current cell
        var ss = this.stepState;
        ss.stepsUntilNextArea--;
        if (ss.stepDir === Direction.Left)
            ss.cellX--;
        else if (ss.stepDir === Direction.Right)
            ss.cellX++;
        else if (ss.stepDir === Direction.Up)
            ss.cellY--;
        else if (ss.stepDir === Direction.Down)
            ss.cellY++;

        // if not the end of the playfield, scroll further
        this.behaviours.add(new ScrollBehaviour(this.stepState.stepDir, 8, this.game));

        if (this.stepState.stepsUntilNextArea === 0) {

            // current area has finished: recalculate new direction
            this.areasState.current++;
            this.advanceStepState(this.areasState.current);

        } else if (this.stepState.stepsUntilNextArea === 1) {

            // new area is about to be shown in the upcoming scroll
            this.activateNextAreas();
        }

        this.calculatePathMap();
    }

    findObject(cellX: number, cellY: number): LevelObject {

        /// <summary>Finds object at specified cell coordinates.</summary>

        return _.find(<LevelObject[]>this.layers.objects.children, ch => ch.cellX === cellX && ch.cellY === cellY);
    }

    calculatePathMap() {

        /// <summary>Refreshes the pass-through map of current screen.</summary>

        var ss = this.stepState;
        var pathMap = Util.create2DArray(Constants.CELLS_HORIZONTAL, Constants.CELLS_VERTICAL, 0);
        this.layers.objects.children.forEach((obj: LevelObject) => {
            if (!Util.isInside(obj.cellX, obj.cellY, ss.cellX, ss.cellY)) return;
            pathMap[obj.cellY - ss.cellY][obj.cellX - ss.cellX] = obj instanceof Wall || obj instanceof Character ? 1 : 0;
        });
        this.pathMap = pathMap;

        // for debug purposes
        Util.log2DArray(pathMap);
    }

    processClick() {
        
        /// <summary>Processes a click event on the scene.</summary>

        var ptr = Util.getPointer(this.game.input);
        var ss = this.stepState;
        var chars = this.characters;

        // no click
        if (!ptr.isDown) {
            if (this.clickState.isClicked) {
                this.clickState.isClicked = false;
            }
            return;
        }

        console.log('isDown');

        // click already handled
        if (this.clickState.isClicked) {
            return;
        }

        var cellX = Math.floor((ptr.worldX - Constants.FIELD_OFFSET) / Constants.CELL_SIZE);
        var cellY = Math.floor((ptr.worldY - Constants.FIELD_OFFSET) / Constants.CELL_SIZE);

        console.log('clicked on: ' + cellX + ':' + cellY);

        if (Util.isInside(cellX, cellY, ss.cellX, ss.cellY)) {

            // find the clicked object
            var obj = this.findObject(cellX, cellY);
            if (!obj && chars.selected) {

                // move object to cell (naive path)
                var pt1 = new Phaser.Point(chars.selected.cellX, cellY);
                var pt2 = new Phaser.Point(cellX, cellY);
                this.behaviours.add(new ObjectPathBehaviour(chars.selected, [pt1, pt2], 8, () => chars.selected.setSelected(false)));

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
    // Game logic
    // -----------------------

    update() {

        this.layers.objects.sort('y', Phaser.Group.SORT_ASCENDING);

        if (this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
            this.step();
        }

        this.behaviours.update();
        this.processClick();
    }

    render() {
        this.game.debug.cameraInfo(this.game.camera, 10, 20);
        this.game.debug.text("stepState: " + JSON.stringify(this.stepState), 10, 610);
        this.game.debug.text("areaState: " + JSON.stringify(this.areasState), 10, 630);
    }
}