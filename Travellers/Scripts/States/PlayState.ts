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

    cursors: Phaser.CursorKeys;

    layers: {
        background: Phaser.Group;
        checkers: Phaser.Group;
        objects: Phaser.Group;
        foreground: Phaser.Group;
        ui: Phaser.Group;
    };

    level: LevelBase;
    areasState: {
        current: number;
        lastActive: number;
    }
    stepState: {
        stepDir: Direction;
        stepsUntilNextArea: number;
    }
    scrollInProgress: IBehaviour;

    // -----------------------
    // Resource loading
    // -----------------------

    preload() {
        var assets = ['Backgrounds/checkers'];
        assets.forEach(name => this.load.image(name, 'Assets/' + name + '.png'));
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
    }

    initLevel() {
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

        var checkers = new Checkers(this.game, area.areaX, area.areaY);
        this.layers.checkers.add(checkers);

        var objects = area.createObjects();
        this.layers.objects.addMultiple(objects);
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

        var dir: Direction;
        if (curr.areaX < next.areaX)
            dir = Direction.Right;
        else if (curr.areaX > next.areaX)
            dir = Direction.Left;
        else if (curr.areaY < next.areaY)
            dir = Direction.Down;
        else if (curr.areaY > next.areaY)
            dir = Direction.Up;

        this.stepState = {
            stepDir: dir,
            stepsUntilNextArea: dir === Direction.Left || dir === Direction.Right ? Constants.CELLS_HORIZONTAL : Constants.CELLS_VERTICAL
        };
    }

    step() {

        /// <summary>Scrolls one step in current direction. Possibly activates new areas as they come into playfield.</summary>

        if (this.scrollInProgress || !this.stepState) {
            return;
        }

        // if not the end of the playfield, scroll further
        this.stepState.stepsUntilNextArea--;
        this.scrollInProgress = new ScrollBehaviour(this.stepState.stepDir, 8);

        if (this.stepState.stepsUntilNextArea === 0) {

            // current area has finished: recalculate new direction
            this.areasState.current++;
            this.advanceStepState(this.areasState.current);

        } else if (this.stepState.stepsUntilNextArea === 1) {

            // new area is about to be shown in the upcoming scroll
            this.activateNextAreas();
        }
    }

    // -----------------------
    // Game logic
    // -----------------------

    update() {
        if (this.game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
            this.step();
        }

        if (this.scrollInProgress) {
            this.scrollInProgress.update(this);
            if (this.scrollInProgress.finished) {
                this.scrollInProgress = null;
            }
        }
    }

    render() {
        this.game.debug.cameraInfo(this.game.camera, 10, 20);
        this.game.debug.text("stepState: " + JSON.stringify(this.stepState), 10, 610);
        this.game.debug.text("areaState: " + JSON.stringify(this.areasState), 10, 630);
    }
}