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
                new spaceRocks.Point(-10, -8),
                new spaceRocks.Point(-3, 4),
                new spaceRocks.Point(-6, 9),
                new spaceRocks.Point(2, 8),
                new spaceRocks.Point(-6, -8)
            ]);
        }
    };
    return spaceRocks;
})(SpaceRocks || {});