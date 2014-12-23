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

    scroll: IBehaviour;
    scrollDir: Direction;
    scrollsRemaining: number;
    currentPlate: Plate;

    cursors: Phaser.CursorKeys;
    layers: {
        background: Phaser.Group;
        plates: Plate[];
        objects: Phaser.Group;
        foreground: Phaser.Group;
        ui: Phaser.Group;
    }

    // -----------------------
    // Resource loading
    // -----------------------

    preload() {
        // todo: add assets
        var assets = ['Backgrounds/checkers'];
        assets.forEach(name => this.load.image(name, 'Assets/' + name + '.png'));
    }

    // -----------------------
    // Initialization
    // -----------------------

    create() {
        this.layers = {
            background: this.add.group(),
            plates: [],
            objects: this.add.group(),
            foreground: this.add.group(),
            ui: this.add.group()
        };

        this.layers.background.add(new Background(this.game));

        this.createPlates();
    }

    createPlates() {
        this.layers.plates.push(new Plate(this.game, 0, 0));
        this.layers.plates.push(new Plate(this.game, 1, 0));
        this.layers.plates.push(new Plate(this.game, 2, 0));
        this.layers.plates.push(new Plate(this.game, 2, 1));

        this.currentPlate = this.layers.plates[0];
        this.updateScrollingInfo();

        this.detectWorldSize();
    }

    // -----------------------
    // Helpers
    // -----------------------

    updateScrollingInfo() {
        var plates = this.layers.plates;
        var prev = this.currentPlate;
        var nextId = plates.indexOf(prev) + 1;
        var curr = nextId < plates.length ? plates[nextId] : null;

        if (curr) {
            // direction
            if (curr.xCell > prev.xCell) {
                this.scrollDir = Direction.Right;
            } else if (curr.xCell < prev.xCell) {
                this.scrollDir = Direction.Left;
            } else if (curr.yCell > prev.yCell) {
                this.scrollDir = Direction.Down;
            } else if (curr.yCell < prev.yCell) {
                this.scrollDir = Direction.Up;
            }

            this.scrollsRemaining = this.scrollDir === Direction.Left || this.scrollDir === Direction.Right
                ? Constants.CELLS_HORIZONTAL
                : Constants.CELLS_VERTICAL;

            this.currentPlate = curr;
        }
    }

    detectWorldSize() {
        var xCell = _(this.layers.plates).map(x => x.xCell).max().value() + 1;
        var yCell = _(this.layers.plates).map(x => x.yCell).max().value() + 1;

        var xMax = xCell * Constants.FIELD_WIDTH + (Constants.SCREEN_WIDTH - Constants.FIELD_WIDTH);
        var yMax = yCell * Constants.FIELD_HEIGHT + (Constants.SCREEN_HEIGHT - Constants.FIELD_HEIGHT);

        this.game.world.setBounds(0, 0, xMax, yMax);
    }

    // -----------------------
    // Game logic
    // -----------------------

    update() {
        var keybd = this.game.input.keyboard;
        if (keybd.justPressed(Phaser.Keyboard.SPACEBAR) && !this.scroll) {

            if (!this.scrollsRemaining) {
                this.updateScrollingInfo();
            }

            this.scrollsRemaining--;

            this.scroll = new ScrollBehaviour(this.scrollDir, 8);
        }

        if (this.scroll) {
            this.scroll.update(this);
            if (this.scroll.finished) {
                this.scroll = null;
            }
        }
    }

    render() {
        this.game.debug.cameraInfo(this.game.camera, 10, 20);
    }
}