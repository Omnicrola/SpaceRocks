/**
 * Created by Eric on 12/12/2015.
 */
module.exports = (function () {
    var inputWrapper = function () {
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
    }

    function _keyDown(event) {
        this._keyStates[event.keyCode] = true;
    }

    inputWrapper.prototype.isPressed = function (keyCode) {
        return this._keyStates[keyCode];
    }

    Object.defineProperties(inputWrapper.prototype, {
        'LEFT': {
            value: 37
        },
        'UP': {
            value: 38
        },
        'RIGHT': {
            value: 39
        },
        'DOWN': {
            value: 40
        },
        'SPACEBAR': {
            value: 32
        }
    });

    return inputWrapper;
})();