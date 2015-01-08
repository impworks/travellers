class PathPellet extends LevelObject {

    // -----------------------
    // Constructor
    // -----------------------
    
    constructor(game: Phaser.Game, cellX: number, cellY: number, isOk: boolean) {
        super(game, cellX, cellY, 'Sprites/path-' + (isOk ? 'pellet' : 'error'));
        this.anchor.setTo(0.5, 0.5);

        if (!isOk) {
            setTimeout(() => this.destroy(true), 500);
        }
    }
} 