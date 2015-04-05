/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var entities = [];
    var player;

    function _addEntity(newEntity) {
        entities.push(newEntity);
    }

    function _removeEntity(entityToRemove) {
        var index = entities.indexOf(entityToRemove);
        entities.splice(index, 1);
    }

    function _callEntities(customFunction) {
        if (player) {
            customFunction(player);
        }
        entities.forEach(function (entity) {
            customFunction(entity);
        });
    }

    function _cleanDeadEntities() {
        var entitiesCopy = [];
        entities.forEach(function(singleEntity){
           if(singleEntity.isAlive){
               entitiesCopy.push(singleEntity);
           }
        });
        entities = entitiesCopy;
    }

    function _player(newPlayer) {
        if (!newPlayer) {
            return player;
        }
        player = newPlayer;
    };

    function _removeAllEntities() {
        entities = [];
    }

    spaceRocks.EntityManager = {
        addEntity: _addEntity,
        player: _player,
        removeEntity: _removeEntity,
        callEntities: _callEntities,
        cleanDeadEntities: _cleanDeadEntities,
        removeAllEntities: _removeAllEntities
    };

    return spaceRocks;
})(SpaceRocks || {});