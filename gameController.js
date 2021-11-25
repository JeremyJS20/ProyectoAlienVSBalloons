import * as scenePlayGame from './Scenes/scenePlayGame.js';
import * as scenes from './Scenes/scenes.js';

//configuraciones generales del juego
var gameConfig = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    transparent: true,

    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [
        scenes.sceneStartGame,
        scenePlayGame.default,
        scenes.default,
        scenes.sceneWon,
        scenes.sceneLose,
    ]
};

var game = new Phaser.Game(gameConfig);

export {game as default}