/**
 * Created by Eric on 3/21/2015.
 */
describe('Point', function () {
    it('should store x and y', function () {
        var x = Math.random();
        var y = Math.random();
        var point = new SpaceRocks.Point(x, y);
        expect(point.x).to.be(x);
        expect(point.y).to.be(y);
    });

    it('should calculate distance', function () {
        var point1 = new SpaceRocks.Point(1, 3);
        var point2 = new SpaceRocks.Point(7, 5);
        var point3 = new SpaceRocks.Point(3, 9);
        var distance1 = point1.distance(point2);
        var distance2 = point2.distance(point3);
        expect(distance1).to.equal(6.324555320336759);
        expect(distance2).to.equal(5.656854249492381);
    });

    it('should rotate around the origin', function () {
        var Point = SpaceRocks.Point;
        var point1 = new Point(10, 10);
        var point2 = new Point(20, 10);
        var point3 = new Point(10, 20);

        var expectedPoint1 = new Point(8.881784197001252e-16, 14.142135623730951);
        var expectedPoint2 = new Point(7.071067811865476, 21.213203435596427);
        var expectedPoint3 = new Point(-7.071067811865474, 21.213203435596427);

        checkPoint(expectedPoint1, point1.rotate(45));
        checkPoint(expectedPoint2, point2.rotate(45));
        checkPoint(expectedPoint3, point3.rotate(45));

    });

    it('should return a different object when rotating', function () {
        var originalPoint = new SpaceRocks.Point(Math.random(), Math.random());
        var rotatedPoint = originalPoint.rotate(Math.random());
        rotatedPoint.x = 5;
        expect(originalPoint).to.not.be(rotatedPoint);
        expect(originalPoint.x).to.not.equal(rotatedPoint.x);
        expect(originalPoint.y).to.not.equal(rotatedPoint.y);
    });

    function checkPoint(expected, actual) {
        expect(expected.x).to.equal(actual.x);
        expect(expected.y).to.equal(actual.y);
    }

});