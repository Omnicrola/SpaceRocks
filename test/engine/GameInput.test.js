/**
 * Created by Eric on 12/12/2015.
 */
var GameInput = require('../../src/engine/GameInput');
var verify = require('../TestVerification');
var spies = require('../TestSpies');

describe('GameInput', function () {
    var addListenerSpy;
    var blockedKeys;
    beforeEach(function () {
        blockedKeys = [37, 38, 39, 40, 32];
        addListenerSpy = spies.replace(document, 'addEventListener');
    });

    afterEach(function () {
        spies.restoreAll();
    })


    it('should add a document listeners', function () {
        assert.isFalse(addListenerSpy.called);
        gameInput = new GameInput();

        verify(addListenerSpy).wasCalledTwice();
        assert.equal('keyup', addListenerSpy.firstCall.args[0]);
        assert.equal('keydown', addListenerSpy.secondCall.args[0]);
        assert.isFunction(addListenerSpy.firstCall.args[1]);
        assert.isFunction(addListenerSpy.secondCall.args[1]);
    });

    it('should block default key actions', function () {
        var gameInput = new GameInput();

        blockedKeys.forEach(function (keyCode) {
            checkKeyIsBlocked(keyCode);
        });
    });

    function checkKeyIsBlocked(keyCode) {
        var upEvent = createKeyEvent('keyup', keyCode);
        var downEvent = createKeyEvent('keydown', keyCode);

        getKeyDownFunction()(downEvent);
        getKeyUpFunction()(upEvent);

        verify(upEvent.preventDefault).wasCalled();
        verify(downEvent.preventDefault).wasCalled();
    }

    it('should not block unnecessary keys', function () {
        var gameInput = new GameInput();

        var keysNotBlocked = generateKeycodesForUnblockedKeys();
        keysNotBlocked.forEach(function (keyCode) {
            checkKeyIsNotBlocked(keyCode);
        });


    });

    function generateKeycodesForUnblockedKeys() {
        var keysNotBlocked = [];
        for (var i = 1; i <= 255; i++) {
            if (blockedKeys.indexOf(i) === -1) {
                keysNotBlocked.push(i);
            }
        }
        return keysNotBlocked;
    }

    function checkKeyIsNotBlocked(keyCode) {
        var upEvent = createKeyEvent('keyup', keyCode);
        var downEvent = createKeyEvent('keydown', keyCode);

        getKeyDownFunction()(downEvent);
        getKeyUpFunction()(upEvent);

        assert.isFalse(upEvent.preventDefault.called, 'Keycode ' + keyCode + ' should not be blocked.');
        assert.isFalse(downEvent.preventDefault.called, 'Keycode ' + keyCode + ' should not be blocked.');
    }

    it('should record when keys are up', function () {
        var gameInput = new GameInput();

        var key1 = randomKey();
        var key2 = randomKey();
        var key3 = randomKey();
        var key4 = randomKey();

        sendKeyDownEvents([key1, key2, key3, key4]);
        sendKeyUpEvents([key1, key2, key3]);

        assert.isFalse(gameInput.isPressed(key1), key1 + ' should not be pressed');
        assert.isFalse(gameInput.isPressed(key2), key2 + ' should not be pressed');
        assert.isFalse(gameInput.isPressed(key3), key3 + ' should not be pressed');
        assert.isTrue(gameInput.isPressed(key4), key4 + ' should be pressed');

    });

    it('should record when keys are down', function () {
        var gameInput = new GameInput();

        var key2 = randomKey();
        var key3 = randomKey();
        var key1 = randomKey();
        var key4 = randomKey();

        sendKeyDownEvents([key1, key2, key3]);
        assert.isTrue(gameInput.isPressed(key1));
        assert.isTrue(gameInput.isPressed(key2));
        assert.isTrue(gameInput.isPressed(key3));
        assert.isFalse(gameInput.isPressed(key4));
    });

    it('should have constants defined for game related keys', function () {
        var gameInput = GameInput;

        verify.readOnlyProperty(gameInput, 'LEFT', 37);
        verify.readOnlyProperty(gameInput, 'UP', 38);
        verify.readOnlyProperty(gameInput, 'RIGHT', 39);
        verify.readOnlyProperty(gameInput, 'DOWN', 40);
        verify.readOnlyProperty(gameInput, 'SPACEBAR', 32);


    });

    function randomKey() {
        return Math.round(Math.random() * 255);
    }

    function sendKeyUpEvents(keys) {
        var keyUpFunction = getKeyUpFunction();
        keys.forEach(function (key) {
            var event = createKeyEvent('keyup', key);
            keyUpFunction.call({}, event);
        });
    }

    function sendKeyDownEvents(keys) {
        var keyDownFunction = getKeyDownFunction();
        keys.forEach(function (key) {
            var event = createKeyEvent('keydown', key);
            keyDownFunction.call({}, event);
        });
    }

    function getKeyUpFunction() {
        return addListenerSpy.firstCall.args[1];
    }

    function getKeyDownFunction() {
        return addListenerSpy.secondCall.args[1];
    }

    function createKeyEvent(type, keycode) {
        return {
            type: type,
            keyCode: keycode,
            preventDefault: spies.create('preventDefault')
        }
    }


});