/**
 * Created by Eric on 3/31/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    spaceRocks.Shapes = {
        player: function () {
            return new spaceRocks.Polygon([
                new spaceRocks.Point(-5, -5),
                new spaceRocks.Point(0, 5),
                new spaceRocks.Point(5, -5),
                new spaceRocks.Point(0, 0)
            ]);
        },
        asteroid: function () {
            return new spaceRocks.Polygon([
                new spaceRocks.Point(-12, 0),
                new spaceRocks.Point(-8, 8),
                new spaceRocks.Point(0, 16),
                new spaceRocks.Point(8, 6),
                new spaceRocks.Point(8, -4),
                new spaceRocks.Point(-2, -14)
            ]);
        },
        bullet: function () {
            return new spaceRocks.Polygon([
                new spaceRocks.Point(0, 0),
                new spaceRocks.Point(1, 0)
            ]);
        }
    };
    return spaceRocks;
})(SpaceRocks || {});