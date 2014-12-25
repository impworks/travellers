class LevelObject extends Phaser.Sprite {

    // -----------------------------------
    // Constructor
    // -----------------------------------

    constructor(game: Phaser.Game, public areaX: number, public areaY: number) {
        super(game, Math.round(areaX + 0.5 * Constants.CELL_SIZE), Math.round(areaY + 0.5 * Constants.CELL_SIZE));

        var gfx = new Phaser.Graphics(this.game, 0, 0);
        gfx.beginFill(0xFFFF00);
        gfx.drawRect(0, 0, 32, 64);
        gfx.endFill();

        this.addChild(gfx);
        this.anchor.set(16, 32);
    }
} 