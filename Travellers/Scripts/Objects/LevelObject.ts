class LevelObject extends Phaser.Sprite {

    // -----------------------------------
    // Constructor
    // -----------------------------------

    constructor(game: Phaser.Game, public areaX: number, public areaY: number) {
        super(game, (Math.round(areaX) + 0.5) * Constants.CELL_SIZE, (Math.round(areaY) + 0.5) * Constants.CELL_SIZE, 'Sprites/wall');
        this.anchor.setTo(0.5, (128 - (96/2)) / 128);
    }
} 