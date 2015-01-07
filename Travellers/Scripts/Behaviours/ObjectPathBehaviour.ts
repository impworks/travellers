/// <reference path="ObjectMoveBehaviour.ts"/>

class ObjectPathBehaviour extends BehaviourBase {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(object: LevelObject, points: {x:number; y:number}[], speed: number, callback?: Action) {
        super();

        this._object = object;
        this._points = points;
        this._speed = speed;
        this.onFinished = callback;
    }

    // -----------------------
    // Fields
    // -----------------------

    private _object: LevelObject;
    private _points: { x: number; y: number }[];
    private _speed: number;

    private _isStarted: boolean;

    // -----------------------
    // Methods
    // -----------------------

    private moveToPoint(pointId: number) {

        /// <summary>Recursively traverses the object across specified points.</summary>

        var point = this._points[pointId];
        var obj = this._object;

        var movement = Util.getMovement(obj.cellX, obj.cellY, point.x, point.y);
        this.manager.add(
            new ObjectMoveBehaviour(obj, movement.dir, movement.distance * Constants.CELL_SIZE, 8, () => {
                obj.cellX = point.x;
                obj.cellY = point.y;

                if (pointId < this._points.length - 1) {
                    this.moveToPoint(pointId + 1);
                } else {
                    this.isFinished = true;
                }
            })
        );
    }

    // -----------------------
    // IBehaviour
    // -----------------------

    update() {
        if (this.isFinished || this._isStarted) {
            return;
        }

        this.moveToPoint(0);
        this._isStarted = true;
    }
} 