/**
 * Created by Eric on 12/12/2015.
 */

var GameEvent = require('../engine/GameEvent');
var CollisionManager = require('./entities/CollisionManager');
var EntityFactory = require('./entities/EntityFactory');
var Entity = require('./entities/Entity');
var Shape = require('./entities/Shape');
var Point = require('./entities/Point');

var LevelManager = function (entitySubsystem) {
    this._entitySubsystem = entitySubsystem;
    this._gameModel = {
        currentLevel: 0,
        playerLives: 0,
        liveAsteroids: 0,
        playerScore: 0,
        isLevelActive: false
    };
};

LevelManager.prototype.initialize = function (gameContainer) {
    var subscribe = gameContainer.events.subscribe;
    subscribe('engine-start', _engineStart.call(this, gameContainer));
    subscribe('new-game', _newGame.call(this, gameContainer));
    subscribe('new-level', _newLevel.call(this, gameContainer));
    subscribe('entity-death', _entityDeath.call(this, gameContainer));
};

function _engineStart(gameContainer) {
    return function (event) {
        gameContainer.events.emit(new GameEvent('new-game', null));
    }.bind(this);
};

function _newGame(gameContainer) {
    return function (event) {
        this._gameModel.playerScore = 0;
        this._gameModel.playerLives = 3;
        this._gameModel.currentLevel = 0;
        gameContainer.events.emit(_newLevelEvent.call(this));
        gameContainer.events.emit(new GameEvent('score-change', {score: 0}));
        gameContainer.events.emit(new GameEvent('player-life-change', {lives: 3}));
    }.bind(this);
}
function _newLevel(gameContainer) {
    return function (event) {
        for (var i = 0; i < 5; i++) {
            var asteroid = EntityFactory.buildAsteroid(gameContainer.display);
            this._entitySubsystem.addEntity(asteroid, CollisionManager.ASTEROID);
        }
        this._gameModel.liveAsteroids = 5;
        this._gameModel.isLevelActive = true;
    }.bind(this);
}

function _entityDeath(gameContainer) {
    return function (event) {
        if (event.data.type === Entity.Type.ASTEROID) {
            this._gameModel.liveAsteroids--;
            var currentScore = this._gameModel.playerScore = this._gameModel.playerScore + 100;
            gameContainer.events.emit(new GameEvent('score-change', {score: currentScore}));
        }
        if (this._gameModel.liveAsteroids <= 0 &&
            this._gameModel.isLevelActive) {
            this._gameModel.isLevelActive = false;
            gameContainer.events.emit(_newLevelEvent.call(this));
        }
    }.bind(this);
}

function _newLevelEvent() {
    this._gameModel.currentLevel++;
    return new GameEvent('new-level', {levelNumber: this._gameModel.currentLevel});
}

LevelManager.prototype.update = function () {
};
LevelManager.prototype.render = function () {
};
module.exports = LevelManager;