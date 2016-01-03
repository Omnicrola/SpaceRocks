/**
 * Created by omnic on 1/3/2016.
 */
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var Types = require('../ExpectedTypes');
var interfaces = require('../TestInterfaces');
var MockGameContainer = require('../mocks/GameContainer');


var GameStateBuilder = require('../../src/game/GameStateBuilder');
var StateManager = require('../../src/subsystems/state/StateManager');

describe('GameStateBuilder', function () {
    var stubStateManager;
    var mockGameContainer;
    beforeEach(function () {
        stubStateManager = spies.createStub(new StateManager());
        mockGameContainer = MockGameContainer.create();
    });

    describe('Startup game state', function () {
        var startupState;
        beforeEach(function () {
            startupState = GameStateBuilder.buildStartupState(stubStateManager);
        });

        it('should implement the State interface', function () {
            interfaces.assert.state(startupState);
        });

        it('should unsubscribe all subscribers', function () {
            startupState.load(mockGameContainer);
            startupState.unload(mockGameContainer);
            verify(mockGameContainer.events.subscribe).wasCalled();
            var subscriberCount = mockGameContainer.events.subscribe.callCount;
            verify(mockGameContainer.events.unsubscribe).wasCalled(subscriberCount);
        });

        it('should switch to start screen after engine is loaded', function () {
            startupState.load(mockGameContainer);
            verify(stubStateManager.changeState).wasNotCalled();

            mockGameContainer.$emitMockEvent(Types.events.ENGINE_START, null);
            verify(stubStateManager.changeState).wasCalledOnce();
            verify(stubStateManager.changeState).wasCalledWith(Types.state.START);

        });

    });
});