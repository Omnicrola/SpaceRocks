/**
 * Created by omnic on 1/3/2016.
 */

module.exports = {
    buildStartupState: function (stateManager) {
        return _startupState(stateManager);
    }
};

var State = function () {
    this._subscribers = [];
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

function _startupState(stateManager) {
    var startupState = new State();
    startupState.addEventHandler('engine-start', function (event) {
        stateManager.changeState('start-screen');
    })
    return startupState;
}
