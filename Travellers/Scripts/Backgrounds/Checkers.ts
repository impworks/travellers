class Checkers extends Phaser.TileSprite {

    // -----------------------------------
    // Constructor
    // -----------------------------------

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, 0, 0, Constants.FIELD_WIDTH, Constants.FIELD_HEIGHT, 'Backgrounds/checkers');

        this.alpha = 0.1;

        this.areaX = x;
        this.areaY = y;
        this.x = Constants.FIELD_OFFSET + x * Constants.FIELD_WIDTH;
        this.y = Constants.FIELD_OFFSET + y * Constants.FIELD_HEIGHT;
    }

    // -----------------------------------
    // Fields
    // -----------------------------------

    areaX: number;
    areaY: number;
} 