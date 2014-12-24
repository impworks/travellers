/// <reference path="LevelBase.ts"/>

class Level1 extends LevelBase {

    // -----------------------------------
    // Fields
    // -----------------------------------

    get worldWidth(): number {
        return 2;
    }

    get worldHeight(): number {
        return 2;
    }

    // -----------------------------------
    // Methods
    // -----------------------------------

    protected createAreas(): Func<LevelArea>[] {
        return [
            () => new LevelArea(0, 0),
            () => new LevelArea(1, 0),
            () => new LevelArea(1, 1),
            () => new LevelArea(2, 1)
        ];
    }
} 