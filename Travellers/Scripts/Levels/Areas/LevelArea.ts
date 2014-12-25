class LevelArea {

    // -----------------------------------
    // Constructor
    // -----------------------------------

    constructor(game: Phaser.Game, x: number, y: number) {
        this.areaX = x;
        this.areaY = y;
        this._game = game;
    }

    // -----------------------------------
    // Fields
    // -----------------------------------

    areaX: number;
    areaY: number;
    protected _game: Phaser.Game;

    // -----------------------------------
    // Methods
    // -----------------------------------

    createObjects(): LevelObject[]{

        /// <summary>Creates area objects.</summary>

        var objects = [];
        for (var i = 0; i < 3; i++) {
            var obj = new LevelObject(this._game, Math.random() * Constants.CELLS_HORIZONTAL, Math.random() * Constants.CELLS_VERTICAL);
            objects.push(obj);
        }

        return objects;
    }
} 