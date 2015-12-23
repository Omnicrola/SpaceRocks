/**
 * Created by Eric on 12/19/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

var Shape = require('../../../src/subsystems/entities/Shape');
var Point = require('../../../src/subsystems/entities/Point');
var Entity = require('../../../src/subsystems/entities/Entity');
var CollisionManager = require('../../../src/subsystems/entities/CollisionManager');

describe('CollisionManager', function () {
    var collisionManager;
    beforeEach(function () {
        collisionManager = new CollisionManager();
    });

    describe('entities colliding', function () {
        var stubShape1;
        var stubEntity1;
        var stubShape2;
        var stubEntity2;

        beforeEach(function () {
            stubShape1 = spies.createStub(new Shape());
            stubShape2 = spies.createStub(new Shape());
            stubEntity1 = new Entity(stubShape1);
            stubEntity2 = new Entity(stubShape2);
            stubEntity1.isAlive = true;
            stubEntity2.isAlive = true;
            collisionManager.add(stubEntity1, CollisionManager.ASTEROID);
            collisionManager.add(stubEntity2, CollisionManager.PLAYER);

        });

        it('should not destroy entities if they do not intersect', function () {
            stubShape1.intersects.returns(false);
            stubShape2.intersects.returns(false);

            collisionManager.update();
            expect(stubEntity1.isAlive).to.be.true;
            expect(stubEntity2.isAlive).to.be.true;
        });

        it('should not test entities in the same group against each other', function () {
            collisionManager = new CollisionManager();
            collisionManager.add(stubEntity1, CollisionManager.ASTEROID);
            collisionManager.add(stubEntity2, CollisionManager.ASTEROID);

            collisionManager.update();
            verify(stubShape1.intersects).wasNotCalled();
            verify(stubShape2.intersects).wasNotCalled();
            assert.isTrue(stubEntity1.isAlive);
            assert.isTrue(stubEntity2.isAlive);
        });

        it('should not collide an entity with itself', function () {
            collisionManager = new CollisionManager();
            collisionManager.add(stubEntity1, CollisionManager.PLAYER);
            stubShape1.intersects.returns(true);

            collisionManager.update();
            verify(stubShape1.intersects).wasNotCalled();
            expect(stubEntity1.isAlive).to.be.true;
        });

        it('should destroy both entities if they intersect', function () {
            stubShape1.intersects.returns(true);

            collisionManager.update();
            expect(stubEntity1.isAlive).to.be.false;
            expect(stubEntity2.isAlive).to.be.false;
        });

        it('will not destroy entities if one is already destroyed', function () {
            stubShape1.intersects.returns(true);
            stubShape2.intersects.returns(true);
            stubEntity1.isAlive = false;

            collisionManager.update();
            expect(stubEntity1.isAlive).to.be.false;
            expect(stubEntity2.isAlive).to.be.true;
        });

        it('will remove entities that are destroyed', function () {
            stubEntity1.isAlive = false;
            stubEntity2.isAlive = false;

            collisionManager.update();
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

    describe('group collision masking', function () {
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
            collisionManager.update();
            expect(entity1.isAlive).to.be.false;
            expect(entity2.isAlive).to.be.false;
        }

        function assertCollisionDidNotOccur() {
            collisionManager.update();
            expect(entity1.isAlive).to.be.true;
            expect(entity2.isAlive).to.be.true;
        }

    });

});