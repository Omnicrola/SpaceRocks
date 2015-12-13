/**
 * Created by Eric on 12/12/2015.
 */
var Entity = require('./entities/Entity');
var Shape = require('./entities/Shape');
var Point = require('./entities/Point');

module.exports = (function () {
    var playersubsystem = function (entitySubsystem) {
        this._entitySubsystem = entitySubsystem;
    };

    playersubsystem.prototype.initialize = function (gameContainer) {
        gameContainer.events.subscribe('new-level', function (event) {
            var player = _createPlayer();
            this._entitySubsystem.addEntity(player);
        }.bind(this));
    };

    playersubsystem.prototype.render = function () {
    };

    playersubsystem.prototype.update = function () {
    };

    function _createPlayer() {
        var playerShape = new Shape([
            new Point(-5, -5),
            new Point(0, -5),
            new Point(5, -5),
            new Point(0, 0),
        ]);
        var player = new Entity(playerShape);
        player.position = new Point(200, 200);
        return player;
    }

    return playersubsystem;
})();