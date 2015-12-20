/**
 * Created by Eric on 12/5/2015.
 */
var Point = require('./Point');

module.exports = (function () {

    var Shape = function (points) {
        this._points = points;
        this.color = '#ffffff';
    };

    Shape.prototype.rotation = 0;
    Shape.prototype.position = new Point(0, 0);

    Shape.prototype.getPoints = function () {
        var position = this.position;
        var rotation = this.rotation;
        var points = this._points.map(function (point) {
            point = point.rotate(rotation);
            var x = point.x + position.x;
            var y = point.y + position.y;
            return new Point(x, y);
        });
        return points;
    }

    Shape.prototype.contains = function (pointToCheck) {
        var points = this.getPoints();
        var totalPoints = this._points.length;
        var x = pointToCheck.x;
        var y = pointToCheck.y;
        if (isNaN(x) || isNaN(y) ||
            x === undefined || y === undefined ||
            x === null || y === null) {
            return false;
        }
        var isContained = false;
        for (var i = 0, j = totalPoints - 1; i < totalPoints; j = i++) {
            var x1 = points[i].x;
            var y1 = points[i].y;
            var x2 = points[j].x;
            var y2 = points[j].y;

            var intersect = ((y1 > y) != (y2 > y))
                && (x < (x2 - x1) * (y - y1) / (y2 - y1) + x1);
            if (intersect) isContained = !isContained;
        }

        return isContained;
    }

    Shape.prototype.intersects = function (otherShape) {
        if (!(otherShape instanceof Shape)) {
            return false;
        }
        var intersects = false;
        var self = this;
        otherShape.getPoints().forEach(function (otherPoint) {
            if (self.contains(otherPoint)) {
                intersects = true;
            }
        });
        return intersects;
    }

    Shape.prototype.render = function (renderer) {
        renderer.setColor(this.color);
        var offset = this.position;
        var rotatedPoints = this.getPoints();
        var totalPoints = rotatedPoints.length;
        var p1, p2;
        for (var i = 0; i < totalPoints - 1; i++) {
            p1 = rotatedPoints[i];
            p2 = rotatedPoints[i + 1];
            _drawLine(renderer, p1, p2);

        }
        p1 = rotatedPoints[totalPoints - 1];
        p2 = rotatedPoints[0];
        _drawLine(renderer, p1, p2);
    };

    function _drawLine(renderer, p1, p2) {
        renderer.drawLine(
            p1.x, p1.y,
            p2.x, p2.y
        );
    }

    return Shape;
})();