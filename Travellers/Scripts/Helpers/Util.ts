class Util {

    static cellPosition(cellX: number, cellY: number): Phaser.Point {

        /// <summary>Returns the center of the cell relative to top left screen corner.</summary>

        return new Phaser.Point(
            (Math.round(cellX) + 0.5) * Constants.CELL_SIZE + Constants.FIELD_OFFSET,
            (Math.round(cellY) + 0.5) * Constants.CELL_SIZE + Constants.FIELD_OFFSET
        );
    }

    static getDirection(x1: number, y1: number, x2: number, y2: number): Direction {
        if (x1 > x2) return Direction.Left;
        if (x1 < x2) return Direction.Right;
        if (y1 > y2) return Direction.Up;
        if (y1 < y2) return Direction.Down;
    }

    static getMovement(x1: number, y1: number, x2: number, y2: number): { dir: Direction; distance: number } {
        return {
            dir: Util.getDirection(x1, y1, x2, y2),
            distance: Math.abs(x1 - x2 || y1 - y2)
        };
    }
}  