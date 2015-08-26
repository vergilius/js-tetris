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
