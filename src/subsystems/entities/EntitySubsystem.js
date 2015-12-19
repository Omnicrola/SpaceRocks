/**
 * Created by omnic on 11/29/2015.
 */

var Point = require('./Point');
var Debug = require('../../Debug');

module.exports = (function () {
    var entitySubsystem = function () {
        this._entities = [];
    };

    entitySubsystem.prototype.render = function (renderer) {
        this._entities.forEach(function (singleEntity) {
            singleEntity.render(renderer);
        });
    };

    entitySubsystem.prototype.update = function (gameContainer) {
        this._entities = this._entities.filter(function (singleEntity) {
            return singleEntity.isAlive;
        });
        this._entities.forEach(function (singleEntity) {
            _wrapPosition(singleEntity, gameContainer.display);
            singleEntity.update(gameContainer.delta);
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

    entitySubsystem.prototype.initialize = function (container) {

    };

    entitySubsystem.prototype.addEntity = function (newEntity) {
        this._entities.push(newEntity);
    };

    entitySubsystem.prototype.removeEntity = function (entityToRemove) {
        var position = this._entities.indexOf(entityToRemove);
        this._entities.splice(position, 1);
    }

    return entitySubsystem;
})();