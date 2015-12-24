/**
 * Created by Eric on 12/12/2015.
 */
var EntityFactory = require('./entities/EntityFactory');
var CollisionManager = require('./entities/CollisionManager');
var Point = require('./entities/Point');
var GameEvent = require('../engine/GameEvent');
var GameInput = require('../engine/GameInput');
var Debug = require('../Debug');

module.exports = (function () {

    var ROTATION_SPEED = 5.0;
    var ACCELLERATION = 0.125;
    var BULLET_VELOCITY = 5.0;

    var playersubsystem = function (config) {
        this._entitySubsystem = config.entitySubsystem;
        this._timer = config.time;
        this._playerWeaponDelay = config.playerWeaponDelay;
        this._lastWeaponDischarge = config.time.getCurrentTime();
    };

    playersubsystem.prototype.initialize = function (gameContainer) {
        var self = this;
        gameContainer.events.subscribe('new-level', _newLevel.bind(self));
    };

    function _newLevel() {
        var oldPlayer = this._player;
        var newPlayer = _createPlayer();
        this._entitySubsystem.addEntity(newPlayer, CollisionManager.PLAYER);
        if (oldPlayer) {
            this._entitySubsystem.removeEntity(oldPlayer);
        }
        this._player = newPlayer;
    }

    playersubsystem.prototype.render = function () {
    };

    playersubsystem.prototype.update = function (gameContainer) {
        _handleMovement.call(this, gameContainer);
        _handleWeapons.call(this, gameContainer);
    };

    function _handleMovement(gameContainer) {
        var input = gameContainer.input;
        if (input.isPressed(GameInput.LEFT)) {
            this._player.rotation -= ROTATION_SPEED;
        }
        if (input.isPressed(GameInput.RIGHT)) {
            this._player.rotation += ROTATION_SPEED;
        }
        if (input.isPressed(GameInput.UP)) {
            var velocity = this._player.velocity;
            var thrust = _calculateThrust(this._player.rotation);
            var newVelocity = this._player.velocity = velocity.translate(thrust);
            gameContainer.events.emit(new GameEvent('player-thrust', newVelocity));
        }
        if (input.isPressed(GameInput.DOWN)) {
            var velocity = this._player.velocity;
            var thrust = _calculateThrust(this._player.rotation);
            thrust = new Point(velocity.x - thrust.x, velocity.y - thrust.y);
            var newVelocity = this._player.velocity = thrust;
            gameContainer.events.emit(new GameEvent('player-thrust', newVelocity));
        }
    }

    function _handleWeapons(gameContainer) {
        if (gameContainer.input.isPressed(GameInput.SPACEBAR)) {
            var now = this._timer.getCurrentTime();
            var elapsed = now - this._lastWeaponDischarge;
            if (elapsed >= this._playerWeaponDelay) {
                this._lastWeaponDischarge = now;
                var position = this._player.position;
                var velocity = new Point(0, BULLET_VELOCITY).rotate(this._player.rotation);
                var bullet = EntityFactory.buildBullet(position, velocity);
                this._entitySubsystem.addEntity(bullet, CollisionManager.BULLETS);
                gameContainer.events.emit(new GameEvent('player-fire', {
                    position: position,
                    velocity: velocity
                }));
            }
        }
    }

    function _calculateThrust(rotation) {
        var accelVector = new Point(0, ACCELLERATION);
        return accelVector.rotate(rotation);
    }

    function _createPlayer() {
        return EntityFactory.buildPlayer(new Point(320, 240));
    }

    return playersubsystem;
})();