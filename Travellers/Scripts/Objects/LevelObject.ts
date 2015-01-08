class LevelObject extends Phaser.Sprite {

    // -----------------------------------
    // Constructor
    // -----------------------------------

    constructor(game: Phaser.Game, cellX: number, cellY: number, animKey: string) {
        var pos = Util.cellPosition(cellX, cellY);
        super(game, pos.x, pos.y, animKey);

        this.cellX = Math.round(cellX);
        this.cellY = Math.round(cellY);
    }

    // -----------------------------------
    // Fields
    // -----------------------------------

    cellX: number;
    cellY: number;
} 