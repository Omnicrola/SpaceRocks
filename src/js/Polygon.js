/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var _polygon = function (points) {
        this.pointArray = points;
        this.angle = 0;
    };

    _polygon.prototype.getPoints = function () {
        var rotatedPoints = [];
        var theta = this.angle;
        this.pointArray.forEach(function (singlePoint) {
            rotatedPoints.push(singlePoint.rotate(theta));
        });
        return rotatedPoints;
    };


    spaceRocks.Polygon = _polygon;
    return spaceRocks;
})(SpaceRocks || {});