class Background extends Phaser.Group {

    // -----------------------
    // Constants
    // -----------------------

    static FIELD_OFFSET: number = 32;
    static FIELD_WIDTH: number = 96 * 8;
    static FIELD_HEIGHT: number = 96 * 6;

    // -----------------------
    // Constructor
    // -----------------------

    constructor(game: Phaser.Game) {
        super(game);

        this.add(this.createBackground(game));
        this.add(this.createCheckers(game));
    }

    // -----------------------
    // Methods
    // -----------------------

    createBackground(game: Phaser.Game) : Phaser.Sprite {
        var bmp = game.add.bitmapData(TravellersGame.SCREEN_WIDTH, TravellersGame.SCREEN_HEIGHT);
        var grad = bmp.context.createLinearGradient(0, 0, 0, TravellersGame.SCREEN_HEIGHT);
        grad.addColorStop(0, "#91DE2C");
        grad.addColorStop(1, "#8AD12B");
        bmp.context.fillStyle = grad;
        bmp.context.fillRect(0, 0, TravellersGame.SCREEN_WIDTH, TravellersGame.SCREEN_HEIGHT);
        return new Phaser.Sprite(game, 0, 0, bmp);
    }

    createCheckers(game: Phaser.Game): Phaser.TileSprite {
        var sprite = new Phaser.TileSprite(game, Background.FIELD_OFFSET, Background.FIELD_OFFSET, Background.FIELD_WIDTH, Background.FIELD_HEIGHT, 'Backgrounds/checkers');
        sprite.alpha = 0.1;
        return sprite;
    }
} 