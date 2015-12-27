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
        verify(subscribeSpy).wasCalledExactly(4);
        assert.equal('engine-start', subscribeSpy.getCall(0).args[0]);
        assert.equal('new-game', subscribeSpy.getCall(1).args[0]);
        assert.equal('new-level', subscribeSpy.getCall(2).args[0]);
        assert.equal('entity-death', subscribeSpy.getCall(3).args[0]);
    });

    describe('reacting to events', function () {
        var engineStartSubscriber;
        var newGameSubscriber;
        var newLevelSubscriber;
        var entityDeathSubscriber;
        beforeEach(function () {
            var subscribeSpy = gameContainer.events.subscribe;
            levelManager.initialize(gameContainer);
            engineStartSubscriber = subscribeSpy.getCall(0).args[1];
            newGameSubscriber = subscribeSpy.getCall(1).args[1];
            newLevelSubscriber = subscribeSpy.getCall(2).args[1];
            entityDeathSubscriber = subscribeSpy.getCall(3).args[1];
        });

        it('should emit events to start new game', function () {
            var emitSpy = gameContainer.events.emit;
            var startEvent = new GameEvent('engine-start', null);
            verify(emitSpy).wasNotCalled();

            engineStartSubscriber(startEvent);
            verify(emitSpy).wasCalledExactly(1);
            var newGameEvent = emitSpy.getCall(0).args[0];
            assert.equal('new-game', newGameEvent.type);
            assert.equal(null, newGameEvent.data);

        });

        it('should reset score and life when new game starts', function () {
            var emitSpy = gameContainer.events.emit;
            newGameSubscriber.call({}, new GameEvent('new-game', null));

            verify(emitSpy).wasCalledExactly(3);

            var newLevelEvent = emitSpy.getCall(0).args[0];
            assert.equal('new-level', newLevelEvent.type);
            verify.config({levelNumber: 1}, newLevelEvent.data);

            var scoreChangeEvent = emitSpy.getCall(1).args[0];
            assert.equal('score-change', scoreChangeEvent.type);
            verify.config({score: 0}, scoreChangeEvent.data);

            var playerLifeChange = emitSpy.getCall(2).args[0];
            assert.equal('player-life-change', playerLifeChange.type);
            verify.config({lives: 3}, playerLifeChange.data);
        });

        it('should emit events when asteroids are destroyed', function () {
            var entityEvent = new GameEvent("entity-death", {type: Entity.Type.ASTEROID});
            var emitSpy = gameContainer.events.emit;
            newGameSubscriber.call({}, new GameEvent('new-game', null));
            newLevelSubscriber.call({}, new GameEvent('new-level', null));
            emitSpy.reset();
            assert.equal(0, emitSpy.callCount);

            entityDeathSubscriber.call({}, entityEvent);
            checkScoreEvent(100, emitSpy.getCall(0).args[0]);
            entityDeathSubscriber.call({}, entityEvent);
            checkScoreEvent(200, emitSpy.getCall(1).args[0]);
            entityDeathSubscriber.call({}, entityEvent);
            checkScoreEvent(300, emitSpy.getCall(2).args[0]);
            entityDeathSubscriber.call({}, entityEvent);
            checkScoreEvent(400, emitSpy.getCall(3).args[0]);
            entityDeathSubscriber.call({}, entityEvent);
            checkScoreEvent(500, emitSpy.getCall(4).args[0]);

            verify(emitSpy).wasCalledExactly(6);
            checkNewLevelEvent(2, emitSpy.getCall(5).args[0]);

        });

        function checkScoreEvent(expectedScore, event) {
            assert.equal('score-change', event.type);
            assert.equal(expectedScore, event.data.score);
        }

        function checkNewLevelEvent(expectedLevel, event) {
            assert.equal('new-level', event.type);
            assert.equal(expectedLevel, event.data.levelNumber);
        }
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

            var buildSpy = mockEntityFactory.buildAsteroid;

            buildSpy.onCall(0).returns(expectedAsteroid1);
            buildSpy.onCall(1).returns(expectedAsteroid2);
            buildSpy.onCall(2).returns(expectedAsteroid3);
            buildSpy.onCall(3).returns(expectedAsteroid4);
            buildSpy.onCall(4).returns(expectedAsteroid5);


            newLevelSubscriber(newLevelEvent);

            verify(mockEntitySubsystem.addEntity).wasCalledExactly(5);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid1, CollisionManager.ASTEROID);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid2, CollisionManager.ASTEROID);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid3, CollisionManager.ASTEROID);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid4, CollisionManager.ASTEROID);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedAsteroid5, CollisionManager.ASTEROID);

            verify(buildSpy).wasCalledExactly(5);
            var expectedConfig = {
                width: expectedWidth,
                height: expectedHeight
            };
            verify.config(expectedConfig, buildSpy.getCall(0).args[0]);
            verify.config(expectedConfig, buildSpy.getCall(1).args[0]);
            verify.config(expectedConfig, buildSpy.getCall(2).args[0]);
            verify.config(expectedConfig, buildSpy.getCall(3).args[0]);
            verify.config(expectedConfig, buildSpy.getCall(4).args[0]);

        });

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


    });
});