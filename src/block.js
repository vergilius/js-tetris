/**
 * Holds single block data
 * @param x - top left corner
 * @param y - top left corner
 * @param width
 * @param height
 * @constructor
 */
function Block(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

module.exports = Block;
