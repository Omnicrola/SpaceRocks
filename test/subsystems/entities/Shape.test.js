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

        shape.render(stubRenderer, offset, 0);
        verify(stubRenderer.drawLine).wasCalledWith(102, 203, 106, 202);
        verify(stubRenderer.drawLine).wasCalledWith(106, 202, 107, 201);
        verify(stubRenderer.drawLine).wasCalledWith(107, 201, 102, 203);
    });

    it('should render points with rotation', function () {
        var points = [
            new Point(2, 3),
            new Point(6, 2),
            new Point(7, 1),
        ];
        var offset = new Point(100, 200);
        var shape = new Shape(points);

        var rotation = 34.5;
        shape.render(stubRenderer, offset, rotation);

        verify(stubRenderer.drawLine).wasCalledWith(99.94903366646953, 203.60519103971572, 103.81194465788244, 205.04668979879304);
        verify(stubRenderer.drawLine).wasCalledWith(103.81194465788244, 205.04668979879304, 105.20247708342927, 204.78896984709584);
        verify(stubRenderer.drawLine).wasCalledWith(105.20247708342927, 204.78896984709584, 99.94903366646953, 203.60519103971572);
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

    describe('contains point', function () {
        var rectanglePoly;
        var convexPolygon;
        beforeEach(function () {
            rectanglePoly = new Shape([
                new Point(-1, -1),
                new Point(-1, 1),
                new Point(1, 1),
                new Point(1, -1)
            ]);
            convexPolygon = new Shape([
                new Point(0, 0),
                new Point(0, 3),
                new Point(2, 3),
                new Point(2, 2),
                new Point(1, 2),
                new Point(1, 1),
                new Point(2, 1),
                new Point(2, 0),
            ]);
        });

        it('should not contain points on edge', function () {
            assert.isFalse(rectanglePoly.contains(new Point(0, 1)));
            assert.isFalse(rectanglePoly.contains(new Point(0, -1.01)));
            assert.isFalse(rectanglePoly.contains(new Point(1, 0)));
            assert.isFalse(rectanglePoly.contains(new Point(-1.01, 0)));
            assert.isFalse(rectanglePoly.contains(new Point(1, 1)));
            assert.isFalse(rectanglePoly.contains(new Point(-1, -1.01)));
        });

        it('should contain points near the edge', function () {
            assert.isTrue(rectanglePoly.contains(new Point(0.999, 0.999)));
            assert.isTrue(rectanglePoly.contains(new Point(0.999, -0.999)));
            assert.isTrue(rectanglePoly.contains(new Point(-0.999, 0)));
            assert.isTrue(rectanglePoly.contains(new Point(-0.999, -0.999)));
        });

        it('should not contain points outside', function () {
            assert.isFalse(rectanglePoly.contains(new Point(1.001, 1)));
            assert.isFalse(rectanglePoly.contains(new Point(-1, 1.001)));
            assert.isFalse(rectanglePoly.contains(new Point(0, 1.001)));
            assert.isFalse(rectanglePoly.contains(new Point(0, -1.001)));
        });

        it('should contain points in a convex shape', function () {
            assert.isTrue(convexPolygon.contains(new Point(1.5, 2.5)));
            assert.isFalse(convexPolygon.contains(new Point(1.5, 1.5)));
            assert.isFalse(convexPolygon.contains(new Point(-1.5, -2.5)));
            assert.isFalse(convexPolygon.contains(new Point(1.5, 3.1)));
        });

        it('should handle invalid values', function () {
            assert.isFalse(rectanglePoly.contains(new Point(0, null)));
            assert.isFalse(rectanglePoly.contains(new Point(null, 0)));
            assert.isFalse(rectanglePoly.contains(new Point(0, undefined)));
            assert.isFalse(rectanglePoly.contains(new Point(undefined, 0)));
            var nan = 1 / 0;
            assert.isFalse(rectanglePoly.contains(new Point(0, nan)));
            assert.isFalse(rectanglePoly.contains(new Point(nan, 0)));
        });
    });
});