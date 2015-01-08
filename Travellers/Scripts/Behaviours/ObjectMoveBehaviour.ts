/// <reference path="MoveBehaviourBase.ts"/>

class ObjectMoveBehaviour extends MoveBehaviourBase {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(object: LevelObject, dir: Direction, distance: number, callback?: Action) {
        super(dir, distance);
        this._object = object;

        this.onFinished = () => {
            var vec = Util.getDirectionVector(dir);
            object.cellX += vec.x * distance;
            object.cellY += vec.y * distance;

            if (callback)
                callback();
        };
    }

    // -----------------------
    // Fields
    // -----------------------

    private _object: LevelObject;

    // -----------------------
    // Methods
    // -----------------------

    xStep(value: number) {
        this._object.x += value;
    }

    yStep(value: number) {
        this._object.y += value;
    }
} 