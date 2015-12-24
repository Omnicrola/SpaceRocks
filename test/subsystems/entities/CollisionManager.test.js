/**
 * Created by Eric on 12/19/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var GameContainerMock = require('../../mocks/GameContainer');

var Shape = require('../../../src/subsystems/entities/Shape');
var Point = require('../../../src/subsystems/entities/Point');
var Entity = require('../../../src/subsystems/entities/Entity');
var CollisionManager = require('../../../src/subsystems/entities/CollisionManager');

describe('CollisionManager', function () {
    var collisionManager;
    var mockGameContainer;
    beforeEach(function () {
        collisionManager = new CollisionManager();
        mockGameContainer = GameContainerMock.create();
    });

    describe('entities colliding', function () {
        var stubShape1;
        var stubEntity1;
        var stubShape2;
        var stubEntity2;

        beforeEach(function () {
            stubShape1 = spies.createStub(new Shape());
            stubShape2 = spies.createStub(new Shape());
            stubEntity1 = spies.createStubInstance(Entity);
            stubEntity2 = spies.createStubInstance(Entity);
            stubEntity1.shape = stubShape1;
            stubEntity2.shape = stubShape2;
            stubEntity1.isAlive = true;
            stubEntity2.isAlive = true;
            collisionManager.add(stubEntity1, CollisionManager.ASTEROID);
            collisionManager.add(stubEntity2, CollisionManager.PLAYER);

        });

        it('should not destroy entities if they do not intersect', function () {
            stubShape1.intersects.returns(false);
            stubShape2.intersects.returns(false);

            collisionManager.update(mockGameContainer);
            verify(stubEntity1.destroy).wasNotCalled();
            verify(stubEntity2.destroy).wasNotCalled();
        });

        it('should not test entities in the same group against each other', function () {
            collisionManager = new CollisionManager();
            collisionManager.add(stubEntity1, CollisionManager.ASTEROID);
            collisionManager.add(stubEntity2, CollisionManager.ASTEROID);

            collisionManager.update(mockGameContainer);
            verify(stubShape1.intersects).wasNotCalled();
            verify(stubShape2.intersects).wasNotCalled();
        });

        it('should not collide an entity with itself', function () {
            collisionManager = new CollisionManager();
            collisionManager.add(stubEntity1, CollisionManager.PLAYER);
            stubShape1.intersects.returns(true);

            collisionManager.update(mockGameContainer);
            verify(stubShape1.intersects).wasNotCalled();
            verify(stubEntity1.destroy).wasNotCalled();
        });

        it('should destroy both entities if they intersect', function () {
            stubShape1.intersects.returns(true);

            collisionManager.update(mockGameContainer);
            verify(stubEntity1.destroy).wasCalledWith(mockGameContainer);
            verify(stubEntity2.destroy).wasCalledWith(mockGameContainer);
        });

        it('will not destroy entities if one is already destroyed', function () {
            stubShape1.intersects.returns(true);
            stubShape2.intersects.returns(true);
            stubEntity1.isAlive = false;

            collisionManager.update(mockGameContainer);
            verify(stubEntity1.destroy).wasNotCalled();
            verify(stubEntity2.destroy).wasNotCalled();
        });

        it('will remove entities that are destroyed', function () {
            stubEntity1.isAlive = false;
            stubEntity2.isAlive = false;

            collisionManager.update(mockGameContainer);
            verify(stubShape1.intersects).wasNotCalled();
            verify(stubShape2.intersects).wasNotCalled();
        });
    });
    it('has static values', function () {
        verify.readOnlyProperty(CollisionManager, 'PLAYER', 0);
        verify.readOnlyProperty(CollisionManager, 'ASTEROID', 1);
        verify.readOnlyProperty(CollisionManager, 'BULLETS', 2);
        verify.readOnlyProperty(CollisionManager, 'FX', 3);
    });

    describe('functional group collision masking', function () {
        var entity1;
        var entity2;
        beforeEach(function () {
            entity1 = new Entity(new Shape([
                new Point(-1, -1),
                new Point(-1, 1),
                new Point(1, 1),
                new Point(1, -1)
            ]));
            entity2 = new Entity(new Shape([
                new Point(-0.5, -0.5),
                new Point(-0.5, 0.5),
                new Point(0.5, 0.5),
                new Point(0.5, -0.5)
            ]));
            spies.replace(entity1, 'destroy');
            spies.replace(entity2, 'destroy');
        });

        it('asteroids and player', function () {
            collisionManager.add(entity1, CollisionManager.ASTEROID);
            collisionManager.add(entity2, CollisionManager.PLAYER);
            assertCollisionOccurred();
        });

        it('asteroids and bullets', function () {
            collisionManager.add(entity1, CollisionManager.ASTEROID);
            collisionManager.add(entity2, CollisionManager.BULLETS);
            assertCollisionOccurred();
        });

        it('asteroids and fx', function () {
            collisionManager.add(entity1, CollisionManager.ASTEROID);
            collisionManager.add(entity2, CollisionManager.FX);
            assertCollisionDidNotOccur();
        });

        it('asteroids and asteroids', function () {
            collisionManager.add(entity1, CollisionManager.ASTEROID);
            collisionManager.add(entity2, CollisionManager.ASTEROID);
            assertCollisionDidNotOccur();
        });

        it('player and bullets', function () {
            collisionManager.add(entity1, CollisionManager.PLAYER);
            collisionManager.add(entity2, CollisionManager.BULLETS);
            assertCollisionDidNotOccur();
        });

        it('player and fx', function () {
            collisionManager.add(entity1, CollisionManager.PLAYER);
            collisionManager.add(entity2, CollisionManager.FX);
            assertCollisionDidNotOccur();
        });


        it('bullet and fx', function () {
            collisionManager.add(entity1, CollisionManager.BULLETS);
            collisionManager.add(entity2, CollisionManager.FX);
            assertCollisionDidNotOccur();
        });

        function assertCollisionOccurred() {
            collisionManager.update(mockGameContainer);
            verify(entity1.destroy).wasCalledWith(mockGameContainer);
            verify(entity2.destroy).wasCalledWith(mockGameContainer);
        }

        function assertCollisionDidNotOccur() {
            collisionManager.update(mockGameContainer);
            verify(entity1.destroy).wasNotCalled();
            verify(entity2.destroy).wasNotCalled();
        }

    });

});