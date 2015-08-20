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
