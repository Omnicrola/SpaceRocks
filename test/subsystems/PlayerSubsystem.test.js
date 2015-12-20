/**
 * Created by Eric on 12/12/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var interface = require('../TestInterfaces');
var containerGenerator = require('../mocks/GameContainer');

var GameEvent = require('../../src/engine/GameEvent');
var GameInput = require('../../src/engine/GameInput');
var EntitySubsystem = require('../../src/subsystems/entities/EntitySubsystem');
var Point = require('../../src/subsystems/entities/Point');
var EntityFactory = require('../../src/subsystems/entities/EntityFactory');
var Entity = require('../../src/subsystems/entities/Entity');

var PlayerSubsystem = require('../../src/subsystems/PlayerSubsystem');

describe('PlayerSubsystem', function () {
    var playerSubsystem;
    var mockContainer;
    var mockEntitySubsystem;
    var newLevelSubscriber;
    var mockEntityFactory;

    var ROTATION_SPEED = 5.0;
    var THRUST_INCREMENT = 0.125;
    var BULLET_VELOCITY = 5;

    beforeEach(function () {
        mockEntitySubsystem = spies.createStubInstance(EntitySubsystem, 'EntitySubsystem');
        mockEntityFactory = {
            buildPlayer: spies.create('createPlayer'),
            buildBullet: spies.create('buildBullet')
        };
        PlayerSubsystem = proxy('../../src/subsystems/PlayerSubsystem', {
            './entities/EntityFactory': mockEntityFactory
        });
        playerSubsystem = new PlayerSubsystem(mockEntitySubsystem);
        mockContainer = containerGenerator.create();

        playerSubsystem.initialize(mockContainer);
        newLevelSubscriber = mockContainer.events.subscribe.firstCall.args[1];
    });

    it('should implement subsystem interface', function () {
        interface.assert.subsystems(playerSubsystem);
    });

    describe('handling input', function () {
        var playerEntity;
        var gameContainerForKeys;

        beforeEach(function () {
            gameContainerForKeys = containerGenerator.create();
            playerEntity = new Entity({});
            mockEntityFactory.buildPlayer.returns(playerEntity);
            newLevelSubscriber(new GameEvent('new-level'));
        });

        it('should rotate left', function () {
            assert.equal(0, playerEntity.rotation);

            gameContainerForKeys.input
                .isPressed
                .withArgs(GameInput.LEFT)
                .returns(true);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(ROTATION_SPEED * -1, playerEntity.rotation);
            assert.equal(0, playerEntity.velocity.x);
            assert.equal(0, playerEntity.velocity.y);

        });

        it('should rotate right', function () {
            assert.equal(0, playerEntity.rotation);

            gameContainerForKeys.input
                .isPressed
                .withArgs(GameInput.RIGHT)
                .returns(true);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(ROTATION_SPEED, playerEntity.rotation);
            assert.equal(0, playerEntity.velocity.x);
            assert.equal(0, playerEntity.velocity.y);

        });

        it('should thrust forward based on rotation', function () {
            assert.equal(0, playerEntity.rotation);

            var expectedVX = -0.04753292659165062;
            var expectedVY = 0.1156097785208187;
            var expectedRotation = 22.35;
            playerEntity.rotation = expectedRotation;
            gameContainerForKeys.input
                .isPressed
                .withArgs(GameInput.UP)
                .returns(true);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(expectedRotation, playerEntity.rotation);
            assert.equal(expectedVX, playerEntity.velocity.x);
            assert.equal(expectedVY, playerEntity.velocity.y);

            verify(gameContainerForKeys.events.emit).wasCalledOnce();
            var thrustEvent = gameContainerForKeys.events.emit.firstCall.args[0];
            assert.equal('player-thrust', thrustEvent.type);
            assert.equal(expectedVX, thrustEvent.data.x);
            assert.equal(expectedVY, thrustEvent.data.y);

        });

        it('should thrust backward based on rotation', function () {
            assert.equal(0, playerEntity.rotation);

            var expectedVX = 0.09335879324904192;
            var expectedVY = -0.08312121102993293;
            var expectedRotation = 48.32;
            playerEntity.rotation = expectedRotation;
            gameContainerForKeys.input
                .isPressed
                .withArgs(GameInput.DOWN)
                .returns(true);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(expectedRotation, playerEntity.rotation);
            assert.equal(expectedVX, playerEntity.velocity.x);
            assert.equal(expectedVY, playerEntity.velocity.y);

            verify(gameContainerForKeys.events.emit).wasCalledOnce();
            var thrustEvent = gameContainerForKeys.events.emit.firstCall.args[0];
            assert.equal('player-thrust', thrustEvent.type);
            assert.equal(expectedVX, thrustEvent.data.x);
            assert.equal(expectedVY, thrustEvent.data.y);
        });

        it('should fire a bullet when spacebar is pressed', function () {
            var playerRotation = 22.134;
            var expectedVelocity = new Point(0, BULLET_VELOCITY).rotate(playerRotation);
            var expectedPosition = new Point(23.33, 192.53);
            var expectedEntity = {entity: 'foobar'};
            mockEntityFactory.buildBullet.returns(expectedEntity);

            gameContainerForKeys.input
                .isPressed
                .withArgs(GameInput.SPACEBAR)
                .returns(true);

            playerEntity.rotation = playerRotation;
            playerEntity.position = expectedPosition;

            playerSubsystem.update(gameContainerForKeys);

            checkPoint(expectedPosition, mockEntityFactory.buildBullet.firstCall.args[0]);
            checkPoint(expectedVelocity, mockEntityFactory.buildBullet.firstCall.args[1]);

            verify(mockEntitySubsystem.addEntity).wasCalledTwice();
            var actualEntity = mockEntitySubsystem.addEntity.secondCall.args[0];
            assert.equal(expectedEntity, actualEntity);
        });

    });

    it('should subscribe to "new-level" events', function () {
        var subscribeSpy = mockContainer.events.subscribe;
        verify(subscribeSpy).wasCalledOnce();
        assert.equal('new-level', subscribeSpy.firstCall.args[0]);
    });


    it('should respawn the player', function () {
        var expectedPosition = new Point(320, 240);
        var expectedEntity = spies.createStub(Entity, 'Entity');
        mockEntityFactory.buildPlayer.returns(expectedEntity);

        verify(mockEntitySubsystem.addEntity).wasNotCalled();
        var event = new GameEvent('new-level', {});

        newLevelSubscriber(event);
        verify(mockEntitySubsystem.addEntity).wasCalledOnce();
        verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedEntity);

        verify(mockEntityFactory.buildPlayer).wasCalledOnce();
        checkPoint(expectedPosition, mockEntityFactory.buildPlayer.firstCall.args[0]);

    });

    it('should remove previous player entity', function () {
        console.log(mockEntityFactory.buildPlayer);
        var event = new GameEvent('new-level', {});

        var firstPlayer = spies.createStubInstance(Entity);
        var secondPlayer = spies.createStubInstance(Entity);
        mockEntityFactory.buildPlayer
            .onFirstCall().returns(firstPlayer)
            .onSecondCall().returns(secondPlayer);

        newLevelSubscriber(event);
        newLevelSubscriber(event);

        verify(mockEntitySubsystem.addEntity).wasCalledTwice();
        var firstPlayer = mockEntitySubsystem.addEntity.firstCall.args[0];
        var secondPlayer = mockEntitySubsystem.addEntity.secondCall.args[0];

        verify(mockEntitySubsystem.removeEntity).wasCalledOnce();
        verify(mockEntitySubsystem.removeEntity).wasCalledWith(firstPlayer);

    });

    function checkPoint(expectedPoint, actualPoint) {
        assert.equal(expectedPoint.x, actualPoint.x);
        assert.equal(expectedPoint.y, actualPoint.y);
    }

});