/**
 * Created by Eric on 3/21/2015.
 */
describe('Polygon', function () {


    it('should store points', function () {
        var Point = SpaceRocks.Point;
        var point1 = new Point(Math.random(), Math.random());
        var point2 = new Point(Math.random(), Math.random());
        var point3 = new Point(Math.random(), Math.random());
        var polygon = new SpaceRocks.Polygon([point1, point2, point3]);
        var points = polygon.getPoints();
        checkPoint(point1, points[0]);
        checkPoint(point2, points[1]);
        checkPoint(point3, points[2]);

    });

    it('should rotate points', function () {
        var Point = SpaceRocks.Point;
        var point1 = new Point(10, 10);
        var point2 = new Point(20, 10);
        var point3 = new Point(10, 20);
        var polygon = new SpaceRocks.Polygon([point1, point2, point3]);
        polygon.angle=45;

        var points = polygon.getPoints();
        expect(points.length).to.equal(3);
        var angle = 45 * Math.PI / 180.0;
        checkPoint(new Point(8.881784197001252e-16, 14.142135623730951), points[0]);
        checkPoint(new Point(7.071067811865476, 21.213203435596427), points[1]);
        checkPoint(new Point(-7.071067811865474, 21.213203435596427), points[2]);

    });

    function checkPoint(expected, actual) {
        expect(expected.x).to.equal(actual.x);
        expect(expected.y).to.equal(actual.y);
    }
});