/**
 * Created by omnic on 1/3/2016.
 */

var DEBUG = require('../Debug');

var GameInput = require('../engine/GameInput');
var GameEvent = require('../engine/GameEvent');
var CollisionManager = require('../subsystems/entities/CollisionManager');

module.exports = {
    buildLoadingState: function (stateManager) {
        return _loadingState(stateManager);
    },
    buildStartScreen: function (stateManager, playerSubsystem) {
        return _startScreenState(stateManager, playerSubsystem);
    },
    buildPlayState: function (dependencies) {
        return _playState(dependencies);
    }
};

function _loadingState(stateManager) {
    var loadingState = new State('loading');
    loadingState.addEventHandler('engine-start', function (event) {
        stateManager.changeState('start-screen');
    })
    return loadingState;
}

function _startScreenState(stateManager, playerSubsystem) {
    var startState = new State('start-screen');
    startState.update = function (gameContainer) {
        var spacebarPressed = gameContainer.input.isPressed(GameInput.SPACEBAR);
        if (spacebarPressed) {
            stateManager.changeState('play');
            gameContainer.events.emit(new GameEvent('score-change', {score: 0}));
            gameContainer.events.emit(new GameEvent('player-life-change', {lives: 3}));
            playerSubsystem.respawnPlayer();
        }
    };
    return startState;
}
function _playState(dependencies) {
    var playState = new State('play');
    var asteroidCount = 0;
    var currentLevelNumber = 0;
    var levelHasEnded = false;
    var currentScore = 0;
    var playerLives = 3;
    var playerIsAlive = true;
    var playerRespawnTimer = 0;
    playState.addEventHandler('entity-added', function (event) {
        if (isAsteroid(event.data.type)) {
            levelHasEnded = false;
            asteroidCount++;
        }
    });
    playState.addEventHandler('new-level', function (event) {
        for (var i = 0; i < 5; i++) {
            var asteroid = dependencies.entityFactory.buildLargeAsteroid(playState._gameContainer.display);
            dependencies.entitySubsystem.addEntity(asteroid, CollisionManager.ASTEROID);
        }
    });
    playState.addEventHandler('entity-death', function (event) {
        if (isAsteroid(event.data.type)) {
            if (event.data.type === 'asteroid-large') {
                currentScore += 25;
            } else if (event.data.type === 'asteroid-medium') {
                currentScore += 35;
            }
            else if (event.data.type === 'asteroid-small') {
                currentScore += 50;
            }
            asteroidCount--;
            playState._gameContainer.events.emit(new GameEvent('score-change', {score: currentScore}));
        } else if (isPlayer(event.data.type)) {
            playerLives--;
            playState._gameContainer.events.emit(new GameEvent('player-life-change', {lives: playerLives}));
            playerIsAlive = false;
            playerRespawnTimer = 5000;
        }

    });
    playState.update = function (gameContainer) {
        DEBUG.display.asteroids = asteroidCount;
        _updatePlayerState(gameContainer);
        _checkForLevelEnd(gameContainer);
    };
    function _updatePlayerState(gameContainer) {
        if (!playerIsAlive) {
            playerRespawnTimer -= gameContainer.timeSinceLastFrame;
            if (playerRespawnTimer <= 0) {
                dependencies.playerSubsystem.respawnPlayer();
                playerIsAlive = true;
            }
        }
    }

    function _checkForLevelEnd(gameContainer) {
        if (asteroidCount === 0 && !levelHasEnded) {
            levelHasEnded = true;
            currentLevelNumber++;
            gameContainer.events.emit(new GameEvent('new-level', {levelNumber: currentLevelNumber}));
        }
    }

    return playState;
}

function isAsteroid(type) {
    return type === 'asteroid-large' ||
        type === 'asteroid-medium' ||
        type === 'asteroid-small';
}

function isPlayer(type) {
    return type === 'player';
}
/*
 State Class
 */

var State = function (name) {
    this._subscribers = [];
    Object.defineProperties(this,
        {
            name: {
                enumerable: true,
                value: name
            }
        });
};
State.prototype.addEventHandler = function (type, handler) {
    this._subscribers.push({type: type, handler: handler});
}
State.prototype.load = function (gameContainer) {
    this._gameContainer = gameContainer;
    this._subscribers.forEach(function (subscriber) {
        gameContainer.events.subscribe(subscriber.type, subscriber.handler);
    });
};
State.prototype.unload = function (gameContainer) {
    this._subscribers.forEach(function (subscriber) {
        gameContainer.events.unsubscribe(subscriber.type, subscriber.handler);
    });
};
State.prototype.update = function (gameContainer) {
};