/**
 * Created by omnic on 11/29/2015.
 */
var Point = require('./Point');

module.exports = (function () {
    var entity = function (shape) {
        this._shape = shape;
        this.rotation = 0;
        this.position = new Point(0,0);
        this.velocity = new Point(0,0);
    };

    entity.prototype.render = function (renderer) {
        this._shape.render(renderer, this.position, this.rotation);
    };

    entity.prototype.update = function (delta) {
        var vX = this.velocity.x * delta;
        var vY = this.velocity.y * delta;
        this.position = this.position.translate({x: vX, y: vY});
    };

    return entity;
})();