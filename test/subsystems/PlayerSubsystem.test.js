/**
 * Created by Eric on 12/12/2015.
 */
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var interface = require('../TestInterfaces');
var containerGenerator = require('../mocks/GameContainer');

var GameEvent = require('../../src/engine/GameEvent');
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

    beforeEach(function () {
        mockEntitySubsystem = spies.createStubInstance(EntitySubsystem, 'EntitySubsystem');
        playerSubsystem = new PlayerSubsystem(mockEntitySubsystem);
        mockContainer = containerGenerator.create();
        expectedPlayerShape = createPlayerShape();
    });

    it('should implement subsystem interface', function () {
        interface.assert.subsystems(playerSubsystem);
    });

    it('should subscribe to "new-level" events', function () {
        playerSubsystem.initialize(mockContainer);

        var subscribeSpy = mockContainer.events.subscribe;
        verify(subscribeSpy).wasCalledOnce();
        assert.equal('new-level', subscribeSpy.firstCall.args[0]);
    });

    describe('reacting to "new-level" events', function () {
        var newLevelSubscriber;
        beforeEach(function () {
            playerSubsystem.initialize(mockContainer);
            newLevelSubscriber = mockContainer.events.subscribe.firstCall.args[1];
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

        it('should remove previous player entity', function(){
            var event = new GameEvent('new-level', {});
            newLevelSubscriber(event);
            newLevelSubscriber(event);

            verify(mockEntitySubsystem.addEntity).wasCalledTwice();
            var firstPlayer = mockEntitySubsystem.addEntity.firstCall.args[0];
            var secondPlayer = mockEntitySubsystem.addEntity.secondCall.args[0];

            verify(mockEntitySubsystem.removeEntity).wasCalledOnce();
            verify(mockEntitySubsystem.removeEntity).wasCalledWith(firstPlayer);

        });
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
            new Point(0, 0),
        ]);
    }
});