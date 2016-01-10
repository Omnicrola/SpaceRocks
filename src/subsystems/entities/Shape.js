/**
 * Created by Eric on 12/5/2015.
 */
var Point = require('./Point');
var BoundingBox = require('./BoundingBox');

var Shape = function (points) {
    this._points = points;
    this.color = '#ffffff';
    Object.defineProperties(this, {
        boundingBox: {
            writeable: true,
            enumerable: true,
            get: function () {
                return _createBoundingBox(this.getPoints());
            },
            set: function () {
            }
        }
    });
};

Shape.prototype.rotation = 0;
Shape.prototype.position = new Point(0, 0);

function _createBoundingBox(points) {
    var minX = Number.MAX_VALUE;
    var minY = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE;
    var maxY = Number.MIN_VALUE;
    points.forEach(function (point) {
        minX = (point.x < minX) ? point.x : minX;
        minY = (point.y < minY) ? point.y : minY;
        maxX = (point.x > maxX) ? point.x : maxX;
        maxY = (point.y > maxY) ? point.y : maxY;
    });
    return new BoundingBox(
        new Point(minX, minY),
        new Point(maxX, maxY)
    );
}

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
};

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
};

Shape.prototype.intersects = function (otherShape) {
    if (!(otherShape instanceof Shape)) {
        return false;
    }
    var intersects = false;
    var self = this;
    var points = otherShape.getPoints();
    points.forEach(function (otherPoint) {
        if (self.contains(otherPoint)) {
            intersects = true;
        }
    });
    return intersects;
};

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

module.exports = Shape;