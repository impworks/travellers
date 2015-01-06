﻿/// <reference path="MoveBehaviourBase.ts"/>

class ScrollBehaviour extends MoveBehaviourBase {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(dir: Direction, speed: number, state: PlayState) {
        super(dir, Constants.CELL_SIZE, speed);
        this._state = state;
    }

    // -----------------------
    // Fields
    // -----------------------

    private _state: PlayState;

    // -----------------------
    // Methods
    // -----------------------

    xStep(value: number) {
        this._state.game.camera.x += value;
    }

    yStep(value: number) {
        this._state.game.camera.y += value;
    }
} 