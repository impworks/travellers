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
    private _behaviours: BehaviourBase[];

    // -----------------------
    // Methods
    // -----------------------

    add(behaviour: BehaviourBase) {
        this._behaviours.push(behaviour);
        behaviour.manager = this;
    }

    has(kind: any): boolean {
        return _.any(this._behaviours, b => b instanceof kind);
    }

    hasBlocking(): boolean {
        return _.any(this._behaviours, b => b.isBlocking);
    }

    update() {
        this._behaviours.forEach(b => b.update());

        var removed = _.remove(this._behaviours, b => b.isFinished);
        removed.forEach(b => b.manager = null);
    }
} 