var Tetris = require('./tetris-core');
var Config = require('./game-config');
var Block = require('./block');
var Figure = require('./figure');
var Phaser = require('./phaser');

Block.prototype.render = function() {
    return new Phaser.Rectangle(this.x, this.y, this.width, this.height);
};

var PhaserGame = function() {};

function createGrid(elems) {
    var i;

    for (i = 0; i <= Config.court.WIDTH; i++) {
        elems.push(new Phaser.Line(i * Config.block.WIDTH, 0,
            i * Config.block.WIDTH, Config.HEIGHT));
    }

    for (i = 0; i <= Config.court.HEIGHT; i++) {
        elems.push(new Phaser.Line(0, i * Config.block.HEIGHT,
            Config.WIDTH, i * Config.block.HEIGHT));
    }
}

var keyMap = {
    37: 'moveLeft',
    38: 'rotate',
    39: 'moveRight',
    40: 'moveDown'
};

PhaserGame.prototype = {

    init: function() {
        console.log('Init');

        this.cursors = null;
        this.elems = [];

        Tetris = new Tetris(Config, Block, Figure);
    },

    preload: function() {
        console.log('Preload');

        //@TODO: bring back background
        //this.load.image('sky', 'assets/sky.png');

        createGrid(this.elems);
    },

    create: function() {
        console.log('Create');

        this.input.keyboard.onUpCallback = function(keyboardEvent) {
            var eventName = keyMap[keyboardEvent.keyCode];
            if (eventName) {
                Tetris.trigger(eventName);
            }
        }.bind(this);

        //var sky = this.add.sprite(0, 0, 'sky');
        //sky.scale.setTo(1.25, 1.25);

        Tetris.run();
        Tetris.setCurrentPiece();
    },

    update: function() {
        Tetris.update(this._deltaTime);
    },

    render: function() {
        var blocks = Tetris.getAllBlocks();

        this.elems.forEach(function(elem) {
            this.game.debug.geom(elem);
        }.bind(this));

        blocks.forEach(function(blockInstance) {
            this.game.debug.geom(blockInstance.render());
        }.bind(this));
    }
};

module.exports = PhaserGame;
