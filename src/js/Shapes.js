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
        asteroidSmall: function () {
            return new spaceRocks.Polygon([
                new spaceRocks.Point(-2, 6),
                new spaceRocks.Point(5, 2),
                new spaceRocks.Point(4, -3),
                new spaceRocks.Point(-1, -4),
                new spaceRocks.Point(-5, -1),
                new spaceRocks.Point(-4, 5)
            ]);
        },
        asteroidMedium: function () {
            return new spaceRocks.Polygon([
                new spaceRocks.Point(-10, 30),
                new spaceRocks.Point(25, 10),
                new spaceRocks.Point(20, -15),
                new spaceRocks.Point(-5, -20),
                new spaceRocks.Point(-25, -5),
                new spaceRocks.Point(-20, 25)
            ]);
        },
        asteroidLarge: function () {
            return new spaceRocks.Polygon([
                new spaceRocks.Point(-20, 60),
                new spaceRocks.Point(50, 20),
                new spaceRocks.Point(40, -30),
                new spaceRocks.Point(-10, -40),
                new spaceRocks.Point(-50, -10),
                new spaceRocks.Point(-40, 50)
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