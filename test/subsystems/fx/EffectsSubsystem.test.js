/**
 * Created by omnic on 12/25/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var interface = require('../../TestInterfaces');
var GameContainerMock = require('../../mocks/GameContainer');

var EffectsSubsystem = require('../../../src/subsystems/fx/EffectsSubsystem');
var Entity = require('../../../src/subsystems/entities/Entity');
var GameEvent = require('../../../src/engine/GameEvent');
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
        verify(subscribeSpy).wasCalledTwice();
        expect(subscribeSpy.getCall(0).args[0]).to.equal('player-fire');
        expect(subscribeSpy.getCall(1).args[0]).to.equal('entity-death');
    });

    describe('reacting to a entity-death event', function () {
        var entityDeathSubscriber;
        beforeEach(function () {
            effectsSubsystem.initialize(mockGameContainer);
            entityDeathSubscriber = mockGameContainer.events.subscribe.getCall(1).args[1];
        });

        it('should play a sound when the player dies', function () {
            var gameEvent = new GameEvent('entity-death', Entity.Type.PLAYER);
            verify(mockGameContainer.audio.play).wasNotCalled();

            entityDeathSubscriber(gameEvent);
            verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.EXPLOSION);
        });

        it('should play a sound when the player dies', function () {
            var gameEvent = new GameEvent('entity-death', Entity.Type.ASTEROID);
            verify(mockGameContainer.audio.play).wasNotCalled();

            entityDeathSubscriber(gameEvent);
            verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.EXPLOSION);
        });

        it('should not play a sound when a bullet dies', function () {
            var gameEvent = new GameEvent('entity-death', Entity.Type.BULLET);

            entityDeathSubscriber(gameEvent);
            verify(mockGameContainer.audio.play).wasNotCalled();
        });

        it('should not play a sound when an effect dies', function () {
            var gameEvent = new GameEvent('entity-death', Entity.Type.FX);

            entityDeathSubscriber(gameEvent);
            verify(mockGameContainer.audio.play).wasNotCalled();
        });
    });

    describe('reacting to player-fire event', function () {
        var playerFireSubscriber;
        beforeEach(function () {
            effectsSubsystem.initialize(mockGameContainer);
            playerFireSubscriber = mockGameContainer.events.subscribe.getCall(0).args[1];
        });

        it('should play an audio file when the player shoots a bullet', function () {
            var gameEvent = new GameEvent('player-fire', {});

            verify(mockGameContainer.audio.play).wasNotCalled();

            playerFireSubscriber(gameEvent);
            verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.WEAPON_FIRE);


        });
    });

});
