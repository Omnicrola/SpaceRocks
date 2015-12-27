/**
 * Created by Eric on 12/26/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var interface = require('../TestInterfaces');
var containerGenerator = require('../mocks/GameContainer');

var UserInterface = require('../../src/subsystems/UserInterface');
var GameEvent = require('../../src/engine/GameEvent');
var Renderer = require('../../src/engine/Renderer');

describe('UserInterface', function () {
    var userInterface;
    var mockRenderer;
    var mockGameContainer;
    beforeEach(function () {
        userInterface = new UserInterface();
        mockRenderer = spies.createStubInstance(Renderer, 'Renderer');
        mockGameContainer = containerGenerator.create();
    });

    it('should implement the correct interface', function () {
        interface.assert.subsystems(userInterface);
    });

    it('should subscribe to events', function () {
        userInterface.initialize(mockGameContainer);
        assert.equal('score-change', mockGameContainer.events.subscribe.getCall(0).args[0]);
        assert.equal('player-life-change', mockGameContainer.events.subscribe.getCall(1).args[0]);
    });

    describe('reacting to events', function () {
        var scoreChangeSubscriber;
        var playerLifeChangeSubscriber;
        beforeEach(function () {
            userInterface.initialize(mockGameContainer);
            scoreChangeSubscriber = mockGameContainer.events.subscribe.getCall(0).args[1];
            playerLifeChangeSubscriber = mockGameContainer.events.subscribe.getCall(1).args[1];
        });

        it('should draw last score emitted', function () {
            userInterface.render(mockRenderer);
            verify(mockRenderer.setFont).wasCalledWith('14px atari');
            verify(mockRenderer.drawText).wasCalledWith(10, 20, 'SCORE: 0');

            var expectedScore = Math.random();
            scoreChangeSubscriber.call({}, new GameEvent('score-change', {score: expectedScore}));
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(10, 20, 'SCORE: ' + expectedScore);
        });

        it('should draw last player life count emitted', function () {
            userInterface.render(mockRenderer);
            verify(mockRenderer.setFont).wasCalledWith('14px atari');
            verify(mockRenderer.drawText).wasCalledWith(500, 20, 'LIVES: 0');

            var expectedLives = Math.random()*10;
            playerLifeChangeSubscriber.call({}, new GameEvent('player-life-change', {lives: expectedLives}));
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(500, 20, 'LIVES: ' + expectedLives);
        });

    });


});