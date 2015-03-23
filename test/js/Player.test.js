/**
 * Created by Eric on 3/22/2015.
 */
describe('Player', function () {
    it('inherits from Entity', function () {
        var tempEntity = SpaceRocks.Entity;
        var expectedValue = Math.random();

        SpaceRocks.Entity = function () {
            this.expectedProperty = expectedValue;
        }

        var player = new SpaceRocks.Player();
        expect(player.expectedProperty).to.be(expectedValue);

        SpaceRocks.Entity = tempEntity;
    });

    it('has a specific Polygon shape', function () {
        var player = new SpaceRocks.Player();
        var points = player.shape.points;
        expect(points.length).to.be(4);
        checkPoint(points[0], 0, 5);
        checkPoint(points[1], 5, -5);
        checkPoint(points[2], 0, 0);
        checkPoint(points[3], -5, -5);

    });

    function checkPoint(point, x, y) {
        expect(point.x).to.be(x);
        expect(point.y).to.be(y);
    }
});