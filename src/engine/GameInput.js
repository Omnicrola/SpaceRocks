/**
 * Created by Eric on 12/12/2015.
 */

var DEBUG = require('../Debug');

module.exports = (function () {
    var GameInput = function () {
        this._keyStates = _initializeKeyStates();
        document.addEventListener('keyup', _keyUp.bind(this));
        document.addEventListener('keydown', _keyDown.bind(this));
    };

    function _initializeKeyStates() {
        var keyStates = new Array(255);
        for (var i = 0; i < keyStates.length; i++) {
            keyStates[i] = false;
        }
        return keyStates;
    }

    function _keyUp(event) {
        this._keyStates[event.keyCode] = false;
        supressGameKeys(event);
    }

    function _keyDown(event) {
        this._keyStates[event.keyCode] = true;
        supressGameKeys(event);
    }

    function supressGameKeys(event) {
        if (blockedKeys.indexOf(event.keyCode) !== -1) {
            event.preventDefault();
        }
    }

    GameInput.prototype.isPressed = function (keyCode) {
        return this._keyStates[keyCode];
    }

    Object.defineProperties(GameInput, {
        'LEFT': {
            value: 37,
            enumerable: true
        },
        'UP': {
            value: 38,
            enumerable: true
        },
        'RIGHT': {
            value: 39,
            enumerable: true
        },
        'DOWN': {
            value: 40,
            enumerable: true
        },
        'SPACEBAR': {
            value: 32,
            enumerable: true
        }
    });
    var blockedKeys = [37, 38, 39, 40, 32];

    return GameInput;
})();