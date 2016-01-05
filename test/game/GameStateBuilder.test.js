/**
 * Created by omnic on 1/3/2016.
 */
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var Types = require('../ExpectedTypes');
var interfaces = require('../TestInterfaces');
var MockGameContainer = require('../mocks/GameContainer');


var GameEvent = require('../../src/engine/GameEvent');
var CollisionManager = require('../../src/subsystems/entities/CollisionManager');
var GameInput = require('../../src/engine/GameInput');
var EntityFactory = require('../../src/subsystems/entities/EntityFactory');
var EntitySubsystem = require('../../src/subsystems/entities/EntitySubsystem');
var GameStateBuilder = require('../../src/game/GameStateBuilder');
var StateManager = require('../../src/subsystems/state/StateManager');

describe('GameStateBuilder', function () {
    var stubStateManager;
    var mockGameContainer;
    beforeEach(function () {
        stubStateManager = spies.createStub(new StateManager());
        mockGameContainer = MockGameContainer.create();
    });

    describe('Loading game state', function () {
        var loadingState;
        beforeEach(function () {
            loadingState = GameStateBuilder.buildLoadingState(stubStateManager);
        });

        it('should implement the State interface', function () {
            interfaces.assert.state(loadingState);
            verify.readOnlyProperty(loadingState, 'name', Types.state.LOADING);
        });

        it('should unsubscribe all subscribers', function () {
            checkSubscribersAreRemoved(loadingState);
        });

        it('should switch to start screen after engine is loaded', function () {
            loadingState.load(mockGameContainer);
            verify(stubStateManager.changeState).wasNotCalled();

            mockGameContainer.$emitMockEvent(Types.events.ENGINE_START, null);
            verify(stubStateManager.changeState).wasCalledOnce();
            verify(stubStateManager.changeState).wasCalledWith(Types.state.START);

        });

    });

    describe('Start game state', function () {
        var startScreenState;
        beforeEach(function () {
            startScreenState = GameStateBuilder.buildStartScreen(stubStateManager);
        });

        it('should implement State interface', function () {
            interfaces.assert.state(startScreenState);
            verify.readOnlyProperty(startScreenState, 'name', Types.state.START);
        });

        it('should not have any subscribers', function () {
            startScreenState.load(mockGameContainer);
            verify(mockGameContainer.events.subscribe).wasNotCalled();
        });

        it('should change state when spacebar is pressed', function () {
            mockGameContainer.input
                .isPressed
                .withArgs(GameInput.SPACEBAR)
                .returns(true);

            startScreenState.update(mockGameContainer);
            verify(mockGameContainer.events.emit).wasCalledTwice();
            verify.event(new GameEvent(Types.events.SCORE_CHANGE, {score: 0}), mockGameContainer.events.emit.firstCall.args[0]);
            verify.event(new GameEvent(Types.events.PLAYER_LIFE_CHANGE, {lives: 3}), mockGameContainer.events.emit.secondCall.args[0]);
            verify(stubStateManager.changeState).wasCalledWith(Types.state.PLAY);
        });

        it('should not change if spacebar is not pressed', function () {
            mockGameContainer.input
                .isPressed
                .withArgs(GameInput.SPACEBAR)
                .returns(false);

            startScreenState.update(mockGameContainer);
            verify(stubStateManager.changeState).wasNotCalled();

        });

    });

    describe('Play game state', function () {
        var playState;
        var stubEntityFactory;
        var stubEntitySubsystem;
        beforeEach(function () {
            stubEntityFactory = spies.createStubCopy(EntityFactory);
            stubEntitySubsystem = spies.createStub(new EntitySubsystem());
            playState = GameStateBuilder.buildPlayState(stubStateManager, stubEntityFactory, stubEntitySubsystem);
        });

        it('should implement the State interface', function () {
            interfaces.assert.state(playState);
            verify.readOnlyProperty(playState, 'name', Types.state.PLAY);
        });

        it('should unsubscribe all subscribers', function () {
            checkSubscribersAreRemoved(playState);
        });

        describe('tracking score', function () {
            it('should add to score when an asteroid is destroyed', function () {
                playState.load(mockGameContainer);
                destroyEntity(Types.entities.ASTEROID_LARGE);
                destroyEntity(Types.entities.ASTEROID_MEDIUM);
                destroyEntity(Types.entities.ASTEROID_SMALL);
                destroyEntity(Types.entities.ASTEROID_MEDIUM);

                verify(mockGameContainer.events.emit).wasCalledExactly(4);
                checkScoreEvent(0, 25);
                checkScoreEvent(1, 60);
                checkScoreEvent(2, 110);
                checkScoreEvent(3, 145);
            });

            function checkScoreEvent(callIndex, expectedScore) {
                var call = mockGameContainer.events.emit.getCall(callIndex);
                if (!call) {
                    throw new Error('Score event was not emitted');
                }
                var actualEvent = call.args[0];
                assert.equal(Types.events.SCORE_CHANGE, actualEvent.type);
                verify.config({score: expectedScore}, actualEvent.data);
            }
        });

        describe('player lives', function () {
            it('decrements when player dies', function () {
                playState.load(mockGameContainer);

                destroyEntity(Types.entities.PLAYER);
                destroyEntity(Types.entities.PLAYER);
                destroyEntity(Types.entities.PLAYER);

                verify(mockGameContainer.events.emit).wasCalledExactly(3);
                checkPlayerLifeEvent(0, 2);
                checkPlayerLifeEvent(1, 1);
                checkPlayerLifeEvent(2, 0);
            });

            function checkPlayerLifeEvent(callIndex, expectedLives) {
                var call = mockGameContainer.events.emit.getCall(callIndex);
                if (!call) {
                    throw new Error('Score event was not emitted');
                }
                var actualEvent = call.args[0];
                assert.equal(Types.events.PLAYER_LIFE_CHANGE, actualEvent.type);
                verify.config({lives: expectedLives}, actualEvent.data);
            }
        });

        describe('asteroids triggering a new level', function () {

            it('should start new level when asteroids reach zero - case 1', function () {
                var expectedEvent = new GameEvent(Types.events.NEW_LEVEL, {levelNumber: 1});

                playState.load(mockGameContainer);
                addEntity(Types.entities.ASTEROID_LARGE);
                removeEntity(Types.entities.ASTEROID_LARGE);

                verify(mockGameContainer.events.emit).wasNotCalled();
                playState.update(mockGameContainer);
                verify(mockGameContainer.events.emit).wasCalledOnce();
                verify.event(expectedEvent, mockGameContainer.events.emit.firstCall.args[0]);
            });

            it('should start new level when asteroids reach zero - case 2', function () {
                var expectedEvent = new GameEvent(Types.events.NEW_LEVEL, {levelNumber: 1});

                playState.load(mockGameContainer);
                addEntity(Types.entities.ASTEROID_LARGE);
                addEntity(Types.entities.ASTEROID_MEDIUM);
                addEntity(Types.entities.ASTEROID_SMALL);

                removeEntity(Types.entities.ASTEROID_SMALL);

                playState.update(mockGameContainer);
                verify(mockGameContainer.events.emit).wasNotCalled();
                removeEntity(Types.entities.ASTEROID_MEDIUM);
                removeEntity(Types.entities.ASTEROID_LARGE);

                playState.update(mockGameContainer);
                verify(mockGameContainer.events.emit).wasCalledOnce();
                verify.event(expectedEvent, mockGameContainer.events.emit.firstCall.args[0]);
            });

            it('should start new level when asteroids reach zero - case 3', function () {
                var expectedEvent = new GameEvent(Types.events.NEW_LEVEL, {levelNumber: 1});

                playState.load(mockGameContainer);
                addEntity(Types.entities.FX);
                addEntity(Types.entities.FX);
                addEntity(Types.entities.ASTEROID_LARGE);
                removeEntity(Types.entities.FX);

                playState.update(mockGameContainer);
                verify(mockGameContainer.events.emit).wasNotCalled();

                removeEntity(Types.entities.ASTEROID_LARGE);
                playState.update(mockGameContainer);

                verify(mockGameContainer.events.emit).wasCalledOnce();
                verify.event(expectedEvent, mockGameContainer.events.emit.firstCall.args[0]);
            });

            it('should not start a new level until new asteroids are added', function () {
                var expectedEvent = new GameEvent(Types.events.NEW_LEVEL, {levelNumber: 2});
                playState.load(mockGameContainer);
                addEntity(Types.entities.ASTEROID_LARGE);
                removeEntity(Types.entities.ASTEROID_LARGE);
                addEntity(Types.entities.FX);

                playState.update(mockGameContainer);
                playState.update(mockGameContainer);
                verify(mockGameContainer.events.emit).wasCalledOnce();

                addEntity(Types.entities.ASTEROID_LARGE);
                removeEntity(Types.entities.ASTEROID_LARGE);
                playState.update(mockGameContainer);
                verify(mockGameContainer.events.emit).wasCalledTwice();
                verify.event(expectedEvent, mockGameContainer.events.emit.secondCall.args[0]);
            });
        });

        describe('creating a new level', function () {
            it('should add five large asteroids', function () {
                var stubAsteroid1 = spies.create('asteroid');
                var stubAsteroid2 = spies.create('asteroid');
                var stubAsteroid3 = spies.create('asteroid');
                var stubAsteroid4 = spies.create('asteroid');
                var stubAsteroid5 = spies.create('asteroid');
                stubEntityFactory.buildLargeAsteroid.onCall(0).returns(stubAsteroid1);
                stubEntityFactory.buildLargeAsteroid.onCall(1).returns(stubAsteroid2);
                stubEntityFactory.buildLargeAsteroid.onCall(2).returns(stubAsteroid3);
                stubEntityFactory.buildLargeAsteroid.onCall(3).returns(stubAsteroid4);
                stubEntityFactory.buildLargeAsteroid.onCall(4).returns(stubAsteroid5);

                playState.load(mockGameContainer);
                verify(stubEntitySubsystem.addEntity).wasNotCalled();
                mockGameContainer.$emitMockEvent(Types.events.NEW_LEVEL, {levelNumber: 99});
                verify(stubEntitySubsystem.addEntity).wasCalledExactly(5);
                verify(stubEntitySubsystem.addEntity).wasCalledWith(stubAsteroid1, CollisionManager.ASTEROID);
                verify(stubEntitySubsystem.addEntity).wasCalledWith(stubAsteroid2, CollisionManager.ASTEROID);
                verify(stubEntitySubsystem.addEntity).wasCalledWith(stubAsteroid3, CollisionManager.ASTEROID);
                verify(stubEntitySubsystem.addEntity).wasCalledWith(stubAsteroid4, CollisionManager.ASTEROID);
                verify(stubEntitySubsystem.addEntity).wasCalledWith(stubAsteroid5, CollisionManager.ASTEROID);

                verify(stubEntityFactory.buildLargeAsteroid).wasCalledWith(mockGameContainer.display);


            });
        });

        function addEntity(type) {
            mockGameContainer.$emitMockEvent(Types.events.ENTITY_ADDED, {type: type});
        }

        function removeEntity(type) {
            mockGameContainer.$emitMockEvent(Types.events.ENTITY_REMOVED, {type: type});
        }

        function destroyEntity(type) {
            mockGameContainer.$emitMockEvent(Types.events.ENTITY_DEATH, {type: type});
        }
    });

    function checkSubscribersAreRemoved(gameState) {
        gameState.load(mockGameContainer);
        gameState.unload(mockGameContainer);
        verify(mockGameContainer.events.subscribe).wasCalled();
        var subscriberCount = mockGameContainer.events.subscribe.callCount;
        verify(mockGameContainer.events.unsubscribe).wasCalled(subscriberCount);
    }
});