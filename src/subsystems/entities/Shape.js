/**
 * Created by Eric on 12/5/2015.
 */
module.exports = (function () {

    var shape = function (points) {
        this._points = points;
        this.color = '#ffffff';
    };

    shape.prototype.render = function (renderer, offset, rotation) {
        renderer.setColor(this.color);
        var rotatedPoints = _rotatePoints.call(this, rotation);
        var totalPoints = rotatedPoints.length;
        var p1, p2;
        for (var i = 0; i < totalPoints - 1; i++) {
            p1 = rotatedPoints[i];
            p2 = rotatedPoints[i + 1];
            _drawLine(renderer, p1, p2, offset);

        }
        p1 = rotatedPoints[totalPoints - 1];
        p2 = rotatedPoints[0];
        _drawLine(renderer, p1, p2, offset);
    };

    function _drawLine(renderer, p1, p2, offset) {
        renderer.drawLine(
            p1.x + offset.x,
            p1.y + offset.y,
            p2.x + offset.x,
            p2.y + offset.y);
    }

    function _rotatePoints(rotation) {
        var points = this._points;
        return points.map(function (point) {
            return point.rotate(rotation);
        });
    }

    return shape;
})();