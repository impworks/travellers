class ScrollBehaviour implements IBehaviour {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(private dir: Direction, private speed: number) {
        this._finished = false;
        this._xDirection = dir === Direction.Left ? -1 : 1;
        this._yDirection = dir === Direction.Up ? -1 : 1;
        this._x = dir === Direction.Left || dir === Direction.Right ? Constants.CELL_SIZE * this._xDirection : 0;
        this._y = dir === Direction.Up || dir === Direction.Down ? Constants.CELL_SIZE * this._xDirection : 0;
    }

    // -----------------------
    // Fields
    // -----------------------

    private _x: number;
    private _y: number;
    private _xDirection: number;
    private _yDirection: number;
    private _finished: boolean;

    // -----------------------
    // IBehaviour
    // -----------------------

    get finished(): boolean {
        return this._finished;
    }

    update(state: PlayState) {
        if (this._finished) {
            return;
        }

        var xStep = Math.min(this.speed, Math.abs(this._x)) * this._xDirection;
        this._x -= xStep;
        state.game.camera.x += xStep;

        var yStep = Math.min(this.speed, Math.abs(this._y)) * this._yDirection;
        this._y -= yStep;
        state.game.camera.y += yStep;

        if (this._x === 0 && this._y === 0) {
            this._finished = true;
        }
    }
} 