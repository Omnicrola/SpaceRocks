/**
 * Created by Eric on 12/12/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var interface = require('../../TestInterfaces');
var MockGameContainer = require('../../mocks/GameContainer');
var MockState = require('../../mocks/State');
var Types = require('../../ExpectedTypes');

var StateManager = require('../../../src/subsystems/state/StateManager');
var CollisionManager = require('../../../src/subsystems/entities/CollisionManager');
var EntitySubsystem = require('../../../src/subsystems/entities/EntitySubsystem');
var Entity = require('../../../src/subsystems/entities/Entity');
var GameEvent = require('../../../src/engine/GameEvent');

describe('StateManager', function () {
    var stateManager;
    var mockGameContainer;
    var mockState1;
    var mockState2;
    beforeEach(function () {
        stateManager = new StateManager();
        mockGameContainer = MockGameContainer.create();
        mockState1 = MockState.create('state1');
        mockState2 = MockState.create('state2');
        stateManager.addState(mockState1);
        stateManager.addState(mockState2);
    });

    it('should implement subsystem interface', function () {
        interface.assert.subsystems(stateManager);
    });

    it('should load the first state by default', function () {
        stateManager.initialize(mockGameContainer);

        verify(mockState1.load).wasCalledWith(mockGameContainer);
        verify(mockState2.load).wasNotCalled();
    });

    it('should update only one state at a time', function () {
        stateManager.initialize(mockGameContainer);
        stateManager.update(mockGameContainer);

        verify(mockState1.update).wasCalledWith(mockGameContainer);
        verify(mockState2.update).wasNotCalled();
    });

    it('should switch states when requested', function () {
        stateManager.initialize(mockGameContainer);
        stateManager.changeState('state2');
        verify(mockState1.unload).wasCalledWith(mockGameContainer);
        verify(mockState2.load).wasCalledWith(mockGameContainer);

        stateManager.update(mockGameContainer);
        verify(mockState1.update).wasNotCalled();
        verify(mockState2.update).wasCalledWith(mockGameContainer);
    });

    it('should emit event when state changes', function () {
        var expectedState = 'state2';
        stateManager.initialize(mockGameContainer);

        verify(mockGameContainer.events.emit).wasNotCalled();
        stateManager.changeState(expectedState);
        verify(mockGameContainer.events.emit).wasCalledOnce();
        var actualEvent = mockGameContainer.events.emit.firstCall.args[0];
        verify.event(new GameEvent(Types.events.STATE_CHANGE, {state: expectedState}), actualEvent);

    });

    it('should throw an error when an invalid state is requested', function () {
        stateManager.initialize(mockGameContainer);
        var badState = 'i dont exist';
        verify.method(stateManager, 'changeState', badState).throwsMessage('Invalid game state "' + badState + '" was requested.');

    });

});