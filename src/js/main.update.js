/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var ACCEL_RATE = 0.25;
    var TURN_RATE = 5.0;

    function getPlayer() {
        return spaceRocks.EntityManager.player();
    }

    function updateEntities(frameDelta) {
        spaceRocks.EntityManager.callEntities(function (entity) {
            entity.update(frameDelta);
        });
    }

    function calculatePlayerThrust() {
        var vector = new SpaceRocks.Point(0, ACCEL_RATE);
        var thrustVector = vector.rotate(getPlayer().rotation());
        return thrustVector;
    }

    function updatePlayer(frameDelta) {
        var player = getPlayer();
        if (spaceRocks.InputManager.isAccellerating()) {
            var thrust = calculatePlayerThrust();
            player.velocity.x += thrust.x;
            player.velocity.y += thrust.y;
        }
        if (spaceRocks.InputManager.isDecellerating()) {
            var thrust = calculatePlayerThrust();
            player.velocity.x -= thrust.x;
            player.velocity.y -= thrust.y;
        }
        if (spaceRocks.InputManager.rotateCounterClockwise()) {
            player.rotation(TURN_RATE * frameDelta * -1 + player.rotation());
        }
        if (spaceRocks.InputManager.rotateClockwise()) {
            player.rotation(TURN_RATE * frameDelta + player.rotation());
        }
    }

    spaceRocks.update = function (frameDelta) {
        updatePlayer(frameDelta);
        updateEntities(frameDelta);
    };

    return spaceRocks;
})(SpaceRocks || {});