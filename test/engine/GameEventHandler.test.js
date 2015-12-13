/**
 * Created by Eric on 12/12/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');

var GameEventHandler = require('../../src/engine/GameEventHandler');
var GameEvent = require('../../src/engine/GameEvent');

describe('GameEventHandler', function () {
    beforeEach(function () {
    });

    it('should send events to subscribers ', function () {
        var eventType = 'my-type';
        var gameEvent = new GameEvent(eventType, 'no data');
        var subscriberSpy = spies.create('subscriber');

        var gameEventHandler = new GameEventHandler();
        gameEventHandler.addEvent(gameEvent);

        gameEventHandler.subscribe(eventType, subscriberSpy);
        verify(subscriberSpy).wasNotCalled();

        gameEventHandler.process();
        verify(subscriberSpy).wasCalledWith(gameEvent);
    });

    it('should handle context switching', function () {
        var eventType = 'my-type';
        var gameEvent = new GameEvent(eventType, 'no data');
        var subscriberSpy = spies.create('subscriber');

        var gameEventHandler = new GameEventHandler();
        invokeOutOfContext(gameEventHandler.addEvent, [gameEvent]);

        invokeOutOfContext(gameEventHandler.subscribe, [eventType, subscriberSpy]);
        verify(subscriberSpy).wasNotCalled();

        invokeOutOfContext(gameEventHandler.process);
        verify(subscriberSpy).wasCalledWith(gameEvent);
    });

    it('should send events only once', function () {
        var eventType = 'my-type';
        var gameEvent = new GameEvent(eventType, 'no data');
        var subscriberSpy = spies.create('subscriber');

        var gameEventHandler = new GameEventHandler();
        gameEventHandler.addEvent(gameEvent);
        gameEventHandler.subscribe(eventType, subscriberSpy);

        gameEventHandler.process();
        gameEventHandler.process();
        gameEventHandler.process();
        verify(subscriberSpy).wasCalledOnce();
    });

    it('should only send events to subscribers of a matching type', function () {
        var rightType = 'right-type';
        var wrongType = 'wrong-type';
        var gameEvent = new GameEvent(rightType, 'no data');
        var rightSubscriberSpy = spies.create('right-subscriber');
        var wrongSubscriberSpy = spies.create('wrong-subscriber');

        var gameEventHandler = new GameEventHandler();
        gameEventHandler.addEvent(gameEvent);
        gameEventHandler.subscribe(rightType, rightSubscriberSpy);
        gameEventHandler.subscribe(wrongType, wrongSubscriberSpy);

        gameEventHandler.process();
        verify(rightSubscriberSpy).wasCalledOnce();
        verify(wrongSubscriberSpy).wasNotCalled();
    });

    it('should allow events to be added while processing', function () {
        var gameEvent1 = new GameEvent('type1', 'no data');
        var gameEvent2 = new GameEvent('type2', 'no data');

        var gameEventHandler = new GameEventHandler();

        var subscriber1 = function () {
            gameEventHandler.addEvent(gameEvent2);
        };
        var subscriber2 = spies.create('subscriber2');

        gameEventHandler.addEvent(gameEvent1);
        gameEventHandler.subscribe('type1', subscriber1);
        gameEventHandler.subscribe('type2', subscriber2);

        gameEventHandler.process();
        verify(subscriber2).wasNotCalled();
        gameEventHandler.process();
        verify(subscriber2).wasCalledOnce();
    });

    function invokeOutOfContext(method, params) {
        method.apply({}, params);
    }
});