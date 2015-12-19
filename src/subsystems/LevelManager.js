/**
 * Created by Eric on 12/12/2015.
 */

var GameEvent = require('../engine/GameEvent');
var EntityFactory = require('./entities/EntityFactory');
var Entity = require('./entities/Entity');
var Shape = require('./entities/Shape');
var Point = require('./entities/Point');

module.exports = (function () {
    var levelmanager = function (entitySubsystem) {
        this._entitySubsystem = entitySubsystem;
        this._currentLevel = 0;
    };

    levelmanager.prototype.initialize = function (gameContainer) {
        var subscribe = gameContainer.events.subscribe;
        subscribe('engine-start', function (event) {
            gameContainer.events.emit(new GameEvent('new-game', null));
            gameContainer.events.emit(_newLevelEvent.call(this));
        }.bind(this));
        subscribe('entity-destroyed', function (event) {
            gameContainer.events.emit(_newLevelEvent.call(this));
        }.bind(this));
        subscribe('new-level', function (event) {
            _loadNewLevel.call(this, gameContainer);
        }.bind(this));
    };

    function _loadNewLevel(gameContainer) {
        for (var i = 0; i < 5; i++) {
            var asteroid = EntityFactory.buildAsteroid(gameContainer.display);
            this._entitySubsystem.addEntity(asteroid);
        }
    }

    function _newLevelEvent() {
        this._currentLevel++;
        return new GameEvent('new-level', {levelNumber: this._currentLevel});
    }

    levelmanager.prototype.update = function () {
    };
    levelmanager.prototype.render = function () {
    };
    return levelmanager;
})();