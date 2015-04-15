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
        entities.forEach(function (singleEntity) {
            if (singleEntity.isAlive()) {
                entitiesCopy.push(singleEntity);
            }
        });
        entities = entitiesCopy;
    }

    function _checkCollisions() {
        entities.forEach(function (firstEntity) {
            entities.forEach(function (secondEntity) {
                _checkSingleCollision(firstEntity, secondEntity);
            });
        });
    }

    function _checkSingleCollision(firstEntity, secondEntity) {
        var bothAreAlive = firstEntity.isAlive() && secondEntity.isAlive();
        var areNotSameEntity = (firstEntity !== secondEntity);
        if (bothAreAlive && areNotSameEntity) {
            if (firstEntity.collide(secondEntity)) {
                firstEntity.destroy();
                secondEntity.destroy();
            }
        }
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
        checkCollisions: _checkCollisions,
        cleanDeadEntities: _cleanDeadEntities,
        removeAllEntities: _removeAllEntities
    };

    return spaceRocks;
})(SpaceRocks || {});