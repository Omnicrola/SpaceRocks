/**
 * Created by Eric on 12/12/2015.
 */
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var interface = require('../TestInterfaces');
var containerGenerator = require('../mocks/GameContainer');

var GameEvent = require('../../src/engine/GameEvent');
var GameInput = require('../../src/engine/GameInput');
var PlayerSubsystem = require('../../src/subsystems/PlayerSubsystem');
var EntitySubsystem = require('../../src/subsystems/entities/EntitySubsystem');
var Entity = require('../../src/subsystems/entities/Entity');
var Shape = require('../../src/subsystems/entities/Shape');
var Point = require('../../src/subsystems/entities/Point');

describe('PlayerSubsystem', function () {
    var playerSubsystem;
    var mockContainer;
    var mockEntitySubsystem;
    var expectedPlayerShape;
    var newLevelSubscriber;

    var ROTATION_SPEED = 5.0;
    var THRUST_INCREMENT = 0.125;

    beforeEach(function () {
        mockEntitySubsystem = spies.createStubInstance(EntitySubsystem, 'EntitySubsystem');
        playerSubsystem = new PlayerSubsystem(mockEntitySubsystem);
        mockContainer = containerGenerator.create();
        expectedPlayerShape = createPlayerShape();

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
            newLevelSubscriber(new GameEvent('new-level'));
            playerEntity = mockEntitySubsystem.addEntity.firstCall.args[0];
            gameContainerForKeys = containerGenerator.create();
        });

        it('should rotate left', function () {
            assert.equal(0, playerEntity.rotation);

            gameContainerForKeys.input
                .isPressed
                .withArgs(gameContainerForKeys.input.LEFT)
                .returns(true);
            playerSubsystem.update(gameContainerForKeys);

            assert.equal(ROTATION_SPEED*-1, playerEntity.rotation);
            assert.equal(0, playerEntity.velocity.x);
            assert.equal(0, playerEntity.velocity.y);

        });

        it('should rotate right', function () {
            assert.equal(0, playerEntity.rotation);

            gameContainerForKeys.input
                .isPressed
                .withArgs(gameContainerForKeys.input.RIGHT)
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
                .withArgs(gameContainerForKeys.input.UP)
                .returns(true);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(expectedRotation, playerEntity.rotation);
            assert.equal(expectedVX, playerEntity.velocity.x);
            assert.equal(expectedVY, playerEntity.velocity.y);

        });

        it('should thrust backward based on rotation', function () {
            assert.equal(0, playerEntity.rotation);

            var expectedVX = 0.09335879324904192;
            var expectedVY = -0.08312121102993293;
            var expectedRotation = 48.32;
            playerEntity.rotation = expectedRotation;
            gameContainerForKeys.input
                .isPressed
                .withArgs(gameContainerForKeys.input.DOWN)
                .returns(true);

            playerSubsystem.update(gameContainerForKeys);

            assert.equal(expectedRotation, playerEntity.rotation);
            assert.equal(expectedVX, playerEntity.velocity.x);
            assert.equal(expectedVY, playerEntity.velocity.y);

        });
    });

    it('should subscribe to "new-level" events', function () {

        var subscribeSpy = mockContainer.events.subscribe;
        verify(subscribeSpy).wasCalledOnce();
        assert.equal('new-level', subscribeSpy.firstCall.args[0]);
    });


    it('should respawn the player', function () {
        verify(mockEntitySubsystem.addEntity).wasNotCalled();
        var event = new GameEvent('new-level', {});

        newLevelSubscriber(event);
        verify(mockEntitySubsystem.addEntity).wasCalledOnce();
        var actualEntity = mockEntitySubsystem.addEntity.firstCall.args[0];
        assert.isTrue(actualEntity instanceof Entity);
        checkPoint(new Point(200, 200), actualEntity.position);
        checkPoint(new Point(0, 0), actualEntity.velocity);
        assert.equal(0, actualEntity.rotation);
        checkShape(expectedPlayerShape, actualEntity._shape);
    });

    it('should remove previous player entity', function () {
        var event = new GameEvent('new-level', {});
        newLevelSubscriber(event);
        newLevelSubscriber(event);

        verify(mockEntitySubsystem.addEntity).wasCalledTwice();
        var firstPlayer = mockEntitySubsystem.addEntity.firstCall.args[0];
        var secondPlayer = mockEntitySubsystem.addEntity.secondCall.args[0];

        verify(mockEntitySubsystem.removeEntity).wasCalledOnce();
        verify(mockEntitySubsystem.removeEntity).wasCalledWith(firstPlayer);

    });
    function checkShape(expectedShape, actualShape) {
        assert.isTrue(actualShape instanceof Shape);
        assert.equal(expectedShape._points.length, actualShape._points.length, 'Should have same number of points');
        for (var i = 0; i < expectedShape._points.length; i++) {
            checkPoint(expectedShape._points[i], actualShape._points[i]);
        }
    }

    function checkPoint(expectedPoint, actualPoint) {
        assert.equal(expectedPoint.x, actualPoint.x);
        assert.equal(expectedPoint.y, actualPoint.y);
    }

    function createPlayerShape() {
        return new Shape([
            new Point(-5, -5),
            new Point(0, -5),
            new Point(5, -5),
            new Point(0, 5),
        ]);
    }
});