class LevelBase {

    // -----------------------------------
    // Fields
    // -----------------------------------

    private _areas: Func<LevelArea>[];
    private _currentAreaId: number;

    // -----------------------------------
    // Properties
    // -----------------------------------

    get worldWidth(): number {
        return 0;
    }

    get worldHeight(): number {
        return 0;
    }

    // -----------------------------------
    // Methods
    // -----------------------------------

    protected createAreas(): Func<LevelArea>[] {
        return [];
    }

    getNextArea(): LevelArea {
        if(typeof  this._areas === "undefined")
            this._areas = this.createAreas();

        if (typeof this._currentAreaId === "undefined")
            this._currentAreaId = 0;

        return this._currentAreaId < this._areas.length
            ? this._areas[this._currentAreaId++]()
            : null;
    }
} 