/// <reference path="LevelObject.ts"/>

class Character extends LevelObject {

    // -----------------------
    // Constructor
    // -----------------------
    
    constructor(state: PlayState, cellX: number, cellY: number) {
        this._state = state;
        super(state.game, cellX, cellY, 'Sprites/char');
        this.anchor.setTo(0.5, 0.75);

        this.animations.add('normal', [0]);
        this.animations.add('selected', [1]);
        this.animations.play('normal');

        this.inputEnabled = true;
        this.events.onInputDown.add(this.onClick, this);
    }

    // -----------------------
    // Fields
    // -----------------------

    private _state: PlayState;

    // -----------------------
    // Methods
    // -----------------------

    setSelected(isSelected: boolean) {
        this.animations.play(isSelected ? 'selected' : 'normal');
    }

    private onClick(self: Phaser.Sprite, pointer: Phaser.Pointer) {
        var chars = this._state.characters;
        
        if (chars.selected === this) {
            this.setSelected(false);
            chars.selected = null;
        } else {
            if (chars.selected)
                chars.selected.setSelected(false);

            this.setSelected(true);
            chars.selected = this;
        }
    }
} 