/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    function getPlayer() {
        return spaceRocks.EntityManager.player();
    }

    spaceRocks.update = function (frameDelta) {
        if (spaceRocks.InputManager.isAccellerating()) {
            getPlayer().velocity.y = 1;
        }
    };

    return spaceRocks;
})(SpaceRocks || {});