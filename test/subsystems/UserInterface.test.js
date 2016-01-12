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

    describe('reacting to events', function () {
        beforeEach(function () {
            userInterface.initialize(mockGameContainer);
        });

        it('should draw last score emitted', function () {
            userInterface.render(mockRenderer);
            verify(mockRenderer.setFont).wasCalledWith(EXPECTED_FONT);
            verifyScore(0);

            var expectedScore = Math.random();
            mockGameContainer.$emitMockEvent(Types.events.SCORE_CHANGE, {score: expectedScore});
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(10, 20, 'SCORE: ' + expectedScore);
        });

        it('should draw last player life count emitted', function () {
            userInterface.render(mockRenderer);
            verify(mockRenderer.setFont).wasCalledWith(EXPECTED_FONT);
            verify(mockRenderer.drawText).wasCalledWith(500, 20, 'LIVES: 0');

            var expectedLives = Math.random() * 10;
            mockGameContainer.$emitMockEvent(Types.events.PLAYER_LIFE_CHANGE, {lives: expectedLives});
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(500, 20, 'LIVES: ' + expectedLives);
        });

        it('should display start message', function () {
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(300, 300, 'PRESS SPACE TO START');
        });

        it('should not display start message after level starts', function () {
            mockGameContainer.$emitMockEvent(Types.events.NEW_LEVEL, {levelNumber: 1});
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledExactly(2);
            verifyLives(0);
            verifyScore(0);
        });

        it('will display start message after game resets', function () {
            mockGameContainer.$emitMockEvent(Types.events.NEW_LEVEL, {levelNumber: 1});
            mockGameContainer.$emitMockEvent(Types.events.GAME_RESET, null);
            userInterface.render(mockRenderer);
        });

        it('should draw game over when game over state is active', function () {
            mockGameContainer.$emitMockEvent(Types.events.NEW_LEVEL, {levelNumber: 1});
            mockGameContainer.$emitMockEvent(Types.events.STATE_CHANGE, {state: Types.state.GAME_OVER});
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledWith(250, 250, 'GAME OVER');

        });

        it('should not draw game over when new game has started', function () {
            mockGameContainer.$emitMockEvent(Types.events.NEW_LEVEL, {levelNumber: 1});
            mockGameContainer.$emitMockEvent(Types.events.STATE_CHANGE, {state: Types.state.GAME_OVER});
            mockGameContainer.$emitMockEvent(Types.events.NEW_GAME, {});
            userInterface.render(mockRenderer);
            verify(mockRenderer.drawText).wasCalledExactly(2);
            verifyScore(0);
            verifyLives(0);
        });
    });

    function verifyStartMessage() {
        verify(mockRenderer.drawText).wasCalledWith(300, 300, 'PRESS SPACE TO START');
    }

    function verifyLives(expectedLives) {
        verify(mockRenderer.drawText).wasCalledWith(500, 20, 'LIVES: '+expectedLives);
    }

    function verifyScore(expectedScore) {
        verify(mockRenderer.drawText).wasCalledWith(10, 20, 'SCORE: '+expectedScore);
    }


});