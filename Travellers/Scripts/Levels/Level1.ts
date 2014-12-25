/// <reference path="LevelBase.ts"/>

class Level1 extends LevelBase {

    // -----------------------------------
    // Constructor
    // -----------------------------------
    
    constructor(game: Phaser.Game) {
        super(game);
    }

    // -----------------------------------
    // Methods
    // -----------------------------------

    protected createAreas(): LevelArea[] {
        return [
            new LevelArea(this._game, 0, 0),
            new LevelArea(this._game, 1, 0),
            new LevelArea(this._game, 2, 0),
            new LevelArea(this._game, 2, 1),
            new LevelArea(this._game, 3, 1),
            new LevelArea(this._game, 4, 1),
            new LevelArea(this._game, 4, 0)
        ];
    }
} 