/**
 * Created by Eric on 4/4/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    var BULLET_VELOCITY = 5.0;

    function selfDestructBehavior(entity, delta) {
        if (!entity.lifetime) {
            entity.lifetime = delta;
        } else {
            entity.lifetime += delta;
        }
        if (entity.lifetime >= 30) {
            entity.destroy();
        }
    }

    function build(pX, pY, rotation) {
        var shape = spaceRocks.Shapes.bullet();
        var bullet = new spaceRocks.Entity(pX, pY, shape);
        bullet.velocity = new spaceRocks.Point(0, BULLET_VELOCITY).rotate(rotation);
        bullet.addBehavior(selfDestructBehavior);
        return bullet;
    }

    spaceRocks.BulletFactory = {
        build: build
    };

    return spaceRocks;
})(SpaceRocks || {});