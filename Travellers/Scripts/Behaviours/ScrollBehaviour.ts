/// <reference path="MoveBehaviourBase.ts"/>

class ScrollBehaviour extends MoveBehaviourBase {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(dir: Direction, speed: number, game: Phaser.Game) {
        super(dir, Constants.CELL_SIZE, speed);
        this._cam = game.camera;
        this.isBlocking = true;
    }

    // -----------------------
    // Fields
    // -----------------------

    private _cam: Phaser.Camera;

    // -----------------------
    // Methods
    // -----------------------

    xStep(value: number) {
        this._cam.x += value;
    }

    yStep(value: number) {
        this._cam.y += value;
    }
} 