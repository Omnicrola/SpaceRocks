/**
 * Created by omnic on 11/29/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var interface = require('../../TestInterfaces');
var Types = require('../../ExpectedTypes');
var containerGenerator = require('../../mocks/GameContainer');

var GameEvent = require('../../../src/engine/GameEvent');
var Entity = require('../../../src/subsystems/entities/Entity');
var Point = require('../../../src/subsystems/entities/Point');
var EntitySubsystem = require('../../../src/subsystems/entities/EntitySubsystem');
var CollisionManager = require('../../../src/subsystems/entities/CollisionManager');

describe('EntitySubsystem', function () {
    var entitySubsystem;
    var mockGameContainer;
    var stubCollisionManager;
    beforeEach(function () {
        var mockCollisionManagerModule = spies.create('CollisionManager');
        stubCollisionManager = spies.createStub(new CollisionManager());
        mockCollisionManagerModule.returns(stubCollisionManager);
        EntitySubsystem = proxy('../../../src/subsystems/entities/EntitySubsystem', {
            './CollisionManager': mockCollisionManagerModule
        });
        entitySubsystem = new EntitySubsystem();
        mockGameContainer = containerGenerator.create();
        entitySubsystem.initialize(mockGameContainer);
    });

    it('should implement Subsystem interface', function () {
        interface.assert.subsystems(entitySubsystem);
    });

    it('should update entities', function () {
        var stubEntity1 = createStubEntity();
        var stubEntity2 = createStubEntity();

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        entitySubsystem.update(mockGameContainer);

        verify(stubEntity1.update).wasCalledWith(mockGameContainer);
        verify(stubEntity2.update).wasCalledWith(mockGameContainer);
    });

    it('should add entities to CollisionManager ', function () {
        var stubEntity = createStubEntity();
        var expectedGroup = Math.random();
        entitySubsystem.addEntity(stubEntity, expectedGroup);
        verify(stubCollisionManager.add).wasCalledWith(stubEntity, expectedGroup);
    });

    it('should call update on CollisionManager', function () {
        entitySubsystem.update(mockGameContainer);
        verify(stubCollisionManager.update).wasCalledWith(mockGameContainer);
    });

    it('should emit an event when an entity is added', function () {
        var expectedType = 'my-type';
        var collisionGroup = Math.random() * 100;
        var expectedEvent = new GameEvent(Types.events.ENTITY_ADDED, {type: expectedType});
        var stubEntity = createStubEntity(expectedType);

        entitySubsystem.addEntity(stubEntity, collisionGroup);
        entitySubsystem.update(mockGameContainer);

        verify(mockGameContainer.events.emit).wasCalledOnce();
        var actualEvent = mockGameContainer.events.emit.firstCall.args[0];
        assert.equal(Types.events.ENTITY_ADDED, actualEvent.type);
        verify.config({type: expectedType}, actualEvent.data);

    });

    it('should emit an event when an entity is removed', function () {
        var expectedType = 'other-type';
        var collisionGroup = Math.random() * 100;
        var expectedEvent = new GameEvent(Types.events.ENTITY_ADDED, {type: expectedType});
        var stubEntity = createStubEntity(expectedType);

        entitySubsystem.addEntity(stubEntity, collisionGroup);
        entitySubsystem.removeEntity(stubEntity, collisionGroup);
        entitySubsystem.update(mockGameContainer);

        verify(mockGameContainer.events.emit).wasCalledTwice();
        var actualEvent = mockGameContainer.events.emit.secondCall.args[0];
        assert.equal(Types.events.ENTITY_REMOVED, actualEvent.type);
        verify.config({type: expectedType}, actualEvent.data);

    });

    it('should remove entities', function () {
        var stubEntity = createStubEntity();

        entitySubsystem.addEntity(stubEntity);
        entitySubsystem.removeEntity(stubEntity);

        entitySubsystem.update(mockGameContainer);
        entitySubsystem.render({});

        verify(stubCollisionManager.remove).wasCalledWith(stubEntity);
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
            mockGameContainer.display.width = width;
            mockGameContainer.display.height = height;

            stubEntity = createStubEntity();
        });

        it('should move to max if X is below zero', function () {
            var expectedPosition = new Point(-1, 100);
            stubEntity.position = expectedPosition;

            entitySubsystem.addEntity(stubEntity);
            entitySubsystem.update(mockGameContainer);
            checkPoint(new Point(width, 100), stubEntity.position);
        });

        it('should move to 0 if X is above screen width', function () {
            var expectedPosition = new Point(width + 1, 100);
            stubEntity.position = expectedPosition;

            entitySubsystem.addEntity(stubEntity);
            entitySubsystem.update(mockGameContainer);
            checkPoint(new Point(0, 100), stubEntity.position);
        });

        it('should move to max if Y is below zero', function () {
            var expectedPosition = new Point(1, -1);
            stubEntity.position = expectedPosition;

            entitySubsystem.addEntity(stubEntity);
            entitySubsystem.update(mockGameContainer);
            checkPoint(new Point(1, height), stubEntity.position);
        });

        it('should move to 0 if Y is above screen height', function () {
            var expectedPosition = new Point(1, height + 1);
            stubEntity.position = expectedPosition;

            entitySubsystem.addEntity(stubEntity);
            entitySubsystem.update(mockGameContainer);
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

        entitySubsystem.update(mockGameContainer);
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


    function createStubEntity(type) {
        var entity = spies.createStubInstance(Entity);
        entity.isAlive = true;
        entity.position = new Point(0, 0);
        entity.type = type || 'mock type';
        return entity;
    }

    function checkPoint(expectedPoint, actualPoint) {
        assert.equal(expectedPoint.x, actualPoint.x, 'X values do not match');
        assert.equal(expectedPoint.y, actualPoint.y, 'Y values do not match');
    }
});