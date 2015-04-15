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
        polygon.angle = 45;

        var points = polygon.getPoints();
        expect(points.length).to.equal(3);
        var angle = 45 * Math.PI / 180.0;
        checkPoint(new Point(8.881784197001252e-16, 14.142135623730951), points[0]);
        checkPoint(new Point(7.071067811865476, 21.213203435596427), points[1]);
        checkPoint(new Point(-7.071067811865474, 21.213203435596427), points[2]);

    });


    it('should detect intersections', function () {
        var Point = SpaceRocks.Point;
        var point1 = new Point(10, 10);
        var point2 = new Point(20, 10);
        var point3 = new Point(20, 20);
        var point4 = new Point(10, 20);

        var polygon = new SpaceRocks.Polygon([point1, point2, point3, point4]);
        var polygon2 = new SpaceRocks.Polygon([new Point(1, 1), new Point(1, 2), new Point(2, 1)]);

        var intersects = polygon.intersects(polygon2, 0, 0);
        expect(intersects).to.equal(false);


        intersects = polygon.intersects(polygon2, -10, -10);
        expect(intersects).to.equal(false);

    });

    it('should contain a point using a bounding box', function () {
        var Point = SpaceRocks.Point;
        var minX = -23;
        var maxX = 142.4;
        var minY = 2.205;
        var maxY = 60.5;

        var point1 = new Point(minX, 50);
        var point2 = new Point(22.3, maxY);
        var point3 = new Point(maxX, minY);

        var polygon = new SpaceRocks.Polygon([point1, point2, point3]);
        var contains = polygon.contains(new Point(-22, 3));
        expect(contains).to.be.ok;

        contains = polygon.contains(new Point(141, 60));
        expect(contains).to.be.ok;

        contains = polygon.contains(new Point(-22, 59));
        expect(contains).to.be.ok;

        contains = polygon.contains(new Point(-24, 59));
        expect(contains).to.not.be.ok;


    });

    function checkPoint(expected, actual) {
        expect(expected.x).to.equal(actual.x);
        expect(expected.y).to.equal(actual.y);
    }
});