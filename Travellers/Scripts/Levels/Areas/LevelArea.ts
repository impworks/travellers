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
    public _game: Phaser.Game;

    // -----------------------------------
    // Methods
    // -----------------------------------

    createObjects(): LevelObject[]{

        /// <summary>Creates area objects.</summary>

        var objects = [];
        for (var i = 0; i < 6; i++) {
            var obj = new LevelObject(this._game, Math.random() * (Constants.CELLS_HORIZONTAL-1), Math.random() * (Constants.CELLS_VERTICAL-1));
            objects.push(obj);
        }

        return objects;
    }
} 