/**
 * Created by omnic on 11/29/2015.
 */

var Shape = require('../../../src/subsystems/entities/Shape');
var Point = require('../../../src/subsystems/entities/Point');
var Renderer = require('../../../src/engine/Renderer');
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

describe('Shape', function () {

    var stubRenderer;
    beforeEach(function () {
        stubRenderer = spies.createStub(new Renderer(sinon.spy()));
    });

    it('should render points', function () {
        var points = [
            new Point(2, 3),
            new Point(6, 2),
            new Point(7, 1),
        ];
        var offset = new Point(100, 200);
        var shape = new Shape(points);

        shape.render(stubRenderer, offset);
        verify(stubRenderer.drawLine).wasCalledWith(102, 203, 106, 202);
        verify(stubRenderer.drawLine).wasCalledWith(106, 202, 107, 201);
        verify(stubRenderer.drawLine).wasCalledWith(107, 201, 102, 203);
    });

    it('should have a white color by default', function () {
        var points = [new Point(0, 0), new Point(0, 0)];

        var shape = new Shape(points);
        assert.equal('#ffffff', shape.color);
    });

    it('should use designated color', function () {
        var points = [new Point(0, 0), new Point(0, 0)];
        var expectedColor = '#ff00ff';

        var shape = new Shape(points);
        shape.color = expectedColor;
        shape.render(stubRenderer, new Point(0, 0));

        verify(stubRenderer.setColor).wasCalledWith(expectedColor);
        verify([
            stubRenderer.setColor,
            stubRenderer.drawLine
        ]).whereCalledInOrder();
    });
});