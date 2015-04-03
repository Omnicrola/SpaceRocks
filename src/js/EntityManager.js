/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var entities = [];
    var player;
    var addEntityFunc = function (newEntity) {
        entities.push(newEntity);
    };
    var removeEntityFunc = function (entityToRemove) {
        var index = entities.indexOf(entityToRemove);
        entities.splice(index, 1);
    };
    var invokeOnEntities = function (customFunction) {
        if (player) {
            customFunction(player);
        }
        entities.forEach(function (entity) {
            customFunction(entity);
        });
    };
    var playerFunc = function (newPlayer) {
        if (!newPlayer) {
            return player;
        }
        player = newPlayer;
    };
    spaceRocks.EntityManager = {
        addEntity: addEntityFunc,
        player: playerFunc,
        removeEntity: removeEntityFunc,
        callEntities: invokeOnEntities
    };

    return spaceRocks;
})(SpaceRocks || {});