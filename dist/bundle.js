(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Holds single block data
 * @param x - top left corner
 * @param y - top left corner
 * @param width
 * @param height
 * @constructor
 */
function Block(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 1;
    this.height = height || 1;
}

module.exports = Block;

},{}],2:[function(require,module,exports){
/**
 * Understands what kind of figure it is.
 * Know how to translate from figure to blocks
 *
 * @param type - figure type
 * @param direction - check game-config.js options
 * @param x - top left corner
 * @param y - top left corner
 * @constructor
 */
function Figure(type, direction, x, y) {
    this.type = type;
    this.direction = direction;
    this.x = x;
    this.y = y;
}

/**
 * @TODO: lets rebuild it with simple 'clone' method
 * Translates data from this class to allow to clone it
 * @returns {{type: *, direction: *, x: *, y: *}}
 */
Figure.prototype.serialize = function() {
    return {
        type: this.type,
        direction: this.direction,
        x: this.x,
        y: this.y
    };
};

/**
 * Iterates over all blocks in figure
 * @param callback
 */
Figure.prototype.forEachBlock = function(callback) {
    var bit;
    var row = 0;
    var col = 0;
    var blocks = this.type.blocks[this.direction];

    for (bit = 0x8000; bit > 0; bit = bit >> 1) {
        if (blocks & bit) {
            callback(this.x + col, this.y + row, this.type);
        }

        if (++col === 4) {
            col = 0;
            ++row;
        }
    }
};

module.exports = Figure;

},{}],3:[function(require,module,exports){
/**
 * Configuration object used in core
 */
var Config = {
    direction: {
        UP: 0,
        RIGHT: 1,
        DOWN: 2,
        LEFT: 3,
        MIN: 0,
        MAX: 3
    },
    block: {
        WIDTH: 25,
        HEIGHT: 25
    },
    court: {
        WIDTH: 12,
        HEIGHT: 20
    },
    get WIDTH () {
        return this.block.WIDTH * this.court.WIDTH;
    },

    get HEIGHT () {
        return this.block.HEIGHT * this.court.HEIGHT;
    }
};

module.exports = Config;

},{}],4:[function(require,module,exports){
var Phaser = require('./phaser');
var PhaserGame = require('./phaser-game');
var Config = require('./game-config');

var tetris = new Phaser.Game(Config.WIDTH, Config.HEIGHT, Phaser.CANVAS, '');
tetris.state.add('Game', PhaserGame, true);

},{"./game-config":3,"./phaser":6,"./phaser-game":5}],5:[function(require,module,exports){
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

},{"./block":1,"./figure":2,"./game-config":3,"./phaser":6,"./tetris-core":7}],6:[function(require,module,exports){
module.exports = window.Phaser;

},{}],7:[function(require,module,exports){
function random(min, max) {
    return Math.floor(min + Math.random() * max);
}

function Tetris(Config, BlockClass, FigureClass) {

    this.validate(Config, BlockClass, FigureClass);

    this.Config = Config;
    this.BlockClass = BlockClass;
    this.FigureClass = FigureClass;

    this._events = {};

    this.currentPiece = null;
    this.running = false;
    this.blocks = {};

    this.pieces = {
        i: {id: 'i', size: 4, blocks: [0x00F0, 0x4444, 0x00F0, 0x4444]},
        j: {id: 'j', size: 3, blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20]},
        l: {id: 'l', size: 3, blocks: [0x4460, 0x0E80, 0xC440, 0x2E00]},
        o: {id: 'o', size: 2, blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00]},
        s: {id: 's', size: 3, blocks: [0x06C0, 0x4620, 0x06C0, 0x4620]},
        t: {id: 't', size: 3, blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640]},
        z: {id: 'z', size: 3, blocks: [0x0C60, 0x2640, 0x0C60, 0x2640]}
    };
    this.piecesLeft = ['i', 'i', 'i', 'i',
        'j', 'j', 'j', 'j',
        'l', 'l', 'l', 'l',
        'o', 'o', 'o', 'o',
        's', 's', 's', 's',
        't', 't', 't', 't',
        'z', 'z', 'z', 'z'];

    this.listen();

    this.__frames = 0;
    this.__FPSMod = 10;
}

Tetris.prototype.listen = function() {
    this.on('rotate', function() {
        this.rotateCurrent();
    }.bind(this));

    this.on('moveLeft', function() {
        this.moveCurrent(this.Config.direction.LEFT);
    }.bind(this));

    this.on('moveRight', function() {
        this.moveCurrent(this.Config.direction.RIGHT);
    }.bind(this));

    this.on('moveDown', function() {
        this.__FPSMod = 0;
    }.bind(this));
};

/**
 * @todo: should validate classes directly
 * @param Config
 * @param BlockClass
 * @param FigureClass
 */
Tetris.prototype.validate = function(Config, BlockClass, FigureClass) {
    if (!Config || !BlockClass || !FigureClass) {
        throw new Error('Missing Config, BlockClass or FigureClass');
    }
};

Tetris.prototype.on = function(event, callback) {
    console.log('listening to event:', event);
    if (!this._events[event]) {
        this._events[event] = [];
    }

    this._events[event].push(callback);
};

Tetris.prototype.trigger = function(event, data) {
    console.log('triggering event:', event, data);
    if (this._events[event]) {
        this._events[event].forEach(function(callback) {
            callback.call(this, data);
        }.bind(this));
    }
};

Tetris.prototype.run = function() {
    this.running = true;
};

Tetris.prototype.pause = function() {
    this.running = false;
};

Tetris.prototype.placeAvailableFor = function(current) {
    var result = true;

    current.forEachBlock(function(x, y) {
        if (((x < 0) || (x >= this.Config.court.WIDTH) ||
            (y >= this.Config.court.HEIGHT)) ||
            !!this.getBlockFromPosition(x, y)) {

            result = false;
        }
    }.bind(this));

    return result;
};

Tetris.prototype.randomFigure = function() {
    if (this.piecesLeft.length === 0) {
        this.piecesLeft = ['i', 'i', 'i', 'i',
            'j', 'j', 'j', 'j',
            'l', 'l', 'l', 'l',
            'o', 'o', 'o', 'o',
            's', 's', 's', 's',
            't', 't', 't', 't',
            'z', 'z', 'z', 'z'];
    }

    var type = this.pieces[this.piecesLeft.splice(
        random(0, this.piecesLeft.length - 1), 1)];

    return new this.FigureClass(
        type,
        this.Config.direction.UP,
        Math.round(random(0, this.Config.court.WIDTH - type.size)),
        -4
    );
};

Tetris.prototype.placeFigure = function() {
    var current = this.getCurrent();

    current.forEachBlock(function(x, y, type) {
        this.placeBlock(x, y, type);
        this.__FPSMod = 10;

        if (y <= 0) {
            this.pause();
            this.trigger('gameOver');
        }
    }.bind(this));
};

Tetris.prototype.getCurrent = function() {
    return this.currentPiece;
};

Tetris.prototype.setCurrentPiece = function(piece) {
    this.currentPiece = piece || this.randomFigure();
};

Tetris.prototype.getBlockFromPosition = function(x, y) {
    if (this.blocks[x]) {
        return this.blocks[x][y];
    }

    return null;
};

Tetris.prototype.placeBlock = function(x, y, type) {
    if (!this.blocks[x]) {
        this.blocks[x] = {};
    }

    this.blocks[x][y] = type;
};

Tetris.prototype.getCurrentBlocks = function() {
    var current = this.getCurrent();
    var blocks = [];

    current.forEachBlock(function(x, y, type) {
        blocks.push(this.createBlock(x, y, type.color));
    }.bind(this));

    return blocks;
};

Tetris.prototype.getPlacedBlocks = function() {
    var block;
    var blocks = [];

    for (var y = 0 ; y < this.Config.court.HEIGHT; y++) {
        for (var x = 0 ; x < this.Config.court.WIDTH; x++) {
            block = this.getBlockFromPosition(x, y);
            if (block) {
                blocks.push(this.createBlock(x, y, block.color));
            }
        }
    }

    return blocks;
};

Tetris.prototype.createBlock = function(x, y) {
    return new this.BlockClass(x * this.Config.block.WIDTH,
        y * this.Config.block.HEIGHT,
        this.Config.block.WIDTH,
        this.Config.block.HEIGHT);
};

Tetris.prototype.rotateCurrent = function() {
    var current = this.getCurrent();
    var currentProperties;
    var previous;

    if (current) {
        currentProperties = current.serialize();
        previous = new this.FigureClass(currentProperties.type,
            currentProperties.direction,
            currentProperties.x,
            currentProperties.y);

        current.direction = (current.direction === this.Config.direction.MAX ?
            this.Config.direction.MIN : current.direction + 1);

        if (!this.placeAvailableFor(current, 'rotate')) {
            this.setCurrentPiece(previous);
        }
    }
};

Tetris.prototype.moveCurrent = function(direction) {
    var current = this.getCurrent();
    var currentProperties = current.serialize();
    var previous = new this.FigureClass(currentProperties.type,
            currentProperties.direction,
            currentProperties.x,
            currentProperties.y);

    switch (direction) {
        case this.Config.direction.RIGHT :
            current.x += 1;
            break;
        case this.Config.direction.LEFT :
            current.x -= 1;
            break;
        case this.Config.direction.DOWN :
            current.y += 1;
            break;
    }

    if (this.placeAvailableFor(current)) {
        return true;
    }

    this.setCurrentPiece(previous);

    return false;
};

Tetris.prototype.placeCurrent = function() {
    var current = this.getCurrent();
    current.place = true;
};

Tetris.prototype.handleLines = function() {
    var x;
    var y;
    var complete;
    var n = 0;

    for (y = this.Config.court.HEIGHT; y > 0; --y) {
        complete = true;

        for (x = 0 ; x < this.Config.court.WIDTH; ++x) {
            if (!this.getBlockFromPosition(x, y)) {
                complete = false;
            }

        }

        if (complete) {
            this.removeLine(y);
            y = y + 1; // recheck same line
            n++;
        }
    }

    if (n > 0) {
        this.trigger('scored', n);

        // example scoring: 100*Math.pow(2, n-1)
        // 1: 100, 2: 200, 3: 400, 4: 800
    }
};

Tetris.prototype.removeLine = function(top) {
    var x;
    var y;

    for (y = top ; y >= 0 ; --y) {
        for (x = 0 ; x < this.Config.court.WIDTH; ++x) {
            this.placeBlock(x, y, (y === 0) ?
                null : this.getBlockFromPosition(x, y - 1));
        }
    }
};

Tetris.prototype.shouldUpdate = function() {
    if (this.__frames > this.__FPSMod) {
        this.__frames = 0;
        return true;
    }

    this.__frames++;
    return false;
};

Tetris.prototype.update = function(delta) {
    if (!this.running) {
        return;
    }

    if (this.shouldUpdate(delta)) {
        if (!this.moveCurrent(this.Config.direction.DOWN)) {
            this.placeFigure();
            this.handleLines();
            this.setCurrentPiece();
        }
    }
};

Tetris.prototype.getAllBlocks = function() {
    var current = this.getCurrentBlocks();
    var blocks = this.getPlacedBlocks();

    if (current) {
        return current.concat(blocks);
    } else {
        return blocks;
    }

};

module.exports = Tetris;

},{}]},{},[4]);
