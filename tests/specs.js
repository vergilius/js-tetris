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
var Block = require('../../src/block');

describe('Block value object', function() {
    it('Should initialize with default (empty) values', function() {
        var block = new Block();
        expect(block.x).toBe(0);
        expect(block.y).toBe(0);
        expect(block.width).toBe(1);
        expect(block.height).toBe(1);
    });
});

},{"../../src/block":1}],4:[function(require,module,exports){
var Figure = require('../../src/figure');

describe('Figure class', function() {
    it('Should initialize all properties', function() {
        var figure = new Figure(1, 2, 3);
        expect(figure.type).toBe(1);
        expect(figure.direction).toBe(2);
        expect(figure.x).toBe(3);
        expect(figure.y).toBe(undefined);
    });

    it('Should serialize its properties', function() {
        var figure = new Figure(1, 2, null, 4);
        var serializedProperties = figure.serialize();

        expect(serializedProperties).toEqual({
            type: 1,
            direction: 2,
            x: null,
            y: 4
        });
    });
});

},{"../../src/figure":2}]},{},[3,4]);
