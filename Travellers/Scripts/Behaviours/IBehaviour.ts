interface IBehaviour {
    update(state: PlayState): void;
    isFinished: boolean;
} 