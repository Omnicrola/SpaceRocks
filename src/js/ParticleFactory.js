/**
 * Created by Eric on 4/18/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    function _pointShape() {
        return new spaceRocks.Polygon([
            new spaceRocks.Point(0, 0),
            new spaceRocks.Point(1, 0)
        ]);
    }

    function _build(positionX, positionY, velocityX, velocityY, life) {
        var particle = spaceRocks.Entity.build(positionX, positionY, _pointShape());
        particle.velocity.x = velocityX;
        particle.velocity.y = velocityY;
        particle.addBehavior(spaceRocks.BehaviorFactory.buildSelfDestruct(life));
        return particle;
    }

    spaceRocks.ParticleFactory = {
        build: _build
    };
    return spaceRocks;
})(SpaceRocks || {});