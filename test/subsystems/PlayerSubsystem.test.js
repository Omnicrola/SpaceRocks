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
var Time = require('../../src/engine/Time');
var EntitySubsystem = require('../../src/subsystems/entities/EntitySubsystem');
var CollisionManager = require('../../src/subsystems/entities/CollisionManager');
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
    var stubTime;

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
        stubTime = spies.createStub(new Time());
        stubTime.getCurrentTime.returns(100);
        playerSubsystem = new PlayerSubsystem({
            entitySubsystem: mockEntitySubsystem,
            time: stubTime,
            playerWeaponDelay: 250
        });
        mockContainer = containerGenerator.create();
    });

    it('should implement subsystem interface', function () {
        interface.assert.subsystems(playerSubsystem);
    });

    describe('handling input', function () {
        var playerEntity;
        var gameContainerForKeys;

        beforeEach(function () {
            gameContainerForKeys = containerGenerator.create();
            playerEntity = spies.createStub(new Entity({}, 'mock'));
            mockEntityFactory.buildPlayer.returns(playerEntity);
            playerSubsystem.respawnPlayer();
        });

        it('should ignore input if player is dead', function () {
            playerEntity._isAlive = false;

            setKeyPressed(GameInput.LEFT);
            setKeyPressed(GameInput.RIGHT);
            setKeyPressed(GameInput.UP);
            setKeyPressed(GameInput.DOWN);
            setKeyPressed(GameInput.SPACEBAR);

            verify(mockEntitySubsystem.addEntity).wasCalledOnce();
            playerSubsystem.update(gameContainerForKeys);

            assert.equal(0, playerEntity.rotation);
            assert.equal(0, playerEntity.velocity.x);
            assert.equal(0, playerEntity.velocity.y);
            verify(gameContainerForKeys.events.emit).wasNotCalled();
            verify(mockEntitySubsystem.addEntity).wasCalledOnce();
        });

        it('should rotate left', function () {
            assert.equal(0, playerEntity.rotation);

            setKeyPressed(GameInput.LEFT);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(ROTATION_SPEED * -1, playerEntity.rotation);
            assert.equal(0, playerEntity.velocity.x);
            assert.equal(0, playerEntity.velocity.y);

        });

        it('should rotate right', function () {
            assert.equal(0, playerEntity.rotation);

            setKeyPressed(GameInput.RIGHT);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(ROTATION_SPEED, playerEntity.rotation);
            assert.equal(0, playerEntity.velocity.x);
            assert.equal(0, playerEntity.velocity.y);
        });

        it('should thrust forward based on rotation', function () {
            assert.equal(0, playerEntity.rotation);

            var expectedVelocity = new Point(-0.04753292659165062, 0.1156097785208187);
            var expectedRotation = 22.35;
            playerEntity.rotation = expectedRotation;
            playerEntity.position = new Point(Math.random(), Math.random());
            setKeyPressed(GameInput.UP);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(expectedRotation, playerEntity.rotation);
            verify.point(expectedVelocity, playerEntity.velocity);

            verify(gameContainerForKeys.events.emit).wasCalledOnce();
            var thrustEvent = gameContainerForKeys.events.emit.firstCall.args[0];
            assert.equal('player-thrust', thrustEvent.type);
            verify.point(new Point(0, 1).rotate(expectedRotation), thrustEvent.data.direction);
            verify.point(playerEntity.position, thrustEvent.data.position);
        });

        it('should thrust backward based on rotation', function () {
            assert.equal(0, playerEntity.rotation);

            var expectedVelocity = new Point(0.09335879324904192, -0.08312121102993293);
            var expectedRotation = 48.32;
            playerEntity.rotation = expectedRotation;
            playerEntity.position = new Point(Math.random(), Math.random());
            setKeyPressed(GameInput.DOWN);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(expectedRotation, playerEntity.rotation);
            verify.point(expectedVelocity, playerEntity.velocity);

            verify(gameContainerForKeys.events.emit).wasCalledOnce();
            var thrustEvent = gameContainerForKeys.events.emit.firstCall.args[0];
            assert.equal('player-thrust', thrustEvent.type);
            verify.point(new Point(0, -1).rotate(expectedRotation), thrustEvent.data.direction);
            verify.point(playerEntity.position, thrustEvent.data.position);
        });

        it('should fire a bullet when spacebar is pressed', function () {
            stubTime.getCurrentTime.returns(1000);
            var playerRotation = 22.134;
            var expectedVelocity = new Point(0, BULLET_VELOCITY).rotate(playerRotation);
            var expectedPosition = new Point(23.33, 192.53);
            var expectedEntity = {entity: 'foobar'};
            mockEntityFactory.buildBullet.returns(expectedEntity);

            setKeyPressed(GameInput.SPACEBAR);

            playerEntity.rotation = playerRotation;
            playerEntity.position = expectedPosition;

            playerSubsystem.update(gameContainerForKeys);

            checkPoint(expectedPosition, mockEntityFactory.buildBullet.firstCall.args[0]);
            checkPoint(expectedVelocity, mockEntityFactory.buildBullet.firstCall.args[1]);

            verify(mockEntitySubsystem.addEntity).wasCalledTwice();
            verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedEntity, CollisionManager.BULLETS);
            verify(gameContainerForKeys.events.emit).wasCalledOnce();
            var actualEvent = gameContainerForKeys.events.emit.firstCall.args[0];
            assert.equal('player-fire', actualEvent.type);
            verify.point(expectedPosition, actualEvent.data.position);
            verify.point(expectedVelocity, actualEvent.data.velocity);
        });

        it('should not fire a bullet too frequently', function () {

            mockEntityFactory.buildBullet.returns({});
            setKeyPressed(GameInput.SPACEBAR);

            verify(mockEntitySubsystem.addEntity).wasCalledOnce();
            stubTime.getCurrentTime.returns(350);

            playerSubsystem.update(gameContainerForKeys);
            verify(mockEntitySubsystem.addEntity).wasCalledTwice();

            stubTime.getCurrentTime.returns(599);
            playerSubsystem.update(gameContainerForKeys);
            verify(mockEntitySubsystem.addEntity).wasCalledTwice();
        });

        function setKeyPressed(keyCode) {
            gameContainerForKeys.input
                .isPressed
                .withArgs(keyCode)
                .returns(true);
        }

    });

    it('should respawn the player', function () {
        var expectedPosition = new Point(320, 240);
        var expectedEntity = spies.createStub(Entity, 'Entity');
        mockEntityFactory.buildPlayer.returns(expectedEntity);

        verify(mockEntitySubsystem.addEntity).wasNotCalled();

        playerSubsystem.respawnPlayer();
        verify(mockEntitySubsystem.addEntity).wasCalledOnce();
        verify(mockEntitySubsystem.addEntity).wasCalledWith(expectedEntity, CollisionManager.PLAYER);

        verify(mockEntityFactory.buildPlayer).wasCalledOnce();
        checkPoint(expectedPosition, mockEntityFactory.buildPlayer.firstCall.args[0]);

    });

    it('should remove previous player entity', function () {
        var firstPlayer = spies.createStubInstance(Entity);
        var secondPlayer = spies.createStubInstance(Entity);
        mockEntityFactory.buildPlayer
            .onFirstCall().returns(firstPlayer)
            .onSecondCall().returns(secondPlayer);

        playerSubsystem.respawnPlayer();
        playerSubsystem.respawnPlayer();

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