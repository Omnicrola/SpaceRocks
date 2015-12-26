/**
 * Created by Eric on 12/5/2015.
 */
module.exports = (function () {
    var writeErrorMessage = 'The Point object is immutable. ' +
        'Use a transformation method like "translate".';

    var Point = function (x, y) {
        Object.defineProperties(this, {
            'x': {
                get: function () {
                    return x;
                },
                set: function () {
                    throw new Error(writeErrorMessage);
                }
            },
            'y': {
                get: function () {
                    return y;
                },
                set: function () {
                    throw new Error(writeErrorMessage);
                }
            }
        });
    };

    Point.prototype.translate = function (otherPoint) {
        return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
    };
    Point.prototype.scale = function (multiplier) {
        return new Point(this.x * multiplier, this.y * multiplier);
    };

    Point.prototype.magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Point.prototype.normalize = function () {
        var magnitude = this.magnitude();
        var x = this.x / magnitude;
        var y = this.y / magnitude;
        return new Point(x, y);
    };

    Point.prototype.rotate = function (degrees) {
        var theta = degrees * Math.PI / 180.0;
        var x = Math.cos(theta) * this.x - Math.sin(theta) * this.y;
        var y = Math.sin(theta) * this.x + Math.cos(theta) * this.y;
        return new Point(x, y);
    };

    Point.prototype.toString = function () {
        return 'Point(' + this.x + ', ' + this.y + ')';
    }

    return Point;
})();