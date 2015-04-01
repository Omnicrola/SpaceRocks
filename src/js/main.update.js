/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var ACCEL_RATE = 0.25;

    function getPlayer() {
        return spaceRocks.EntityManager.player();
    }

    function updateEntities(frameDelta) {
        spaceRocks.EntityManager.callEntities(function (entity) {
            entity.position.x += entity.velocity.x;
            entity.position.y += entity.velocity.y;
        });
    }

    function updatePlayer(frameDelta) {
        if (spaceRocks.InputManager.isAccellerating()) {
            getPlayer().velocity.y += ACCEL_RATE;
        }
        if (spaceRocks.InputManager.isDecellerating()) {
            getPlayer().velocity.y -= ACCEL_RATE;
        }
    }

    spaceRocks.update = function (frameDelta) {
        updatePlayer(frameDelta);
        updateEntities(frameDelta);
    };

    return spaceRocks;
})(SpaceRocks || {});