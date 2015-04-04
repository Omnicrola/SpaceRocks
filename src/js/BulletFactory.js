/**
 * Created by Eric on 4/4/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var BULLET_VELOCITY = 5.0;
    function build(pX, pY) {
        var shape = spaceRocks.Shapes.bullet();
        var bullet = new spaceRocks.Entity(pX, pY, shape);
        bullet.velocity.x = 0.0;
        bullet.velocity.y = BULLET_VELOCITY;
        return bullet;
    }

    spaceRocks.BulletFactory = {
        build: build
    };
    return spaceRocks;
})(SpaceRocks || {});