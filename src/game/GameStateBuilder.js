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
    },
    buildGameOverState: function (stateManager) {
        return _gameOverState(stateManager);
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
            gameContainer.events.emit(new GameEvent('new-game', {}));
        }
    };
    return startState;
}
function _playState(dependencies) {
    var playState = new State('play');
    var _state = {};
    _resetPlayState();
    playState.addEventHandler('entity-added', function (event) {
        if (isAsteroid(event.data.type)) {
            _state.levelHasEnded = false;
            _state.asteroidCount++;
        }
    });
    playState.addEventHandler('new-game', function (event) {
        _resetPlayState();
        dependencies.playerSubsystem.respawnPlayer();
        playState._gameContainer.events.emit(new GameEvent('score-change', {score: _state.currentScore}));
        playState._gameContainer.events.emit(new GameEvent('player-life-change', {lives: _state.playerLives}));
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
                _state.currentScore += 25;
                _spawnTwoAsteroids(dependencies.entityFactory.buildMediumAsteroid, event.data.position);
            } else if (event.data.type === 'asteroid-medium') {
                _state.currentScore += 35;
                _spawnTwoAsteroids(dependencies.entityFactory.buildSmallAsteroid, event.data.position);
            }
            else if (event.data.type === 'asteroid-small') {
                _state.currentScore += 50;
            }
            _state.asteroidCount--;
            playState._gameContainer.events.emit(new GameEvent('score-change', {score: _state.currentScore}));
        } else if (isPlayer(event.data.type)) {
            _state.playerLives--;
            playState._gameContainer.events.emit(new GameEvent('player-life-change', {lives: _state.playerLives}));
            _state.playerIsAlive = false;
            _state.playerRespawnTimer = 5000;
            if (_state.playerLives <= 0) {
                dependencies.stateManager.changeState('game-over');
            }
        }
    });
    function _resetPlayState() {
        _state.asteroidCount = 0;
        _state.currentLevelNumber = 0;
        _state.levelHasEnded = false;
        _state.currentScore = 0;
        _state.playerLives = 3;
        _state.playerIsAlive = true;
        _state.playerRespawnTimer = 0;
    }

    function _spawnTwoAsteroids(factory, position) {
        var asteroid1 = factory(position);
        var asteroid2 = factory(position);
        dependencies.entitySubsystem.addEntity(asteroid1, CollisionManager.ASTEROID);
        dependencies.entitySubsystem.addEntity(asteroid2, CollisionManager.ASTEROID);
    }

    playState.addUpdate(_updatePlayerState);
    playState.addUpdate(_checkForLevelEnd);
    playState.addUpdate(function () {
        DEBUG.display.asteroids = _state.asteroidCount;
    });

    function _updatePlayerState(gameContainer) {
        if (!_state.playerIsAlive) {
            _state.playerRespawnTimer -= gameContainer.timeSinceLastFrame;
            if (_state.playerRespawnTimer <= 0) {
                dependencies.playerSubsystem.respawnPlayer();
                _state.playerIsAlive = true;
            }
        }
    }

    function _checkForLevelEnd(gameContainer) {
        if (_state.asteroidCount === 0 && !_state.levelHasEnded) {
            _state.levelHasEnded = true;
            _state.currentLevelNumber++;
            gameContainer.events.emit(new GameEvent('new-level', {levelNumber: _state.currentLevelNumber}));
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

function _gameOverState(stateManager) {
    var gameOverState = new State('game-over');
    gameOverState.addUpdate(function (gameContainer) {
        var spacebarPressed = gameContainer.input.isPressed(GameInput.SPACEBAR);
        if (spacebarPressed) {
            stateManager.changeState('start-screen');
        }
    });
    return gameOverState;
}
/*
 State Class
 */

var State = function (name) {
    this._subscribers = [];
    this._updateHandlers = [];
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
State.prototype.addUpdate = function (updateHandler) {
    this._updateHandlers.push(updateHandler);
}
State.prototype.unload = function (gameContainer) {
    this._subscribers.forEach(function (subscriber) {
        gameContainer.events.unsubscribe(subscriber.type, subscriber.handler);
    });
};
State.prototype.update = function (gameContainer) {
    this._updateHandlers.forEach(function (handler) {
        handler(gameContainer);
    });
};