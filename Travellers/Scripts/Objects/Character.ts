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
        var chars = this._state.characters;

        if (isSelected) {
            if (chars.selected) {
                chars.selected.animations.play('normal');
            }
            chars.selected = this;
        } else {
            chars.selected = null;
        }

        this.animations.play(isSelected ? 'selected' : 'normal');

    }

    private onClick(self: Phaser.Sprite, pointer: Phaser.Pointer) {
        this.setSelected(this !== this._state.characters.selected);
    }
} 