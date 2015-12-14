/**
 * Created by Eric on 12/12/2015.
 */
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var interface = require('../TestInterfaces');
var mockGameContainer = require('../mocks/GameContainer');

var LevelManager = require('../../src/subsystems/LevelManager');
var EntitySubsystem = require('../../src/subsystems/entities/EntitySubsystem');
var GameEvent = require('../../src/engine/GameEvent');

describe('LevelManager', function () {
    var levelManager;
    var gameContainer;
    var mockEntitySubsystem;
    beforeEach(function () {
        mockEntitySubsystem = spies.createStubInstance(EntitySubsystem);
        levelManager = new LevelManager(mockEntitySubsystem);
        gameContainer = mockGameContainer.create();
    });

    it('should implement Subsystem interface', function () {
        interface.assert.subsystems(levelManager);
    });

    it('should subscribe to events', function () {
        levelManager.initialize(gameContainer);
        var subscribeSpy = gameContainer.events.subscribe;
        verify(subscribeSpy).wasCalledExactly(3);
        assert.equal('engine-start', subscribeSpy.firstCall.args[0]);
        assert.equal('entity-destroyed', subscribeSpy.secondCall.args[0]);
        assert.equal('new-level', subscribeSpy.thirdCall.args[0]);
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

    describe('reacting to "new-level" event', function () {
        var newLevelSubscriber;
        var newLevelEvent = new Event('new-level', null);
        beforeEach(function () {
            levelManager.initialize(gameContainer);
            newLevelSubscriber = gameContainer.events.subscribe.thirdCall.args[1];
        });

        it('should spawn asteroids', function () {
            verify(mockEntitySubsystem.addEntity).wasNotCalled();

            newLevelSubscriber(newLevelEvent);

            var addEntitySpy = mockEntitySubsystem.addEntity;
            verify(addEntitySpy).wasCalledExactly(5);
            checkAsteroid(addEntitySpy.getCall(0));
            checkAsteroid(addEntitySpy.getCall(1));
            checkAsteroid(addEntitySpy.getCall(2));
            checkAsteroid(addEntitySpy.getCall(3));
            checkAsteroid(addEntitySpy.getCall(4));
        });

        function checkAsteroid(call) {
            var entity = call.args[0];
            var shape = entity._shape;

            assert.closeTo(entity.position.x, 320, 320);
            assert.closeTo(entity.position.y, 240, 240);
            assert.closeTo(entity.velocity.x, 0, 0.5);
            assert.closeTo(entity.velocity.y, 0, 0.5);

            assert.equal(6, shape._points.length);
            checkPoint(-20, 60, shape._points[0]);
            checkPoint(50, 20, shape._points[1]);
            checkPoint(40, -30, shape._points[2]);
            checkPoint(-10, -40, shape._points[3]);
            checkPoint(-50, -10, shape._points[4]);
            checkPoint(-40, 50, shape._points[5]);
        }

        function checkPoint(expectedX, expectedY, actualPoint) {
            assert.equal(expectedX, actualPoint.x);
            assert.equal(expectedY, actualPoint.y);
        }
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