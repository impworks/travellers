interface IBehaviour {
    update(): void;
    isFinished: boolean;
    manager: BehaviourManager;
} 