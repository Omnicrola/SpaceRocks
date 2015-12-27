/**
 * Created by Eric on 12/12/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var interface = require('../TestInterfaces');
var mockGameContainer = require('../mocks/GameContainer');

var LevelManager = require('../../src/subsystems/LevelManager');
var CollisionManager = require('../../src/subsystems/entities/CollisionManager');
var EntitySubsystem = require('../../src/subsystems/entities/EntitySubsystem');
var Entity = require('../../src/subsystems/entities/Entity');
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
        assert.equal('entity-death', subscribeSpy.secondCall.args[0]);
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
            verify(emitSpy).wasCalledExactly(4);
            var newGameEvent = emitSpy.getCall(0).args[0];
            assert.equal('new-game', newGameEvent.type);
            assert.equal(null, newGameEvent.data);

            var newLevelEvent = emitSpy.getCall(1).args[0];
            assert.equal('new-level', newLevelEvent.type);
            verify.config({levelNumber: 1}, newLevelEvent.data);

            var scoreChangeEvent = emitSpy.getCall(2).args[0];
            assert.equal('score-change', scoreChangeEvent.type);
            verify.config({score: 0}, scoreChangeEvent.data);

            var playerLifeChange = emitSpy.getCall(3).args[0];
            assert.equal('player-life-change', playerLifeChange.type);
            verify.config({lives: 3}, playerLifeChange.data);

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
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid1, CollisionManager.ASTEROID);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid2, CollisionManager.ASTEROID);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid3, CollisionManager.ASTEROID);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid4, CollisionManager.ASTEROID);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid5, CollisionManager.ASTEROID);

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

    describe('reacting to "entity-death" events', function () {
        var entityDestroyedSubscriber;
        var newLevelSubscriber;
        beforeEach(function () {
            levelManager.initialize(gameContainer);
            entityDestroyedSubscriber = gameContainer.events.subscribe.secondCall.args[1];
            newLevelSubscriber = gameContainer.events.subscribe.thirdCall.args[1];
            newLevelSubscriber.call({}, new GameEvent('new-level', {levelNumber: 1}));
        });

        it('should emit "new-level" event when 5 asteroids are destroyed', function () {
            var entityEvent = new GameEvent("entity-death", {type: Entity.Type.ASTEROID});
            var emitSpy = gameContainer.events.emit;

            entityDestroyedSubscriber.call({}, entityEvent);
            entityDestroyedSubscriber.call({}, entityEvent);
            entityDestroyedSubscriber.call({}, entityEvent);
            entityDestroyedSubscriber.call({}, entityEvent);
            verify(emitSpy).wasNotCalled();
            entityDestroyedSubscriber.call({}, entityEvent);

            verify(emitSpy).wasCalledOnce();
            var newLevelEvent = emitSpy.firstCall.args[0];
            expect(newLevelEvent.type).to.equal('new-level');
            verify.config({levelNumber: 1}, newLevelEvent.data);

            entityDestroyedSubscriber(entityEvent);
            entityDestroyedSubscriber(entityEvent);
            verify(emitSpy).wasCalledOnce();
        });

    });
});