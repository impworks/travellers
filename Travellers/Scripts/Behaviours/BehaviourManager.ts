class BehaviourManager {
    
    // -----------------------
    // Constructor
    // -----------------------

    constructor(state: PlayState) {
        this._state = state;
        this._behaviours = [];
    }

    // -----------------------
    // Fields
    // -----------------------

    private _state: PlayState;
    private _behaviours: IBehaviour[];

    // -----------------------
    // Methods
    // -----------------------

    add(behaviour: IBehaviour) {
        this._behaviours.push(behaviour);
    }

    has(kind: any): boolean {
        return _.any(this._behaviours, b => b instanceof kind);
    }

    update() {
        this._behaviours.forEach(b => b.update(this._state));
        _.remove(this._behaviours, b => b.isFinished);
    }
} 