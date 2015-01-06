class MoveBehaviourBase extends BehaviourBase {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(dir: Direction, distance: number, speed: number) {
        super();

        this.isBlocking = true;

        this._speed = speed;
        this._xDirection = dir === Direction.Left ? -1 : 1;
        this._yDirection = dir === Direction.Up ? -1 : 1;
        this._x = dir === Direction.Left || dir === Direction.Right ? distance * this._xDirection * -1 : 0;
        this._y = dir === Direction.Up || dir === Direction.Down ? distance * this._yDirection * -1 : 0;
    }

    // -----------------------
    // Fields
    // -----------------------

    private _speed: number;
    private _x: number;
    private _y: number;
    private _xDirection: number;
    private _yDirection: number;

    // -----------------------
    // Methods
    // -----------------------

    xStep(value: number) {
        // do something
    }

    yStep(value: number) {
        // do something
    }

    // -----------------------
    // IBehaviour
    // -----------------------

    update() {
        if (this.isFinished) {
            return;
        }

        var xStep = Math.min(this._speed, Math.abs(this._x)) * this._xDirection;
        this._x += xStep;
        this.xStep(xStep);

        var yStep = Math.min(this._speed, Math.abs(this._y)) * this._yDirection;
        this._y += yStep;
        this.yStep(yStep);

        if (this._x === 0 && this._y === 0) {
            this.isFinished = true;
        }
    }
} 