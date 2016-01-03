/**
 * Created by Eric on 12/26/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var interface = require('../TestInterfaces');
var Types = require('../ExpectedTypes');
var containerGenerator = require('../mocks/GameContainer');

var UserInterface = require('../../src/subsystems/UserInterface');
var GameEvent = require('../../src/engine/GameEvent');
var Renderer = require('../../src/engine/Renderer');

describe('UserInterface', function () {

    var userInterface;
    var mockRenderer;
    var mockGameContainer;
    var EXPECTED_FONT = '12px atari';

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
        assert.equal(Types.events.SCORE_CHANGE, mockGameContainer.events.subscribe.getCall(0).args[0]);
        assert.equal(Types.events.PLAYER_LIFE_CHANGE, mockGameContainer.events.subscribe.getCall(1).args[0]);
        assert.equal(Types.events.GAME_RESET, mockGameContainer.events.subscribe.getCall(2).args[0]);
        assert.equal(Types.events.NEW_LEVEL, mockGameContainer.events.subscribe.getCall(3).args[0]);
    });

    describe('reacting to events', function () {
        var scoreChangeSubscriber;
        var playerLifeChangeSubscriber;
        var gameResetSubscriber;
        var newLevelSubscriber;
        beforeEach(function () {
            userInterface.initialize(mockGameContainer);
            scoreChangeSubscriber = mockGameContainer.events.subscribe.getCall(0).args[1];
            playerLifeChangeSubscriber = mockGameContainer.events.subscribe.getCall(1).args[1];
            gameResetSubscriber = mockGameContainer.events.subscribe.getCall(2).args[1];
            newLevelSubscriber = mockGameContainer.events.subscribe.getCall(3).args[1];
        });

        it('should draw last score emitted', function () {
            userInterface.render(mockRenderer);
            verify(mockRenderer.setFont).wasCalledWith(EXPECTED_FONT);
            verify(mockRenderer.drawText).wasCalledWith(10, 20, 'SCORE: 0');

            var expectedScore = Math.random();
            scoreChangeSubscriber.call({}, new GameEvent(Types.events.SCORE_CHANGE, {score: expectedScore}));
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(10, 20, 'SCORE: ' + expectedScore);
        });

        it('should draw last player life count emitted', function () {
            userInterface.render(mockRenderer);
            verify(mockRenderer.setFont).wasCalledWith(EXPECTED_FONT);
            verify(mockRenderer.drawText).wasCalledWith(500, 20, 'LIVES: 0');

            var expectedLives = Math.random() * 10;
            playerLifeChangeSubscriber.call({}, new GameEvent(Types.events.PLAYER_LIFE_CHANGE, {lives: expectedLives}));
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(500, 20, 'LIVES: ' + expectedLives);
        });

        it('should display start message', function () {
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(300, 300, 'PRESS SPACE TO START');
        });

        it('should not display start message after level starts', function () {
            newLevelSubscriber.call({}, new GameEvent(Types.events.NEW_LEVEL, {levelNumber: 1}));
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledExactly(2);
            verify('LIVES: 3', mockRenderer.drawText.firstCall.args[2]);
            verify('SCORE: 0', mockRenderer.drawText.secondCall.args[2]);
        });

        it('will display start message after game resets', function () {
            newLevelSubscriber.call({}, new GameEvent(Types.events.NEW_LEVEL, {levelNumber: 1}));
            gameResetSubscriber.call({}, new GameEvent(Types.events.GAME_RESET, null));
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(300, 300, 'PRESS SPACE TO START');

        });
    });


});