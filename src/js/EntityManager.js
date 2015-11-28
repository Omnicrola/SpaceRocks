/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var _entities = [];
    var _player;

    function _addEntity(newEntity, collisionGroup) {
        _entities.push(newEntity);
        spaceRocks.CollisionManager.addEntity(newEntity, collisionGroup);
    }

    function _removeEntity(entityToRemove) {
        var index = _entities.indexOf(entityToRemove);
        _entities.splice(index, 1);
        spaceRocks.CollisionManager.removeEntity(entityToRemove);
    }

    function _callEntities(customFunction) {
        if (_player) {
            customFunction(_player);
        }
        _entities.forEach(function (entity) {
            customFunction(entity);
        });
    }

    function _cleanDeadEntities() {
        var entitiesCopy = [];
        _entities.forEach(function (singleEntity) {
            if (singleEntity.isAlive()) {
                entitiesCopy.push(singleEntity);
            }
        });
        _entities = entitiesCopy;
    }

    function _player(newPlayer) {
        if (!newPlayer) {
            return _player;
        }
        _player = newPlayer;
        var collisionGroup = spaceRocks.CollisionManager.PLAYER_GROUP();
        spaceRocks.CollisionManager.addEntity(newPlayer, collisionGroup);
    };

    function _removeAllEntities() {
        _entities = [];
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