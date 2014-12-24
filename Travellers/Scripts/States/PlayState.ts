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
        current: LevelArea;
        lastActive: number;
    }
    stepState: {
        stepDir: Direction;
        stepsUntilNextArea: number;
        scrollInProgress?: IBehaviour;
    }

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

        this.level = new Level1();
        var areas = this.level.areas;
        var dir = this.getScrollDirection(areas[0], areas[1]);

        this.stepState = {
            stepDir: dir,
            stepsUntilNextArea: dir === Direction.Left || dir === Direction.Right ? Constants.CELLS_HORIZONTAL : Constants.CELLS_VERTICAL
        };

        var xMax = this.level.worldWidth * Constants.FIELD_WIDTH + (Constants.SCREEN_WIDTH - Constants.FIELD_WIDTH);
        var yMax = this.level.worldHeight * Constants.FIELD_HEIGHT + (Constants.SCREEN_HEIGHT - Constants.FIELD_HEIGHT);

        this.game.world.setBounds(0, 0, xMax, yMax);

        this.activateNextAreas(areas[0]);
    }

    // -----------------------
    // Helpers
    // -----------------------

    activateNextAreas(current: LevelArea) {
        if (!this.areasState) {
            this.areasState = {
                lastActive: 0,
                current: current
            };

            this.activateArea(current);
        }

        var areas = this.level.areas;
        var origin = areas[this.areasState.lastActive];

        for (var idx = this.areasState.lastActive + 1; idx < areas.length; idx++) {
            var temp = areas[idx];
            if (Math.abs(origin.areaX - temp.areaX) <= 1 && Math.abs(origin.areaY - temp.areaY) <= 1) {
                this.activateArea(temp);
                this.areasState.lastActive++;
            } else {
                // break on first non-aligned entry
                return;
            }
        }
    }

    activateArea(area: LevelArea) {
        var checkers = new Checkers(this.game, area.areaX, area.areaY);
        this.layers.checkers.add(checkers);

        var objects = area.createObjects();
        this.layers.objects.addMultiple(objects);
    }

    removeArea(area: LevelArea) {
        // remove checkers
        _.find(<Checkers[]>this.layers.checkers.children, x => x.areaX === area.areaX && x.areaY === area.areaY).destroy(true);

        // todo: remove objects from scene
    }

    getScrollDirection(curr: LevelArea, next: LevelArea): Direction {
        if (curr.areaX < next.areaX)
            return Direction.Right;

        if (curr.areaX > next.areaX)
            return Direction.Left;

        if (curr.areaY < next.areaY)
            return Direction.Down;

        if (curr.areaY > next.areaY)
            return Direction.Up;
    }

    step() {
        
    }

    // -----------------------
    // Game logic
    // -----------------------

    update() {
        var keybd = this.game.input.keyboard;
        var scroll = this.stepState.scrollInProgress;
        if (keybd.justPressed(Phaser.Keyboard.SPACEBAR) && !scroll) {
            this.step();
        }

        if (scroll) {
            scroll.update(this);
            if (scroll.finished) {
                this.stepState.scrollInProgress = null;
            }
        }
    }

    render() {
        this.game.debug.cameraInfo(this.game.camera, 10, 20);
    }
}