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
            background: this.game.add.group(),
            objects: this.game.add.group(),
            foreground: this.game.add.group(),
            ui: this.game.add.group()
        };

        this.layers.background.add(new Background(this.game));
    }

    // -----------------------
    // Game logic
    // -----------------------

    update() {
        
    }
}