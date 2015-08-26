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
