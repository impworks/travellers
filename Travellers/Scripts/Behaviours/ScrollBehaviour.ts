/// <reference path="MoveBehaviourBase.ts"/>

class ScrollBehaviour extends MoveBehaviourBase {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(dir: Direction, game: Phaser.Game) {
        super(dir, 1);
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