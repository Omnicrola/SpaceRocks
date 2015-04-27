/**
 * Created by Eric on 3/31/2015.
 */
describe('SpaceRocks.Shape', function () {
    describe('Player', function () {
        it('should have the correct points', function () {
            var shape = SpaceRocks.Shapes.player();
            var points = shape.pointArray;
            expect(points.length).to.equal(4);
            checkPoint(points[0], -5, -5);
            checkPoint(points[1], 0, 5);
            checkPoint(points[2], 5, -5);
            checkPoint(points[3], 0, 0);
        });
    });

    describe('Asteroid', function () {
        it('should have the correct points', function () {
            var shape = SpaceRocks.Shapes.asteroidSmall();
            var points = shape.pointArray;
            expect(points.length).to.equal(6);
            checkPoint(points[0], -2, 6);
            checkPoint(points[1], 5, 2);
            checkPoint(points[2], 4, -3);
            checkPoint(points[3], -1, -4);
            checkPoint(points[4], -5, -1);
            checkPoint(points[5], -4, 5);
        });
    });
    describe('Bullet', function () {
        it('should have the correct points', function () {
            var shape = SpaceRocks.Shapes.bullet();
            var points = shape.pointArray;
            expect(points.length).to.equal(2);
            checkPoint(points[0], 0, 0);
            checkPoint(points[1], 1, 0);
        });
    });

    function checkPoint(point, expectedX, expectedY) {
        expect(point.x).to.equal(expectedX);
        expect(point.y).to.equal(expectedY);
    }

    function functionName(fun) {
        var ret = fun.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    }
});