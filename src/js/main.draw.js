/**
 * Created by Eric on 3/22/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    function fillBackground() {
        var width = spaceRocks.Renderer.width();
        var height = spaceRocks.Renderer.height();

        spaceRocks.Renderer.fillRectangle(
            '#000000',
            0, 0,
            width, height);
    }

    var drawLine = function (offset, point1, point2) {
        var p1 = new spaceRocks.Point(point1.x + offset.x, point1.y + offset.y);
        var p2 = new spaceRocks.Point(point2.x + offset.x, point2.y + offset.y);
        spaceRocks.Renderer.drawLine(p1.x, p1.y, p2.x, p2.y);
    };
    var drawEntityShape = function (entity) {
        var points = entity.shape.getPoints();
        for (var i = 0; i < points.length - 1; i++) {
            drawLine(entity.position, points[i], points[i + 1]);
        }
        drawLine(entity.position, points[points.length - 1], points[0]);
    };
    spaceRocks.draw = function () {
        fillBackground();
        spaceRocks.EntityManager.callEntities(drawEntityShape);
    };
    return spaceRocks;
})(SpaceRocks || {});