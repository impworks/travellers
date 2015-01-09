class BehaviourManager {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(state: PlayState) {
        this._state = state;
        this._behaviours = [];
        this._hasBlocking = false;
    }

    // -----------------------
    // Fields
    // -----------------------

    private _state: PlayState;
    private _behaviours: BehaviourBase[];
    private _hasBlocking: boolean;

    // -----------------------
    // Methods
    // -----------------------

    add(behaviour: BehaviourBase) {
        this._behaviours.push(behaviour);
        behaviour.manager = this;

        if (behaviour.isBlocking) {
            this._hasBlocking = true;
        }
    }

    has(kind: any): boolean {
        return _.any(this._behaviours, b => b instanceof kind);
    }

    hasBlocking(): boolean {
        return this._hasBlocking;
    }

    update() {
        var hasBlocking = false;
        for (var i = this._behaviours.length - 1; i >= 0; i--) {
            var curr = this._behaviours[i];
            curr.update();

            if (curr.isFinished) {
                this._behaviours.splice(i, 1);
                curr.manager = null;
            } else {
                hasBlocking = hasBlocking || curr.isBlocking;
            }
        }
        this._hasBlocking = hasBlocking;
    }
} 