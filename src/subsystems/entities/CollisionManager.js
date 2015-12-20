/**
 * Created by Eric on 12/19/2015.
 */
module.exports = (function () {
    var CollisionManager = function () {
        this._entities = {};
    };

    CollisionManager.prototype.add = function (entity, group) {
        if (!this._entities[group]) {
            this._entities[group] = [];
        }
        this._entities[group].push(entity);
    };

    CollisionManager.prototype.update = function () {
        _removeDestroyedEntities.call(this);
        var allEntities = this._entities;
        var allGroupNames = Object.getOwnPropertyNames(allEntities);
        allGroupNames.forEach(function (firstGroupName) {
            allGroupNames.forEach(function (secondGroupName) {
                var firstGroup = allEntities[firstGroupName];
                var secondGroup = allEntities[secondGroupName];
                _compareGroups(firstGroup, secondGroup, firstGroupName, secondGroupName);
            });
        });
    };

    function _compareGroups(firstGroup, secondGroup, name1, name2) {
        if (firstGroup === secondGroup) {
            return;
        }
        firstGroup.forEach(function (entity1) {
            secondGroup.forEach(function (entity2) {
                if (entity1.isAlive && entity2.isAlive) {
                    if (entity1.shape.intersects(entity2.shape)) {
                        console.log('collision ' + name1 + ' -> ' + name2);
                        console.log('collision ' + entity1.position + ' -> ' + entity2.position);
                        entity1.isAlive = false;
                        entity2.isAlive = false;
                    }
                }
            });

        });
    }

    function _removeDestroyedEntities() {
        var allEntities = this._entities;
        Object.getOwnPropertyNames(allEntities)
            .forEach(function (groupName) {
                allEntities[groupName] = allEntities[groupName]
                    .filter(function (entity) {
                        return entity.isAlive;
                    });
            });
    }

    Object.defineProperties(CollisionManager, {
        PLAYER: {
            value: 1,
            writeable: false,
            enumerable: true
        },
        ASTEROID: {
            value: 2,
            writeable: false,
            enumerable: true
        },
        BULLETS: {
            value: 3,
            writeable: false,
            enumerable: true
        },
        FX: {
            value: 99,
            writeable: false,
            enumerable: true
        }
    });
    return CollisionManager;
})();