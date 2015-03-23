/**
 * Created by Eric on 3/22/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    function createShape() {
        var Point = spaceRocks.Point;
        var Polygon = spaceRocks.Polygon;
        return new Polygon([
            new Point(0, 5),
            new Point(5, -5),
            new Point(0, 0),
            new Point(-5, -5)
        ]);
    }

    var protoClass = function () {
        spaceRocks.Entity.call(this);
        this.shape = createShape();
    };

    spaceRocks.Player = protoClass;
    return spaceRocks;
})(SpaceRocks || {});