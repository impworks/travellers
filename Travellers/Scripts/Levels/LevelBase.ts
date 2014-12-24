class LevelBase {

    // -----------------------------------
    // Fields
    // -----------------------------------

    private _areas: LevelArea[];

    // -----------------------------------
    // Properties
    // -----------------------------------

    get worldWidth(): number {
        return _.max(this.areas, x => x.areaX).areaX;
    }

    get worldHeight(): number {
        return _.max(this.areas, x => x.areaY).areaY;
    }

    get areas(): LevelArea[] {
        if (!this._areas) {
            this._areas = this.createAreas();
        }

        return this._areas;
    }

    // -----------------------------------
    // Methods
    // -----------------------------------

    protected createAreas(): LevelArea[] {
        return [];
    }
} 