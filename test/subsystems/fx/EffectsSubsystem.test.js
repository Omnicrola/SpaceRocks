/**
 * Created by omnic on 12/25/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var interface = require('../../TestInterfaces');
var GameContainerMock = require('../../mocks/GameContainer');

var EffectsSubsystem = require('../../../src/subsystems/fx/EffectsSubsystem');
var Entity  = require('../../../src/subsystems/entities/Entity');
var GameEvent  = require('../../../src/engine/GameEvent');
var AudioFx = require('../../../src/subsystems/fx/AudioFx');

describe('EffectsSubsystem', function () {
    var effectsSubsystem;
    var mockGameContainer;
    beforeEach(function () {
        effectsSubsystem = new EffectsSubsystem();
        mockGameContainer = GameContainerMock.create();
    });

    it('implements subsystem interface', function () {
        interface.assert.subsystems(effectsSubsystem);
    });

    it('should subscribe to events', function () {
        effectsSubsystem.initialize(mockGameContainer);

        var subscribeSpy = mockGameContainer.events.subscribe;
        verify(subscribeSpy).wasCalledOnce();
        expect(subscribeSpy.firstCall.args[0]).to.equal('player-fire');
    });

    describe('reacting to entity-death event', function () {
        var entityDeathSubscriber;
        beforeEach(function () {
            effectsSubsystem.initialize(mockGameContainer);
            entityDeathSubscriber = mockGameContainer.events.subscribe.firstCall.args[1];
        });

        it('should play an audio file when an asteroid is destroyed', function () {
            var gameEvent = new GameEvent('player-fire',{});

            verify(mockGameContainer.audio.play).wasNotCalled();

            entityDeathSubscriber(gameEvent);
            verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.WEAPON_FIRE);


        });
    });

});
