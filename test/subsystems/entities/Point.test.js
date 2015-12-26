/**
 * Created by Eric on 12/5/2015.
 */

var Point = require('../../../src/subsystems/entities/Point');
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

describe('Point', function () {

    var expectedWriteError = 'The Point object is immutable. Use a transformation method like "translate".';

    it('store 2 numbers', function () {
        var expectedX = Math.random();
        var expectedY = Math.random();

        var point = new Point(expectedX, expectedY);
        assert.equal(expectedX, point.x);
        assert.equal(expectedY, point.y);
    });

    it('should translate when given a new set of numbers', function () {
        var x = randomFloat();
        var y = randomFloat();

        var addX = randomFloat();
        var addY = randomFloat();

        var point = new Point(x, y);
        var newPoint = point.translate({x: addX, y: addY});

        assert.isTrue(newPoint instanceof Point);
        assert.equal(x + addX, newPoint.x);
        assert.equal(y + addY, newPoint.y);
    });

    it('should rotate around origin', function () {
        var x = 18.12;
        var y = 22.18;
        var degreesToRotate = 83.1;

        var point = new Point(x, y);

        var newPoint = point.rotate(degreesToRotate);

        assert.equal(-19.84247832431129, newPoint.x);
        assert.equal(20.653398121114034, newPoint.y);
    });

    it('should scale', function () {
        var point = new Point(3.5, 21);
        var newPoint = point.scale(4);

        assert.isTrue(point !== newPoint);
        assert.equal(newPoint.x, 14);
        assert.equal(newPoint.y, 84);
    });

    it('should normalize - x case', function () {
        var point = new Point(5, 3);
        var newPoint = point.normalize();

        assert.isTrue(point !== newPoint);
        assert.equal(newPoint.x, 0.8574929257125441);
        assert.equal(newPoint.y, 0.5144957554275265);
    });

    it('should normalize - y case', function () {
        var point = new Point(4, 7);
        var newPoint = point.normalize();

        assert.isTrue(point !== newPoint);
        assert.equal(newPoint.x, 0.49613893835683387);
        assert.equal(newPoint.y, 0.8682431421244593);
    });

    it('should calculate magnitude', function () {
        var point = new Point(13, 23);
        var magnitude = point.magnitude();

        assert.equal(26.419689627245813, magnitude);
    });

    function randomFloat() {
        return Math.random() * 50 - 100;
    }

    it('x is read only', function () {
        var expectedX = Math.random();
        var expectedY = Math.random();

        var point = new Point(expectedX, expectedY);
        var threw = false;
        try {
            point.x = 2.4;
            threw = false;
        } catch (e) {
            assert.equal(e.message, expectedWriteError);
            threw = true;
        }
        assert.isTrue(threw, 'Writing should throw an error');
        assert.equal(expectedX, point.x);
        assert.equal(expectedY, point.y);
    });

    it('y is read only', function () {
        var expectedX = Math.random();
        var expectedY = Math.random();

        var point = new Point(expectedX, expectedY);
        var threw = false;
        try {
            point.y = 2.4;
            threw = false;
        } catch (e) {
            assert.equal(e.message, expectedWriteError);
            threw = true;
        }
        assert.isTrue(threw, 'Writing should throw an error');
        assert.equal(expectedX, point.x);
        assert.equal(expectedY, point.y);
    });
});