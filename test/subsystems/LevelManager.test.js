/**
 * Created by Eric on 12/12/2015.
 */
var proxy = require('proxyquireify')(require);
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
    var mockEntityFactory;
    beforeEach(function () {
        mockEntitySubsystem = spies.createStubInstance(EntitySubsystem);
        mockEntityFactory = {
            buildAsteroid: spies.create('buildAsteroid')
        };
        LevelManager = proxy('../../src/subsystems/LevelManager', {
            './entities/EntityFactory': mockEntityFactory
        });
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
        var expectedWidth;
        var expectedHeight;
        beforeEach(function () {
            expectedWidth = Math.random() * 100;
            expectedHeight = Math.random() * 100;
            gameContainer.display = {
                width: expectedWidth,
                height: expectedHeight
            }
            levelManager.initialize(gameContainer);
            newLevelSubscriber = gameContainer.events.subscribe.thirdCall.args[1];
        });

        it('should spawn asteroids', function () {
            verify(mockEntitySubsystem.addEntity).wasNotCalled();
            var expectedAsteroid1 = {foo: Math.random()};
            var expectedAsteroid2 = {foo: Math.random()};
            var expectedAsteroid3 = {foo: Math.random()};
            var expectedAsteroid4 = {foo: Math.random()};
            var expectedAsteroid5 = {foo: Math.random()};
            mockEntityFactory.buildAsteroid.onCall(0).returns(expectedAsteroid1);
            mockEntityFactory.buildAsteroid.onCall(1).returns(expectedAsteroid2);
            mockEntityFactory.buildAsteroid.onCall(2).returns(expectedAsteroid3);
            mockEntityFactory.buildAsteroid.onCall(3).returns(expectedAsteroid4);
            mockEntityFactory.buildAsteroid.onCall(4).returns(expectedAsteroid5);


            newLevelSubscriber(newLevelEvent);

            verify(mockEntitySubsystem.addEntity).wasCalledExactly(5);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid1);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid2);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid3);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid4);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid5);

            verify(mockEntityFactory.buildAsteroid).wasCalledExactly(5);
            checkFactoryConfig(mockEntityFactory.buildAsteroid.getCall(0));
            checkFactoryConfig(mockEntityFactory.buildAsteroid.getCall(1));
            checkFactoryConfig(mockEntityFactory.buildAsteroid.getCall(2));
            checkFactoryConfig(mockEntityFactory.buildAsteroid.getCall(3));
            checkFactoryConfig(mockEntityFactory.buildAsteroid.getCall(4));
        });

        function checkFactoryConfig(actualCall) {
            var actualConfig = actualCall.args[0];
            expect(actualConfig).to.be.ok;
            expect(actualConfig.width).to.equal(expectedWidth);
            expect(actualConfig.height).to.equal(expectedHeight);
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