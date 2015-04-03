/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    function setPosition(context, x, y) {
        context.position.x = x || 0;
        context.position.y = y || 0;
    }

    var protoClass = function (x, y, shape) {
        this.position = {
            x: 0,
            y: 0
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.shape = shape;
        setPosition(this, x, y);
    };
    protoClass.prototype.update = function (delta) {
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
    };
    protoClass.build = function (x, y, shape) {
        return new protoClass(x, y, shape)
    };
    spaceRocks.Entity = protoClass;
    return spaceRocks;

})(SpaceRocks || {});