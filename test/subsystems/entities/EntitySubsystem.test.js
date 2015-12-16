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
        var stubEntity1 = createStubEntity();
        var stubEntity2 = createStubEntity();

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        var expectedDelta = Math.random();
        mockContainer.delta = expectedDelta;
        entitySubsystem.update(mockContainer);

        verify(stubEntity1.update).wasCalledWith(expectedDelta);
        verify(stubEntity2.update).wasCalledWith(expectedDelta);
    });

    it('should remove entities', function () {
        var stubEntity = createStubEntity();

        entitySubsystem.addEntity(stubEntity);
        entitySubsystem.removeEntity(stubEntity);

        entitySubsystem.update(10);
        entitySubsystem.render({});

        verify(stubEntity.update).wasNotCalled();
        verify(stubEntity.render).wasNotCalled();
    });

    it('should remove dead entities', function () {
        var stubEntity1 = createStubEntity();
        var stubEntity2 = createStubEntity();

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        stubEntity1.isAlive = false;
        stubEntity2.isAlive = true;

        entitySubsystem.update(1);
        entitySubsystem.render({});

        verify(stubEntity1.update).wasNotCalled();
        verify(stubEntity1.render).wasNotCalled();
        verify(stubEntity2.update).wasCalledOnce();
        verify(stubEntity2.render).wasCalledOnce();
    });


    it('should render entities', function () {
        var stubEntity1 = createStubEntity();
        var stubEntity2 = createStubEntity();

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        var renderSpy = spies.create('renderer');
        entitySubsystem.render(renderSpy);

        verify(renderSpy).wasNotCalled();
        verify(stubEntity1.render).wasCalledWith(renderSpy);
        verify(stubEntity2.render).wasCalledWith(renderSpy);


    });

    function createStubEntity() {
        var entity = spies.createStubInstance(Entity);
        entity.isAlive = true;
        return entity;
    }

});