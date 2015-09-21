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
