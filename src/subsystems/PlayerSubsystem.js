/**
 * Created by Eric on 12/12/2015.
 */
var Entity = require('./entities/Entity');

module.exports = (function () {
    var playersubsystem = function (entitySubsystem) {
        this._entitySubsystem = entitySubsystem;
    };
    playersubsystem.prototype.initialize = function (gameContainer) {
        gameContainer.events.subscribe('new-level', function (event) {
            var player = new Entity();
            this._entitySubsystem.addEntity(player);
        }.bind(this));
    };
    playersubsystem.prototype.render = function () {
    };
    playersubsystem.prototype.update = function () {
    };
    return playersubsystem;
})();