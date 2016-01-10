/**
 * Created by Eric on 1/6/2016.
 */
var Point = require('../../../src/subsystems/entities/Point');
var Renderer = require('../../../src/engine/Renderer');
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

var BoundingBox = require('../../../src/subsystems/entities/BoundingBox');

describe('BoundingBox', function () {
    it('should have a readonly point pair', function () {
        var expectedMin = new Point(-34, -6543);
        var expectedMax = new Point(534, 266);

        var boundingBox = new BoundingBox(expectedMin, expectedMax);
        verify.readOnlyProperty(boundingBox, 'min', expectedMin);
        verify.readOnlyProperty(boundingBox, 'max', expectedMax);
    });

    it('should reject intersections on objects that are not bounding boxes', function () {
        var boundingBox1 = new BoundingBox(new Point(5, 5), new Point(100, 100));
        assertThrowsIntersectError(boundingBox1.intersects, null);
        assertThrowsIntersectError(boundingBox1.intersects, undefined);
        assertThrowsIntersectError(boundingBox1.intersects, {});
        assertThrowsIntersectError(boundingBox1.intersects, {min: new Point(1, 1), max: new Point(1, 1)});
    });

    it('should intersect if points overlap,', function () {
        var boundingBox1 = new BoundingBox(new Point(5, 5), new Point(100, 100));
        var boundingBox2 = new BoundingBox(new Point(100, 100), new Point(101, 101));

        assert.isTrue(boundingBox1.intersects(boundingBox2));
        assert.isTrue(boundingBox2.intersects(boundingBox1));
    });

    it('should not intersect if points do not overlap', function () {
        var primaryBox = new BoundingBox(new Point(-5, -5), new Point(5, 5));
        var boxToTheEast = new BoundingBox(new Point(5.1, -5), new Point(5.2, 5));
        var boxToTheWest = new BoundingBox(new Point(-5.2, -5), new Point(-5.1, 5));
        var boxToTheNorth = new BoundingBox(new Point(-5, 5.1), new Point(-5, 5.2));
        var boxToTheSouth = new BoundingBox(new Point(-5, -5.2), new Point(-5, -5.1));

        assert.isFalse(primaryBox.intersects(boxToTheEast));
        assert.isFalse(primaryBox.intersects(boxToTheWest));
        assert.isFalse(primaryBox.intersects(boxToTheNorth));
        assert.isFalse(primaryBox.intersects(boxToTheSouth));
    });

    it('will reverse min max if they are backward', function () {
        var boundingBox = new BoundingBox(new Point(-5, 5), new Point(5, -5));
        verify.point(new Point(-5, -5), boundingBox.min);
        verify.point(new Point(5, 5), boundingBox.max);

    });

    function assertThrowsIntersectError(intersectMethod, param) {
        var threw = false;
        var expectedError = 'Intersect cannot be calculated on a non-BoundingBox object';
        try {
            intersectMethod(param);
        } catch (error) {
            threw = true;
            assert.equal(expectedError, error.message);
        }
        assert.isTrue(threw, "Method did not throw the expected error :\n" + expectedError);
    }
});