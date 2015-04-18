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

    function updateThrust(player) {
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
    }

    function updateRotation(player, frameDelta) {
        if (spaceRocks.InputManager.rotateCounterClockwise()) {
            player.rotation(TURN_RATE * frameDelta * -1 + player.rotation());
        }
        if (spaceRocks.InputManager.rotateClockwise()) {
            player.rotation(TURN_RATE * frameDelta + player.rotation());
        }
    }

    function checkForWeaponFire(player, frameDelta){
        if(spaceRocks.InputManager.fireWeapon()){
            var x = player.position.x;
            var y = player.position.y;
            var rotation = player.rotation();
            var bullet = spaceRocks.BulletFactory.build(x, y, rotation);
            spaceRocks.EntityManager.addEntity(bullet, spaceRocks.CollisionManager.PLAYER_GROUP());
        }
    }

    function updatePlayer(frameDelta) {
        var player = getPlayer();
        updateThrust(player);
        updateRotation(player, frameDelta);
        checkForWeaponFire(player, frameDelta);
    }

    spaceRocks.update = function (frameDelta) {
        updatePlayer(frameDelta);
        updateEntities(frameDelta);
        spaceRocks.EntityManager.cleanDeadEntities();
        spaceRocks.CollisionManager.checkCollisions();
    };

    return spaceRocks;
})(SpaceRocks || {});