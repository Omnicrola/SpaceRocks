/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var _polygon = function (points) {
        this.pointArray = points;
        this.angle = 0;
    };

    _polygon.prototype.getPoints = _getPoints
    function _getPoints(offsetX, offsetY) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        var rotatedPoints = [];
        var theta = this.angle;
        this.pointArray.forEach(function (singlePoint) {
            var rotatedPoint = singlePoint.rotate(theta);
            rotatedPoint.x += offsetX;
            rotatedPoint.y += offsetY;
            rotatedPoints.push(rotatedPoint);
        });
        return rotatedPoints;
    };

    function _findMaxPoint(points) {
        var maxX = Number.MIN_VALUE;
        var maxY = Number.MIN_VALUE;
        points.forEach(function (singlePoint) {
            maxX = (singlePoint.x > maxX) ? singlePoint.x : maxX;
            maxY = (singlePoint.y > maxY) ? singlePoint.y : maxY;
        });
        return new spaceRocks.Point(maxX, maxY);
    }

    function _findMinPoint(points) {
        var minX = Number.MAX_VALUE;
        var minY = Number.MAX_VALUE;
        points.forEach(function (singlePoint) {
            minX = (singlePoint.x < minX) ? singlePoint.x : minX;
            minY = (singlePoint.y < minY) ? singlePoint.y : minY;
        });
        return new spaceRocks.Point(minX, minY);
    }

    _polygon.prototype.contains = _contains;
    function _contains(pointToContain) {
        var rotatedPoints = this.getPoints();
        var max = _findMaxPoint(rotatedPoints);
        var min = _findMinPoint(rotatedPoints);
        if (pointToContain.x < min.x || pointToContain.x > max.x) {
            return false;
        }
        if (pointToContain.y < min.y || pointToContain.y > max.y) {
            return false;
        }
        return true;
    }

    _polygon.prototype.intersects = _intersects;
    function _intersects(otherPolygon, offsetX, offsetY) {
        var otherPoints = otherPolygon.getPoints(offsetX, offsetY);
        var intersects = false;
        otherPoints.forEach(function (singlePoint) {
            if (this.contains(singlePoint)) {
                intersects = true;
            }
        }.bind(this));
        return intersects;
    }


    spaceRocks.Polygon = _polygon;
    return spaceRocks;
})(SpaceRocks || {});