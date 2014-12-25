/// <reference path="LevelBase.ts"/>

class Level1 extends LevelBase {

    // -----------------------------------
    // Methods
    // -----------------------------------

    protected createAreas(): LevelArea[] {
        return [
            new LevelArea(0, 0),
            new LevelArea(1, 0),
            new LevelArea(2, 0),
            new LevelArea(2, 1),
            new LevelArea(3, 1),
            new LevelArea(4, 1),
            new LevelArea(4, 0)
        ];
    }
} 