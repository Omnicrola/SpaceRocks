/**
 * Created by Eric on 1/6/2016.
 */

var Point = require('./Point');

var BoundingBox = function (min, max) {
    if (min.x > max.x || min.y > max.y) {
        var minX = Math.min(min.x, max.x);
        var minY = Math.min(min.y, max.y);
        var maxX = Math.max(min.x, max.x);
        var maxY = Math.max(min.y, max.y);
        min = new Point(minX, minY);
        max = new Point(maxX, maxY);
    }
    this.string = '[min: ' + min.toString() + ', max: ' + max.toString() + ']';
    Object.defineProperties(this, {
        min: {
            writeable: false,
            enumerable: true,
            value: min
        },
        max: {
            writeable: false,
            enumerable: true,
            value: max
        }
    });
};

BoundingBox.prototype.intersects = function (otherBox) {
    if (!otherBox || !(otherBox instanceof BoundingBox)) {
        throw new Error('Intersect cannot be calculated on a non-BoundingBox object');
    }
    if (otherBox.max.x < this.min.x) {
        return false;
    }
    if (otherBox.min.x > this.max.x) {
        return false;
    }
    if (otherBox.max.y < this.min.y) {
        return false;
    }
    if (otherBox.min.y > this.max.y) {
        return false;
    }
    return true;
};

module.exports = BoundingBox;