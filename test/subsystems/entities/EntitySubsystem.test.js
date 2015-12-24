/**
 * Created by omnic on 11/29/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var interface = require('../../TestInterfaces');
var containerGenerator = require('../../mocks/GameContainer');

var Entity = require('../../../src/subsystems/entities/Entity');
var Point = require('../../../src/subsystems/entities/Point');
var EntitySubsystem = require('../../../src/subsystems/entities/EntitySubsystem');
var CollisionManager = require('../../../src/subsystems/entities/CollisionManager');

describe('EntitySubsystem', function () {
    var entitySubsystem;
    var mockContainer;
    var stubCollisionManager;
    beforeEach(function () {
        var mockCollisionManagerModule = spies.create('CollisionManager');
        stubCollisionManager = spies.createStub(new CollisionManager());
        mockCollisionManagerModule.returns(stubCollisionManager);
        EntitySubsystem = proxy('../../../src/subsystems/entities/EntitySubsystem', {
            './CollisionManager': mockCollisionManagerModule
        });
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

        entitySubsystem.update(mockContainer);

        verify(stubEntity1.update).wasCalledWith(mockContainer);
        verify(stubEntity2.update).wasCalledWith(mockContainer);
    });

    it('should add entities to CollisionManager ', function () {
        var stubEntity = createStubEntity();
        var expectedGroup = Math.random();
        entitySubsystem.addEntity(stubEntity, expectedGroup);
        verify(stubCollisionManager.add).wasCalledWith(stubEntity, expectedGroup);
    });

    it('should call update on CollisionManager', function () {
        entitySubsystem.update(mockContainer);
        verify(stubCollisionManager.update).wasCalledWith();
    });

    it('should remove entities', function () {
        var stubEntity = createStubEntity();

        entitySubsystem.addEntity(stubEntity);
        entitySubsystem.removeEntity(stubEntity);

        entitySubsystem.update(mockContainer);
        entitySubsystem.render({});

        verify(stubEntity.update).wasNotCalled();
        verify(stubEntity.render).wasNotCalled();
    });

    describe('wrapping entity positions', function () {
        var width;
        var height;
        var stubEntity;
        beforeEach(function () {
            width = 1000;
            height = 1000;
            mockContainer.display.width = width;
            mockContainer.display.height = height;

            stubEntity = createStubEntity();
        });

        it('should move to max if X is below zero', function () {
            var expectedPosition = new Point(-1, 100);
            stubEntity.position = expectedPosition;

            entitySubsystem.addEntity(stubEntity);
            entitySubsystem.update(mockContainer);
            checkPoint(new Point(width, 100), stubEntity.position);
        });

        it('should move to 0 if X is above screen width', function () {
            var expectedPosition = new Point(width + 1, 100);
            stubEntity.position = expectedPosition;

            entitySubsystem.addEntity(stubEntity);
            entitySubsystem.update(mockContainer);
            checkPoint(new Point(0, 100), stubEntity.position);
        });

        it('should move to max if Y is below zero', function () {
            var expectedPosition = new Point(1, -1);
            stubEntity.position = expectedPosition;

            entitySubsystem.addEntity(stubEntity);
            entitySubsystem.update(mockContainer);
            checkPoint(new Point(1, height), stubEntity.position);
        });

        it('should move to 0 if Y is above screen height', function () {
            var expectedPosition = new Point(1, height + 1);
            stubEntity.position = expectedPosition;

            entitySubsystem.addEntity(stubEntity);
            entitySubsystem.update(mockContainer);
            checkPoint(new Point(1, 0), stubEntity.position);
        });
    });

    it('should remove dead entities', function () {
        var stubEntity1 = createStubEntity();
        var stubEntity2 = createStubEntity();

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        stubEntity1.isAlive = false;
        stubEntity2.isAlive = true;

        entitySubsystem.update(mockContainer);
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
        entity.position = new Point(0, 0);
        return entity;
    }

    function checkPoint(expectedPoint, actualPoint) {
        assert.equal(expectedPoint.x, actualPoint.x, 'X values do not match');
        assert.equal(expectedPoint.y, actualPoint.y, 'Y values do not match');
    }
});