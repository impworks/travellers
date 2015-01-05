class Background extends Phaser.Group {
    // -----------------------
    // Constructor
    // -----------------------

    constructor(game: Phaser.Game) {
        super(game);

        this.add(this.createBackground(game));
        this.fixedToCamera = true;
    }

    // -----------------------
    // Methods
    // -----------------------

    createBackground(game: Phaser.Game): Phaser.Sprite {
        var bmp = game.add.bitmapData(Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
        bmp.context.fillStyle = '#8AD12B';
        bmp.context.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
        return new Phaser.Sprite(game, 0, 0, bmp);
    }
} 