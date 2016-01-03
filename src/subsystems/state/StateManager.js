/**
 * Created by Eric on 12/12/2015.
 */

var GameEvent = require('../../engine/GameEvent');
var CollisionManager = require('../entities/CollisionManager');
var EntityFactory = require('../entities/EntityFactory');
var Entity = require('../entities/Entity');
var Shape = require('../entities/Shape');
var Point = require('../entities/Point');

var StateManager = function () {
    this._states = [];
    this._gameContainer = null;
};
StateManager.prototype.addState = function (newState) {
    this._states.push(newState);
};

StateManager.prototype.initialize = function (gameContainer) {
    this._currentState = this._states[0];
    this._currentState.load(gameContainer);
    this._gameContainer = gameContainer;
};

StateManager.prototype.changeState = function (desiredStateName) {
    var newState = _findState.call(this, desiredStateName);
    this._currentState.unload(this._gameContainer);
    newState.load(this._gameContainer);
    this._currentState = newState;
};
function _findState(desiredStateName) {
    var states = this._states.filter(function (state) {
        return state.name === desiredStateName;
    });
    if (states.length === 0) {
        throw new Error('Invalid game state "' + desiredStateName + '" was requested.')
    }
    return states[0];
}

StateManager.prototype.update = function (gameContainer) {
    this._currentState.update(gameContainer);
};

StateManager.prototype.render = function (gameContainer) {
};

module.exports = StateManager;