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
    function checkPoint(expected, actual) {
        expect(expected.x).to.be(actual.x);
        expect(expected.y).to.be(actual.y);
    }
});