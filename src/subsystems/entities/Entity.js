/**
 * Created by omnic on 11/29/2015.
 */
var Point = require('./Point');

module.exports = (function () {
    var entity = function (shape) {
        this._shape = shape;
        this.position = new Point(0,0);
        this.velocity = new Point(0,0);
    };

    entity.prototype.render = function (renderer) {
        this._shape.render(renderer);
    };

    entity.prototype.update = function () {
    };

    return entity;
})();