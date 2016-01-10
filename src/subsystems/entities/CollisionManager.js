/**
 * Created by Eric on 12/19/2015.
 */

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

CollisionManager.prototype.remove = function (entity) {
    _getAllGroups.call(this)
        .forEach(function (group) {
            var position = group.members.indexOf(entity);
            if (position !== -1) {
                group.members.splice(position, 1);
                return;
            }
        });
};

CollisionManager.prototype.update = function (gameContainer) {
    _removeDestroyedEntities.call(this);
    var allEntities = this._entities;

    var allGroups = _getAllGroups.call(this);
    allGroups.forEach(function (firstGroup) {
        allGroups.forEach(function (secondGroup) {
            if (_groupsShouldCollide(firstGroup, secondGroup)) {
                _collideGroups(gameContainer, firstGroup, secondGroup);
            }
        });
    });
};

function _getAllGroups() {
    var allEntities = this._entities;
    return Object.getOwnPropertyNames(allEntities)
        .map(function (name) {
            return allEntities[name];
        });
}

function _groupsShouldCollide(firstGroup, secondGroup) {
    if (firstGroup === secondGroup) {
        return false;
    }
    var firstCollidesWithSecond = firstGroup.mask[secondGroup.id] === 1;
    var secondCollidesWithFirst = secondGroup.mask[firstGroup.id] === 1;
    return firstCollidesWithSecond && secondCollidesWithFirst;
}

function _collideGroups(gameContainer, firstGroup, secondGroup) {
    firstGroup.members.forEach(function (entity1) {
        secondGroup.members.forEach(function (entity2) {
            if (entity1.isAlive && entity2.isAlive) {
                var shape1 = entity1.shape;
                var shape2 = entity2.shape;
                if (shape1.boundingBox.intersects(shape2.boundingBox)) {
                    if (shape1.intersects(shape2)) {
                        entity1.destroy(gameContainer);
                        entity2.destroy(gameContainer);
                    }
                }
            }
        });
    });
}

function _removeDestroyedEntities() {
    _getAllGroups.call(this)
        .forEach(function (group) {
            group.members = group.members.filter(_entityIsAlive);
        });
}

function _entityIsAlive(entity) {
    return entity.isAlive;
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

module.exports = CollisionManager;