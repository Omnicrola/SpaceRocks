/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    function setPosition( x, y) {
        this.position.x = x || 0;
        this.position.y = y || 0;
    }

    var _entity = function (x, y, shape) {
        this.position = new spaceRocks.Point(x, y);
        this.velocity = new spaceRocks.Point(0, 0);
        this.shape = shape;
        this.isAlive = true;
        this.behaviors = [];
        setPosition.call(this, x, y);
    };

    _entity.prototype.rotation = function (newAngle) {
        if (newAngle) {
            this.shape.angle = newAngle;
        }
        return this.shape.angle;
    };

    function wrapPositionOnScreen() {
        var maxX = spaceRocks.Renderer.width();
        var maxY = spaceRocks.Renderer.height();
        if (this.position.x > maxX) {
            this.position.x -= maxX;
        } else if (this.position.x < 0) {
            this.position.x += maxX;
        }
        if (this.position.y > maxY) {
            this.position.y -= maxY;
        } else if (this.position.y < 0) {
            this.position.y += maxY;
        }

    }

    function invokeBehaviors(delta){
        var currentEntity = this;
        this.behaviors.forEach(function(singleBehavior){
            singleBehavior(currentEntity, delta);
        });
    }

    _entity.prototype.update = function (delta) {
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        if(isNaN(this.position.x )|| isNaN(this.position.y)){
            throw "position was NaN";
        }
        wrapPositionOnScreen.call(this);
        invokeBehaviors.call(this, delta);
    };

    _entity.prototype.addBehavior = function(newBehavior){
        this.behaviors.push(newBehavior);
    };

    _entity.build = function (x, y, shape) {
        return new _entity(x, y, shape)
    };

    spaceRocks.Entity = _entity;
    return spaceRocks;

})(SpaceRocks || {});