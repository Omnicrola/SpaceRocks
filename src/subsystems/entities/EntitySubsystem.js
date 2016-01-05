/**
 * Created by omnic on 11/29/2015.
 */

var DEBUG = require('../../Debug');

var Point = require('./Point');
var CollisionManager = require('./CollisionManager');
var GameEvent = require('../../engine/GameEvent');
var Debug = require('../../Debug');


var EntitySubsystem = function () {
    this._entities = [];
    this._collisionManager = new CollisionManager();
};

EntitySubsystem.prototype.render = function (renderer) {
    this._entities.forEach(function (singleEntity) {
        singleEntity.render(renderer);
    });
};

EntitySubsystem.prototype.update = function (gameContainer) {
    this._collisionManager.update(gameContainer);
    this._entities = this._entities.filter(function (singleEntity) {
        return singleEntity.isAlive;
    });
    this._entities.forEach(function (singleEntity) {
        _wrapPosition(singleEntity, gameContainer.display);
        singleEntity.update(gameContainer);
    });
};

function _wrapPosition(entity, display) {
    var newPosition = entity.position;
    if (entity.position.x < 0) {
        newPosition = new Point(display.width, newPosition.y);
    }
    if (entity.position.x > display.width) {
        newPosition = new Point(0, newPosition.y);
    }
    if (entity.position.y < 0) {
        newPosition = new Point(newPosition.x, display.height);
    }
    if (entity.position.y > display.height) {
        newPosition = new Point(newPosition.x, 0);
    }
    entity.position = newPosition;
}

EntitySubsystem.prototype.initialize = function (gameContainer) {
    this._gameContainer = gameContainer;
};

var nextId = 1;
EntitySubsystem.prototype.addEntity = function (newEntity, collisionGroup) {
    newEntity.id = nextId++;
    this._entities.push(newEntity);
    this._collisionManager.add(newEntity, collisionGroup);
    this._gameContainer.events.emit(new GameEvent('entity-added', {type: newEntity.type}));
    DEBUG.log('Add entity: ' + newEntity.id);
};

EntitySubsystem.prototype.removeEntity = function (entityToRemove) {
    var position = this._entities.indexOf(entityToRemove);
    if (position !== -1) {
        this._collisionManager.remove(entityToRemove);
        this._entities.splice(position, 1);
        this._gameContainer.events.emit(new GameEvent('entity-removed', {type: entityToRemove.type}));
        DEBUG.log('Removed entity' + entityToRemove.id);
    }
}

module.exports = EntitySubsystem;