/**
 * Created by omnic on 1/3/2016.
 */

var GameInput = require('../engine/GameInput');

module.exports = {
    buildLoadingState: function (stateManager) {
        return _loadingState(stateManager);
    },
    buildStartScreen: function (stateManager) {
        return _startScreenState(stateManager);
    }
};

function _loadingState(stateManager) {
    var loadingState = new State('loading');
    loadingState.addEventHandler('engine-start', function (event) {
        stateManager.changeState('start-screen');
    })
    return loadingState;
}

function _startScreenState(stateManager) {
    var startState = new State('start-screen');
    startState.update = function (gameContainer) {
        var spacebarPressed = gameContainer.input.isPressed(GameInput.SPACEBAR);
        if (spacebarPressed) {
            stateManager.changeState('play');
        }
    };
    return startState;
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