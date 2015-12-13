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

    it('should rotate around origin', function(){
        var x = 18.12;
        var y = 22.18;
        var degreesToRotate = 83.1;

        var point = new Point(x, y);

        var newPoint = point.rotate(degreesToRotate);

        assert.equal(-19.84247832431129, newPoint.x);
        assert.equal(20.653398121114034, newPoint.y);
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