/**
 * Created by Eric on 4/18/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    function _pointShape() {
        return new spaceRocks.Polygon([
            new spaceRocks.Point(0, 0)
        ]);
    }

    function _buildSelfDestructBehavior(maximumLifetime) {
        var timeSpentAlive = 0;
        return function selfDestructBehavior(entity, delta) {
            timeSpentAlive += delta;
            if (timeSpentAlive >= maximumLifetime) {
                entity.destroy();
            }
        }
    }


    function _build(positionX, positionY, velocityX, velocityY, life) {
        var particle = new spaceRocks.Entity(positionX, positionY, _pointShape());
        particle.velocity.x = velocityX;
        particle.velocity.y = velocityY;
        particle.addBehavior(_buildSelfDestructBehavior(life));
        return particle;
    }

    spaceRocks.ParticleFactory = {
        build: _build
    };
    return spaceRocks;
})(SpaceRocks || {});