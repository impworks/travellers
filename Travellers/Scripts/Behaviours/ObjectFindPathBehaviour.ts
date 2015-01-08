class ObjectFindPathBehaviour extends BehaviourBase {

    // -----------------------
    // Constructor
    // -----------------------

    constructor(obj: LevelObject, map: IPathMap, cellX: number, cellY: number, callback?: ActionT1<EasyStar.Position[]>) {
        super();

        this._finder = new EasyStar.js();
        this._finder.disableDiagonals();
        this._finder.setGrid(map.map);
        this._finder.setAcceptableTiles([0]);

        this._finder.findPath(obj.cellX - map.cellX, obj.cellY - map.cellY, cellX - map.cellX, cellY - map.cellY, path => {
            callback(path);
            this.isFinished = true;
        });
    }

    // -----------------------
    // Fields
    // -----------------------

    private _finder: EasyStar.js;

    // -----------------------
    // IBehaviour
    // -----------------------

    update() {
        this._finder.calculate();
    }
}

interface IPathMap {
    map: number[][];
    cellX: number;
    cellY: number;
}