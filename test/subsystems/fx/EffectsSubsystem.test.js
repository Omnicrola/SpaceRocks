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
var EntityFactory = require('../../../src/subsystems/entities/EntityFactory');
var EntitySubsystem = require('../../../src/subsystems/entities/EntitySubsystem');
var Point = require('../../../src/subsystems/entities/Point');
var GameEvent = require('../../../src/engine/GameEvent');
var AudioFx = require('../../../src/subsystems/fx/AudioFx');

describe('EffectsSubsystem', function () {
    var effectsSubsystem;
    var mockEntityFactory;
    var mockGameContainer;
    var mockEntitySubsystem;

    beforeEach(function () {
        mockEntityFactory = {
            buildParticles: spies.create('buildParticles')
        };
        EffectsSubsystem = proxy('../../../src/subsystems/fx/EffectsSubsystem', {
            '../entities/EntityFactory': mockEntityFactory
        });
        mockEntitySubsystem = spies.createStubInstance(EntitySubsystem);
        effectsSubsystem = new EffectsSubsystem(mockEntitySubsystem);
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
            mockEntityFactory.buildParticles.returns([]);
            entityDeathSubscriber = mockGameContainer.events.subscribe.getCall(1).args[1];
        });

        it('should play a sound when the player dies', function () {
            var gameEvent = new GameEvent('entity-death', {
                type: Entity.Type.PLAYER,
                position: new Point(0, 0)
            });
            verify(mockGameContainer.audio.play).wasNotCalled();

            entityDeathSubscriber.call({}, gameEvent);
            verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.EXPLOSION);
        });

        it('should generate particles when asteroid dies', function () {
            var expectedPosition = new Point(Math.random(), Math.random());
            var gameEvent = new GameEvent('entity-death', {
                type: Entity.Type.ASTEROID,
                position: expectedPosition
            });
            var expectedEntities = [{foo: 123}, {bar: 3455}];
            mockEntityFactory.buildParticles.returns(expectedEntities);
            var expectedConfig = {
                count: 4,
                position: expectedPosition,
                duration: 50,
                minForce: 1,
                maxForce: 3
            };

            entityDeathSubscriber.call({}, gameEvent);
            verify(mockEntityFactory.buildParticles).wasCalledWithConfig(0, expectedConfig);


            verify(mockEntitySubsystem.addEntity).wasCalledTwice();
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedEntities[0]);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedEntities[1]);
        });

        it('should play a sound when an asteroid dies', function () {
            var gameEvent = new GameEvent('entity-death', {
                type: Entity.Type.ASTEROID,
                position: new Point(0, 0)
            });
            verify(mockGameContainer.audio.play).wasNotCalled();

            entityDeathSubscriber.call({}, gameEvent);
            verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.EXPLOSION);
        });

        it('should not play a sound when a bullet dies', function () {
            var gameEvent = new GameEvent('entity-death', {
                type: Entity.Type.BULLET,
                position: new Point(0, 0)
            });

            entityDeathSubscriber.call({}, gameEvent);
            verify(mockGameContainer.audio.play).wasNotCalled();
        });

        it('should not play a sound when an effect dies', function () {
            var gameEvent = new GameEvent('entity-death', {
                type: Entity.Type.FX,
                position: new Point(0, 0)
            });

            entityDeathSubscriber.call({}, gameEvent);
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

            playerFireSubscriber.call({}, gameEvent);
            verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.WEAPON_FIRE);


        });
    });

});
