/**
 * Created by Eric on 12/12/2015.
 */
var spies = require('../TestSpies');
var GameInput = require('../../src/engine/GameInput');
var GameAudio = require('../../src/engine/GameAudio');
var GameEvent = require('../../src/engine/GameEvent');

module.exports = {
    create: function () {
        return {
            delta: 1.0,
            input: spies.createStub(new GameInput(), 'GameInput'),
            audio: spies.createStubInstance(GameAudio, 'GameAudio'),
            display: {
                width: 100,
                height: 100
            },
            events: {
                emit: spies.create('emit'),
                subscribe: spies.create('subscribe'),
                unsubscribe: spies.create('unsubscribe')
            },
            $emitMockEvent: function (type, data) {
                var gameEvent = new GameEvent(type, data);
                var subscribers = getSubscribers(this.events.subscribe, type);
                subscribers.forEach(function (subscriber) {
                    subscriber.call({}, gameEvent);
                })
            }
        }
    }
};

function getSubscribers(subscriberStub, targetType) {
    var size = subscriberStub.callCount;
    var subscribers = [];
    for (var i = 0; i < size; i++) {
        var call = subscriberStub.getCall(i);
        if (call.args[0] === targetType) {
            subscribers.push(call.args[1]);
        }
    }
    return subscribers;
}