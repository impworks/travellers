/// <reference path="LevelObject.ts"/>

class Wall extends LevelObject {
    
    constructor(game: Phaser.Game, cellX: number, cellY: number) {
        super(game, cellX, cellY, 'Sprites/wall');
        this.anchor.setTo(0.5, (128 - (96 / 2)) / 128);
    }
} 