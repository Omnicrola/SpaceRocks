/**
 * Created by omnic on 11/29/2015.
 */
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var interface = require('../../TestInterfaces');
var containerGenerator = require('../../mocks/GameContainer');

var Entity = require('../../../src/subsystems/entities/Entity');
var EntitySubsystem = require('../../../src/subsystems/entities/EntitySubsystem');

describe('EntitySubsystem', function () {
    var entitySubsystem;
    var mockContainer;
    beforeEach(function () {
        entitySubsystem = new EntitySubsystem();
        mockContainer = containerGenerator.create();
    });

    it('should implement Subsystem interface', function () {
        interface.assert.subsystems(entitySubsystem);
    });

    it('should update entities', function () {
        var stubEntity1 = spies.createStubInstance(Entity);
        var stubEntity2 = spies.createStubInstance(Entity);

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        var expectedDelta = Math.random();
        mockContainer.delta = expectedDelta;
        entitySubsystem.update(mockContainer);

        verify(stubEntity1.update).wasCalledWith(expectedDelta);
        verify(stubEntity2.update).wasCalledWith(expectedDelta);
    });

    it('should remove entities', function () {
        var stubEntity = spies.createStubInstance(Entity);

        entitySubsystem.addEntity(stubEntity);
        entitySubsystem.removeEntity(stubEntity);

        entitySubsystem.update(10);
        entitySubsystem.render({});

        verify(stubEntity.update).wasNotCalled();
        verify(stubEntity.render).wasNotCalled();
    });


    it('should render entities', function () {
        var stubEntity1 = spies.createStubInstance(Entity);
        var stubEntity2 = spies.createStubInstance(Entity);

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        var renderSpy = spies.create('renderer');
        entitySubsystem.render(renderSpy);

        verify(renderSpy).wasNotCalled();
        verify(stubEntity1.render).wasCalledWith(renderSpy);
        verify(stubEntity2.render).wasCalledWith(renderSpy);


    });
});