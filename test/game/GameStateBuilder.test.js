/**
 * Created by omnic on 1/3/2016.
 */
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var Types = require('../ExpectedTypes');
var interfaces = require('../TestInterfaces');
var MockGameContainer = require('../mocks/GameContainer');


var GameInput = require('../../src/engine/GameInput');
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

    describe('Start game state', function(){
        var startScreenState;
        beforeEach(function () {
            startScreenState = GameStateBuilder.buildStartScreen(stubStateManager);
        });

        it('should implement State interface', function() {
            interfaces.assert.state(startScreenState);
            verify.readOnlyProperty(startScreenState, 'name', Types.state.START);
        });

        it('should not have any subscribers', function () {
            startScreenState.load(mockGameContainer);
            verify(mockGameContainer.events.subscribe).wasNotCalled();
        });

        it('should change state when spacebar is pressed', function() {
            mockGameContainer.input
                .isPressed
                .withArgs(GameInput.SPACEBAR)
                .returns(true);

            startScreenState.update(mockGameContainer);
            verify(stubStateManager.changeState).wasCalledWith(Types.state.PLAY);
        });

        it('should not change if spacebar is not pressed', function() {
            mockGameContainer.input
                .isPressed
                .withArgs(GameInput.SPACEBAR)
                .returns(false);

            startScreenState.update(mockGameContainer);
            verify(stubStateManager.changeState).wasNotCalled();

        });

    });

    function checkSubscribersAreRemoved(gameState){
        gameState.load(mockGameContainer);
        gameState.unload(mockGameContainer);
        verify(mockGameContainer.events.subscribe).wasCalled();
        var subscriberCount = mockGameContainer.events.subscribe.callCount;
        verify(mockGameContainer.events.unsubscribe).wasCalled(subscriberCount);
    }
});