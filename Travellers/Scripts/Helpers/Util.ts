class Util {

    static cellPosition(cellX: number, cellY: number): Phaser.Point {

        /// <summary>Returns the center of the cell relative to top left screen corner.</summary>

        return new Phaser.Point(
            (Math.round(cellX) + 0.5) * Constants.CELL_SIZE + Constants.FIELD_OFFSET,
            (Math.round(cellY) + 0.5) * Constants.CELL_SIZE + Constants.FIELD_OFFSET
        );
    }
}  