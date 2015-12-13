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
var Point = require('../../src/subsystems/entities/Point');

describe('PlayerSubsystem', function () {
    var playerSubsystem;
    var mockContainer;
    var mockEntitySubsystem;

    beforeEach(function () {
        mockEntitySubsystem = spies.createStubInstance(EntitySubsystem, 'EntitySubsystem');
        playerSubsystem = new PlayerSubsystem(mockEntitySubsystem);
        mockContainer = containerGenerator.create();
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
            assert.deepEqual(new Point(0,0), actualEntity.position);
            assert.deepEqual(new Point(0,0), actualEntity.velocity);
            assert.equal(0, actualEntity.rotation);

        });
    });
});