class TravellersGame extends Phaser.Game {
    // -----------------------
    // Constructor
    // -----------------------
    constructor() {
        super(Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT, Phaser.AUTO);

        this.state.add('Play', PlayState, false);
        this.state.start('Play');
    }
}

window.onload = () => new TravellersGame();