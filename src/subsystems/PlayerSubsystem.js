/**
 * Created by Eric on 12/12/2015.
 */
var Entity = require('./entities/Entity');
var Shape = require('./entities/Shape');
var Point = require('./entities/Point');
var GameEvent = require('../engine/GameEvent');
var Debug = require('../Debug');

module.exports = (function () {

    var ROTATION_SPEED = 5.0;
    var ACCELLERATION = 0.125;
    var BULLET_VELOCITY = 5.0;

    var playersubsystem = function (entitySubsystem) {
        this._entitySubsystem = entitySubsystem;
    };

    playersubsystem.prototype.initialize = function (gameContainer) {
        var self = this;
        gameContainer.events.subscribe('new-level', _newLevel.bind(self));
    };

    function _newLevel() {
        var oldPlayer = this._player;
        var newPlayer = _createPlayer();
        this._entitySubsystem.addEntity(newPlayer);
        if (oldPlayer) {
            this._entitySubsystem.removeEntity(oldPlayer);
        }
        this._player = newPlayer;
    }

    playersubsystem.prototype.render = function () {
    };

    playersubsystem.prototype.update = function (gameContainer) {
        _handleMovement.call(this, gameContainer);
        var input = gameContainer.input;
        if (input.isPressed(input.SPACEBAR)) {
            var bullet = new Entity(new Shape([
                new Point(0, 0),
                new Point(1, 0)
            ]));
            bullet.position = this._player.position;
            bullet.velocity = new Point(0, BULLET_VELOCITY).rotate(this._player.rotation);
            this._entitySubsystem.addEntity(bullet);
        }
    };

    function _handleMovement(gameContainer) {
        var input = gameContainer.input;
        if (input.isPressed(input.LEFT)) {
            this._player.rotation -= ROTATION_SPEED;
            Debug.log('Input > turn left');
        }
        if (input.isPressed(input.RIGHT)) {
            this._player.rotation += ROTATION_SPEED;
            Debug.log('Input > turn right');
        }
        if (input.isPressed(input.UP)) {
            var velocity = this._player.velocity;
            var thrust = _calculateThrust(this._player.rotation);
            var newVelocity = this._player.velocity = velocity.translate(thrust);
            gameContainer.events.emit(new GameEvent('player-thrust', newVelocity));
        }
        if (input.isPressed(input.DOWN)) {
            var velocity = this._player.velocity;
            var thrust = _calculateThrust(this._player.rotation);
            thrust = new Point(velocity.x - thrust.x, velocity.y - thrust.y);
            var newVelocity = this._player.velocity = thrust;
            gameContainer.events.emit(new GameEvent('player-thrust', newVelocity));
        }
    }

    function _calculateThrust(rotation) {
        var accelVector = new Point(0, ACCELLERATION);
        return accelVector.rotate(rotation);
    }

    function _createPlayer() {
        var playerShape = new Shape([
            new Point(-5, -5),
            new Point(0, -5),
            new Point(5, -5),
            new Point(0, 5),
        ]);
        var player = new Entity(playerShape);
        player.position = new Point(200, 200);
        return player;
    }

    return playersubsystem;
})();