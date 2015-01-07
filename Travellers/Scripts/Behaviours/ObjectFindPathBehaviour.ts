class ObjectFindPathBehaviour extends BehaviourBase {

    // -----------------------
    // Constructor
    // -----------------------

    constructor(obj: LevelObject, map: number[][], cellX: number, cellY: number, callback?: Action) {
        super();

        this._finder = new EasyStar.js();
        this._finder.disableDiagonals();
        this._finder.setGrid(map);
        this._finder.setAcceptableTiles([0]);

        this._finder.findPath(obj.cellX, obj.cellY, cellX, cellY, path => {
            if(path)
                this.manager.add(new ObjectPathBehaviour(obj, path, 8, callback));
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