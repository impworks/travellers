class BehaviourBase {

    // -----------------------
    // Constructor
    // -----------------------

    constructor() {
        this._isFinished = false;
    }
    
    // -----------------------
    // Fields
    // -----------------------

    onFinished: Action;
    isBlocking: boolean;

    manager: BehaviourManager;

    private _isFinished: boolean;

    // -----------------------
    // Properties
    // -----------------------

    get isFinished(): boolean {
        return this._isFinished;
    }

    set isFinished(value: boolean) {
        if (this._isFinished || !value)
            return;

        this._isFinished = true;
        if (this.onFinished) {
            this.onFinished();
        }
    }

    // -----------------------
    // Methods
    // -----------------------

    update() {
        // to be overridden in children
    }
} 