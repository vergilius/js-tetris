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
