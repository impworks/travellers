interface IBehaviour {
    update(state: PlayState): void;
    finished: boolean;
} 