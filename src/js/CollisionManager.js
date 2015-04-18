/**
 * Created by Eric on 4/18/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var entities = {};
    var groups = [];

    function _addEntity(entity, collisionGroup) {
        if (!collisionGroup) {
            throw 'No collision group specified.';
        }
        if (!entities.hasOwnProperty(collisionGroup)) {
            entities[collisionGroup] = [];
            groups.push(collisionGroup);
        }
        entities[collisionGroup].push(entity);
    }

    function _removeEntity(entity) {

    }

    function _removeAllEntities() {
        entities = {};
        groups = [];
    }

    function _checkCollisions() {
        groups.forEach(function (firstGroupName) {
            groups.forEach(function (secondGroupName) {
                if (firstGroupName !== secondGroupName) {
                    _collideTwoGroupsByName(firstGroupName, secondGroupName);
                }
            });
        });
    }

    function _collideTwoGroupsByName(firstGroupName, secondGroupName) {
        var firstGroup = entities[firstGroupName];
        var secondGroup;
        firstGroup.forEach(function (firstEntity) {
            secondGroup = entities[secondGroupName];
            secondGroup.forEach(function (secondEntity) {
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


    spaceRocks.CollisionManager = {
        addEntity: _addEntity,
        removeEntity: _removeEntity,
        checkCollisions: _checkCollisions,
        removeAllEntities: _removeAllEntities,
        ASTEROIDS_GROUP: function () {
            return 1;
        },
        PLAYER_GROUP: function () {
            return 2;
        }
    };
    return spaceRocks;
})(SpaceRocks || {});