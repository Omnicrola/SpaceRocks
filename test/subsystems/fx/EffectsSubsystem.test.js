/**
 * Created by omnic on 12/25/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var interface = require('../../TestInterfaces');
var GameContainerMock = require('../../mocks/GameContainer');
var Types = require('../../ExpectedTypes');

var EffectsSubsystem = require('../../../src/subsystems/fx/EffectsSubsystem');
var Entity = require('../../../src/subsystems/entities/Entity');
var EntityFactory = require('../../../src/subsystems/entities/EntityFactory');
var CollisionManager = require('../../../src/subsystems/entities/CollisionManager');
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
        verify(subscribeSpy).wasCalledExactly(3);
        expect(subscribeSpy.getCall(0).args[0]).to.equal(Types.events.PLAYER_FIRE);
        expect(subscribeSpy.getCall(1).args[0]).to.equal(Types.events.ENTITY_DEATH);
        expect(subscribeSpy.getCall(2).args[0]).to.equal(Types.events.PLAYER_THRUST);
    });

    describe('reacting to player-thrust event', function () {
        var playerThrustSubscriber;
        beforeEach(function () {
            effectsSubsystem.initialize(mockGameContainer);
            playerThrustSubscriber = mockGameContainer.events.subscribe.getCall(2).args[1];
        });

        it('will emit particles in the direction of thrust', function () {
            var expectedDirection = new Point(Math.random(), Math.random());
            var expectedPosition = new Point(Math.random(), Math.random());
            var gameEvent = new GameEvent(Types.events.PLAYER_THRUST, {
                direction: expectedDirection,
                position: expectedPosition
            });
            var expectedConfig = {
                count: 2,
                position: expectedPosition,
                direction: expectedDirection.scale(-5),
                directionalSpread: 15,
                duration: 5,
            };
            var expectedEntities = [{foo: 22}, {bar: 2999}];
            mockEntityFactory.buildParticles.returns(expectedEntities);

            playerThrustSubscriber.call({}, gameEvent);
            verify(mockEntityFactory.buildParticles).wasCalledWithConfig(0, expectedConfig);

        });

    });

    describe('reacting to a entity-death event', function () {
        var entityDeathSubscriber;
        beforeEach(function () {
            effectsSubsystem.initialize(mockGameContainer);
            mockEntityFactory.buildParticles.returns([]);
            entityDeathSubscriber = mockGameContainer.events.subscribe.getCall(1).args[1];
        });

        it('should play a sound when the player dies', function () {
            var gameEvent = new GameEvent(Types.events.ENTITY_DEATH, {
                type: Types.entities.PLAYER,
                position: new Point(0, 0)
            });
            verify(mockGameContainer.audio.play).wasNotCalled();

            entityDeathSubscriber.call({}, gameEvent);
            verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.EXPLOSION);
        });

        it('should generate particles when asteroid dies', function () {
            var expectedPosition = new Point(Math.random(), Math.random());
            var gameEvent = new GameEvent(Types.events.ENTITY_DEATH, {
                type: Types.entities.ASTEROID_LARGE,
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
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedEntities[0], CollisionManager.FX);
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedEntities[1], CollisionManager.FX);
        });

        describe('audio on asteroid death', function () {
            it('should play on large asteroid', function () {
                destroyEntity(Types.entities.ASTEROID_LARGE);
                verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.EXPLOSION);
            });
            it('should play on medium asteroid', function () {
                destroyEntity(Types.entities.ASTEROID_MEDIUM);
                verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.EXPLOSION);
            });
            it('should play on small asteroid', function () {
                destroyEntity(Types.entities.ASTEROID_SMALL);
                verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.EXPLOSION);
            });
        });

        function destroyEntity(type, position) {
            position = position || new Point(0, 0);
            var gameEvent = new GameEvent(Types.events.ENTITY_DEATH, {
                type: type,
                position: position
            });
            entityDeathSubscriber.call({}, gameEvent);
        }


        it('should not play a sound when a bullet dies', function () {
            var gameEvent = new GameEvent(Types.events.ENTITY_DEATH, {
                type: Types.entities.BULLET,
                position: new Point(0, 0)
            });

            entityDeathSubscriber.call({}, gameEvent);
            verify(mockGameContainer.audio.play).wasNotCalled();
        });

        it('should not play a sound when an effect dies', function () {
            var gameEvent = new GameEvent(Types.events.ENTITY_DEATH, {
                type: Types.entities.FX,
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
            var gameEvent = new GameEvent(Types.events.PLAYER_FIRE, {});

            verify(mockGameContainer.audio.play).wasNotCalled();

            playerFireSubscriber.call({}, gameEvent);
            verify(mockGameContainer.audio.play).wasCalledWith(AudioFx.WEAPON_FIRE);


        });
    });

});
