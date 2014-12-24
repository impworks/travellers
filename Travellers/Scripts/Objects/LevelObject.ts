class LevelObject extends Phaser.Sprite {

    // -----------------------------------
    // Constructor
    // -----------------------------------

    constructor(game: Phaser.Game, spriteKey: any, public areaX: number, public areaY: number) {
        super(game, 0, 0, spriteKey);
    }
} 