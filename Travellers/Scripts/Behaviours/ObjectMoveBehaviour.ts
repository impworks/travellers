/// <reference path="MoveBehaviourBase.ts"/>

class ObjectMoveBehaviour extends MoveBehaviourBase {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(object: LevelObject, dir: Direction, distance: number, speed: number, callback?: Action) {
        super(dir, distance, speed);
        this._object = object;
        this.callback = callback;
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