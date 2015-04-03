/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    function setPosition(context, x, y) {
        context.position.x = x || 0;
        context.position.y = y || 0;
    }

    var _entity = function (x, y, shape) {
        this.position = new spaceRocks.Point(x, y);
        this.velocity = new spaceRocks.Point(0, 0);
        this.shape = shape;
        setPosition(this, x, y);
    };
    _entity.prototype.rotation = function (newAngle) {
        if (newAngle) {
            this.shape.angle = newAngle;
        }
        return this.shape.angle;
    }
    _entity.prototype.update = function (delta) {
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
    };

    _entity.build = function (x, y, shape) {
        return new _entity(x, y, shape)
    };
    spaceRocks.Entity = _entity;
    return spaceRocks;

})(SpaceRocks || {});