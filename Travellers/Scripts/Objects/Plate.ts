class Plate extends Phaser.Group {

    // -----------------------
    // Constructor
    // -----------------------

    constructor(game: Phaser.Game) {
        super(game);

        this.add(this.background = this.createCheckers(game));
        this.add(this.objects = new Phaser.Group(game));
    }

    // -----------------------
    // Fields
    // -----------------------

    background: Phaser.TileSprite;
    objects: Phaser.Group;

    // -----------------------
    // Update
    // -----------------------

    update() {
        this.objects.sort('y', Phaser.Group.SORT_ASCENDING);
    }

    // -----------------------
    // Helpers
    // -----------------------

    createCheckers(game: Phaser.Game): Phaser.TileSprite {
        var sprite = new Phaser.TileSprite(game, Constants.FIELD_OFFSET, Constants.FIELD_OFFSET, Constants.FIELD_WIDTH, Constants.FIELD_HEIGHT, 'Backgrounds/checkers');
        sprite.alpha = 0.1;
        return sprite;
    }
} 