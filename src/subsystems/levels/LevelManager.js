/**
 * Created by Eric on 12/12/2015.
 */

var GameEvent = require('../../engine/GameEvent');

module.exports = (function () {
    var levelmanager = function () {
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
    };
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