/**
 * Created by Eric on 12/12/2015.
 */

var GameEvent = require('../engine/GameEvent');
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
        subscribe('new-level', _loadNewLevel.bind(this));
    };

    function _loadNewLevel() {
        for (var i = 0; i < 5; i++) {
            this._entitySubsystem.addEntity(_createAsteroid());
        }
    }

    function _createAsteroid() {
        var entity = new Entity(new Shape([
            new Point(-20, 60),
            new Point(50, 20),
            new Point(40, -30),
            new Point(-10, -40),
            new Point(-50, -10),
            new Point(-40, 50)
        ]));
        entity.position = new Point(rand(640), rand(480));
        entity.velocity = new Point(rand(1) - 0.5, rand(1) - 0.5);
        return entity;
    }

    function rand(max) {
        return Math.random() * max;
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