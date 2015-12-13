/**
 * Created by Eric on 12/12/2015.
 */
var GameInput = require('../../src/engine/GameInput');
var verify = require('../TestVerification');
var spies = require('../TestSpies');

describe('GameInput', function () {
    var addListenerSpy;
    beforeEach(function () {
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

    it('should block default key actions', function(){
        var gameInput = new GameInput();

        var upEvent = createKeyEvent('keyup', randomKey());
        var downEvent = createKeyEvent('keyup', randomKey());

        getKeyUpFunction()(upEvent);
        getKeyDownFunction()(downEvent);

        verify(upEvent.preventDefault).wasCalled();
        verify(downEvent.preventDefault).wasCalled();



    });

    it('should record when keys are up', function () {
        var gameInput = new GameInput();

        var key1 = randomKey();
        var key2 = randomKey();
        var key3 = randomKey();
        var key4 = randomKey();

        sendKeyDownEvents([key1, key2, key3, key4]);
        sendKeyUpEvents([key1, key2, key3]);

        assert.isFalse(gameInput.isPressed(key1));
        assert.isFalse(gameInput.isPressed(key2));
        assert.isFalse(gameInput.isPressed(key3));
        assert.isTrue(gameInput.isPressed(key4));

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
        var gameInput = new GameInput();

        verifyReadonlyProperty(gameInput, 'LEFT', 37);
        verifyReadonlyProperty(gameInput, 'UP', 38);
        verifyReadonlyProperty(gameInput, 'RIGHT', 39);
        verifyReadonlyProperty(gameInput, 'DOWN', 40);
        verifyReadonlyProperty(gameInput, 'SPACEBAR', 32);


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
            preventDefault : spies.create('preventDefault')
        }
    }

    function verifyReadonlyProperty(object, propName, expectedValue) {
        if (object[propName] !== expectedValue) {
            throw new Error('Expected object to have a property named "' +
                propName + '" with a value of "' +
                expectedValue + '" but got "' + object[propName]);
        }
        object[propName] = Math.random();
        if (object[propName] !== expectedValue) {
            throw new Error('Objects property "' + propName + '" should be read-only, but was not');
        }
    }
});