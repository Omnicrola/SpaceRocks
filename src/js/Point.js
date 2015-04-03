/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    var _point = function (x, y) {
        this.x = x;
        this.y = y;
    };

    _point.prototype.distance = function (otherPoint) {
        var a = this.x - otherPoint.x;
        var b = this.y - otherPoint.y;
        var c2 = a*a + b*b;
        return Math.sqrt(c2);
    };

    _point.prototype.rotate = function(degrees){
        var theta = degrees * Math.PI / 180.0;
        var x = Math.cos(theta) * this.x - Math.sin(theta) * this.y;
        var y = Math.sin(theta) * this.x + Math.cos(theta) * this.y;
        return new spaceRocks.Point(x, y);
    };

    spaceRocks.Point = _point;
    return spaceRocks;
})(SpaceRocks || {});
