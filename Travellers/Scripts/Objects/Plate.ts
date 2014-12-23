class Plate extends Phaser.Group {

    // -----------------------
    // Constructor
    // -----------------------

    constructor(game: Phaser.Game, public xCell: number, public yCell: number) {
        super(game);

        this.add(this.background = this.createCheckers(game));
        this.add(this.objects = new Phaser.Group(game));

        this.position.x = Constants.FIELD_OFFSET + xCell * Constants.FIELD_WIDTH;
        this.position.y = Constants.FIELD_OFFSET + yCell * Constants.FIELD_HEIGHT;
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
        var sprite = new Phaser.TileSprite(game, 0, 0, Constants.FIELD_WIDTH, Constants.FIELD_HEIGHT, 'Backgrounds/checkers');
        sprite.alpha = 0.1;
        return sprite;
    }
} 