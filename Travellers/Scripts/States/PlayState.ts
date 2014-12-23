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
        this.layers.plates.push(new Plate(this.game));
    }

    // -----------------------
    // Game logic
    // -----------------------

    update() {
        
    }
}