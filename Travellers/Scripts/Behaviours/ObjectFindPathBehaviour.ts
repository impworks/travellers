class ObjectFindPathBehaviour extends BehaviourBase {

    // -----------------------
    // Constructor
    // -----------------------

    constructor(obj: LevelObject, map: number[][], cellX: number, cellY: number, callback?: ActionT1<EasyStar.Position[]>) {
        super();

        this._finder = new EasyStar.js();
        this._finder.disableDiagonals();
        this._finder.setGrid(map);
        this._finder.setAcceptableTiles([0]);

        this._finder.findPath(obj.cellX, obj.cellY, cellX, cellY, path => {
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