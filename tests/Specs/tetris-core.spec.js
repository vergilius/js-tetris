var Tetris = require('../../src/tetris-core');

describe('Tetris class', function() {
    it('Should throw an exception when initialized without proper arguments', function() {

        var test = function() { return new Tetris(); };
        var test2 = function() { return new Tetris(1, true, false); };
        var test3 = function() { return new Tetris(1, '', {}); };

        expect(test).toThrowError();
        expect(test2).toThrowError();
        expect(test3).toThrowError();
    });
});
