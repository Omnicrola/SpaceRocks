/**
 * Created by Eric on 12/26/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var interface = require('../TestInterfaces');
var containerGenerator = require('../mocks/GameContainer');

var UserInterface = require('../../src/subsystems/UserInterface');
var Renderer = require('../../src/engine/Renderer');

describe('UserInterface', function () {
    var userInterface;
    var mockRenderer;
    var mockGameContainer;
    beforeEach(function () {
        userInterface = new UserInterface();
        mockRenderer = spies.createStubInstance(Renderer);
        mockGameContainer = containerGenerator.create();
    });

    it('should implement the correct interface', function () {
        interface.assert.subsystems(userInterface);
    });

    it('should subscribe to events', function(){
        userInterface.update(mockGameContainer);
        assert.equal('new-game', mockGameContainer.events.subscribe.getCall(0).args[0]);
        assert.equal('new-level', mockGameContainer.events.subscribe.getCall(1).args[0]);
        assert.equal('entity-death', mockGameContainer.events.subscribe.getCall(2).args[0]);
    });

    describe('reacting to new-game event', function(){
        var newGameSubscriber;
        beforeEach(function(){
            userInterface.update(mockGameContainer);
            newGameSubscriber = mockGameContainer.events.subscribe.getCall(0).args[1]
        });

        it('should reset score and lives', function(){

        });
    });

    it('should draw text labels', function () {
        userInterface.render(mockRenderer);

        verify(mockRenderer.drawText).wasCalledWith(10, 10, 'SCORE:0');
        verify(mockRenderer.drawText).wasCalledWith(500, 10, 'LIVES:3');
    });
});