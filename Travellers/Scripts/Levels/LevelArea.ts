class LevelArea {

    // -----------------------------------
    // Constructor
    // -----------------------------------

    constructor(x: number, y: number) {
        this.areaX = x;
        this.areaY = y;
    }

    // -----------------------------------
    // Fields
    // -----------------------------------

    areaX: number;
    areaY: number;
    objects: LevelObject[];
} 