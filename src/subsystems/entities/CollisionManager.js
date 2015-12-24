/**
 * Created by Eric on 12/19/2015.
 */
module.exports = (function () {
    var PLAYER_GROUP = {
        id: 0,
        mask: [0, 1, 1, 1]
    };
    var ASTEROID_GROUP = {
        id: 1,
        mask: [1, 0, 1, 1]
    };
    var BULLET_GROUP = {
        id: 2,
        mask: [0, 1, 0, 1]
    };
    var FX_GROUP = {
        id: 3,
        mask: [0, 0, 0, 0]
    };

    var CollisionManager = function () {
        this._entities = {};
        _createGroup.call(this, PLAYER_GROUP);
        _createGroup.call(this, ASTEROID_GROUP);
        _createGroup.call(this, BULLET_GROUP);
        _createGroup.call(this, FX_GROUP);
    };

    function _createGroup(groupData) {
        this._entities[groupData.id] = {
            id: groupData.id,
            mask: groupData.mask,
            members: []
        };
    }

    CollisionManager.prototype.add = function (entity, groupId) {
        if (!this._entities[groupId]) {
            return;
        }
        this._entities[groupId].members.push(entity);
    };

    CollisionManager.prototype.update = function (gameContainer) {
        _removeDestroyedEntities.call(this);
        var allEntities = this._entities;

        var allGroupNames = Object.getOwnPropertyNames(allEntities);
        allGroupNames.forEach(function (firstGroupName) {
            allGroupNames.forEach(function (secondGroupName) {
                var firstGroup = allEntities[firstGroupName];
                var secondGroup = allEntities[secondGroupName];
                _collideGroups(gameContainer, firstGroup, secondGroup);
            });
        });
    };

    function _collideGroups(gameContainer, firstGroup, secondGroup) {
        if (firstGroup === secondGroup) {
            return;
        }
        var firstCollidesWithSecond = firstGroup.mask[secondGroup.id] === 1;
        var secondCollidesWithFirst = secondGroup.mask[firstGroup.id] === 1;
        if (firstCollidesWithSecond && secondCollidesWithFirst) {
            firstGroup.members.forEach(function (entity1) {
                secondGroup.members.forEach(function (entity2) {
                    if (entity1.isAlive && entity2.isAlive) {
                        if (entity1.shape.intersects(entity2.shape)) {
                            entity1.destroy(gameContainer);
                            entity2.destroy(gameContainer);
                        }
                    }
                });
            });
        }
    }

    function _removeDestroyedEntities() {
        var allEntities = this._entities;
        Object.getOwnPropertyNames(allEntities)
            .forEach(function (groupName) {
                allEntities[groupName]
                members = allEntities[groupName].members
                    .filter(function (entity) {
                        return entity.isAlive;
                    });
            });
    }

    Object.defineProperties(CollisionManager, {
        PLAYER: {
            value: PLAYER_GROUP.id,
            writeable: false,
            enumerable: true
        },
        ASTEROID: {
            value: ASTEROID_GROUP.id,
            writeable: false,
            enumerable: true
        },
        BULLETS: {
            value: BULLET_GROUP.id,
            writeable: false,
            enumerable: true
        },
        FX: {
            value: FX_GROUP.id,
            writeable: false,
            enumerable: true
        }
    });
    return CollisionManager;
})();