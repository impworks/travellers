/// <reference path="../../Objects/Wall.ts"/>

class LevelArea {

    // -----------------------------------
    // Constructor
    // -----------------------------------

    constructor(game: Phaser.Game, x: number, y: number) {
        this.areaX = x;
        this.areaY = y;
        this._game = game;
    }

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
            var randomPos = this.getAbsoluteCellXY(
                Math.random() * (Constants.CELLS_HORIZONTAL - 1),
                Math.random() * (Constants.CELLS_VERTICAL - 1)
            );
            objects.push(new Wall(this._game, randomPos.x, randomPos.y));
        }

        return objects;
    }

    getAbsoluteCellXY(cellX: number, cellY: number): Phaser.Point {
        return new Phaser.Point(
            Math.round(this.areaX * Constants.CELLS_HORIZONTAL + cellX),
            Math.round(this.areaY * Constants.CELLS_VERTICAL + cellY)
        );
    }
} 