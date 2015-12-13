/**
 * Created by Eric on 12/12/2015.
 */
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var interface = require('../../TestInterfaces');
var mockGameContainer = require('../../mocks/GameContainer');

var LevelManager = require('../../../src/subsystems/levels/LevelManager');
var GameEvent = require('../../../src/engine/GameEvent');

describe('LevelManager', function () {
    var levelManager;
    var gameContainer;
    beforeEach(function () {
        levelManager = new LevelManager();
        gameContainer = mockGameContainer.create();
    });

    it('should implement Subsystem interface', function () {
        interface.assert.subsystems(levelManager);
    });

    it('should subscribe to events', function () {
        levelManager.initialize(gameContainer);
        var subscribeSpy = gameContainer.events.subscribe;
        verify(subscribeSpy).wasCalledTwice();
        assert.equal('engine-start', subscribeSpy.firstCall.args[0]);
        assert.equal('entity-destroyed', subscribeSpy.secondCall.args[0]);
    });

    describe('reacting to "engine-start" event', function () {
        var engineStartSubscriber;

        beforeEach(function () {
            levelManager.initialize(gameContainer);
            engineStartSubscriber = gameContainer.events.subscribe.firstCall.args[1];
        });

        it('should emit events to start new game', function () {
            var emitSpy = gameContainer.events.emit;
            var startEvent = new GameEvent('engine-start', null);
            verify(emitSpy).wasNotCalled();

            engineStartSubscriber(startEvent);
            verify(emitSpy).wasCalledTwice();
            var newGameEvent = emitSpy.firstCall.args[0];
            assert.equal('new-game', newGameEvent.type);
            assert.equal(null, newGameEvent.data);

            var newLevelEvent = emitSpy.secondCall.args[0];
            assert.equal('new-level', newLevelEvent.type);
            assert.deepEqual({levelNumber: 1}, newLevelEvent.data);
        });
    });

    describe('reacting to "entity-destroyed" events', function () {
        var entityDestroyedSubscriber;
        beforeEach(function () {
            levelManager.initialize(gameContainer);
            entityDestroyedSubscriber = gameContainer.events.subscribe.secondCall.args[1];
        });

        it('should emit "new-level" event when entities are zero', function () {
            var entityEvent = new GameEvent("entity-destroyed", {alive: 0, playerIsAlive: true});
            var emitSpy = gameContainer.events.emit;
            verify(emitSpy).wasNotCalled();

            entityDestroyedSubscriber(entityEvent);
            verify(emitSpy).wasCalledOnce();
            var newLevelEvent = emitSpy.firstCall.args[0];
            assert.equal('new-level', newLevelEvent.type);
            assert.deepEqual({levelNumber: 1}, newLevelEvent.data);

            entityDestroyedSubscriber(entityEvent);
            assert.deepEqual({levelNumber: 2}, emitSpy.secondCall.args[0].data);

            entityDestroyedSubscriber(entityEvent);
            assert.deepEqual({levelNumber: 3}, emitSpy.thirdCall.args[0].data);

        });
    });
});