var Phaser = require('./phaser');
var PhaserGame = require('./phaser-game');
var Config = require('./game-config');

var tetris = new Phaser.Game(Config.WIDTH, Config.HEIGHT, Phaser.CANVAS, '');
tetris.state.add('Game', PhaserGame, true);
