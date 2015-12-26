/**
 * Created by Eric on 12/15/2015.
 */
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var GameContainerGenerator = require('../../mocks/GameContainer');

var Entity = require('../../../src/subsystems/entities/Entity');
var Shape = require('../../../src/subsystems/entities/Shape');
var Point = require('../../../src/subsystems/entities/Point');
var EntityFactory = require('../../../src/subsystems/entities/EntityFactory');

describe('EntityFactory', function () {
    var mockGameContainer;
    beforeEach(function () {
        mockGameContainer = GameContainerGenerator.create();
    });

    describe('Bullets', function () {
        it('should build with correct position, velocity, and shape', function () {
            var expectedVelocity = new Point(Math.random(), Math.random());
            var expectedPosition = new Point(Math.random(), Math.random());
            var expectedShape = new Shape([
                new Point(0, 0),
                new Point(1, 0)
            ]);

            var bullet = EntityFactory.buildBullet(expectedPosition, expectedVelocity);
            checkEntity(bullet, expectedPosition, expectedVelocity, expectedShape, Entity.Type.BULLET);
        });

        it('should self-terminate after one second', function () {
            var bullet = EntityFactory.buildBullet(new Point(0, 0), new Point(0, 0));
            var mockBullet = spies.createStubInstance(Entity);
            assert.equal(1, bullet._behaviors.length);
            var selfDestructBehavior = bullet._behaviors[0];

            mockGameContainer.delta = 1.0;
            selfDestructBehavior(mockGameContainer, mockBullet);

            mockGameContainer.delta = 28.9
            selfDestructBehavior(mockGameContainer, mockBullet);
            verify(mockBullet.destroy).wasNotCalled();

            mockGameContainer.delta = 0.5;
            selfDestructBehavior(mockGameContainer, mockBullet);
            verify(mockBullet.destroy).wasCalledWith(mockGameContainer);
        });

        it('death of one bullet should not affect another', function () {
            var bullet1 = EntityFactory.buildBullet(new Point(0, 0), new Point(0, 0));
            var bullet2 = EntityFactory.buildBullet(new Point(0, 0), new Point(0, 0));

            mockGameContainer.delta = 50;
            bullet1.update(mockGameContainer);
            assert.isFalse(bullet1.isAlive);
            assert.isTrue(bullet2.isAlive);
        });
    });

    describe('Player', function () {
        it('should have the correct position, velocity, and shape', function () {
            var expectedPosition = new Point(Math.random(), Math.random());
            var expectedShape = createPlayerShape();
            var expectedVelocity = new Point(0, 0);

            var player = EntityFactory.buildPlayer(expectedPosition);
            assert.equal(0, player.rotation);
            checkEntity(player, expectedPosition, expectedVelocity, expectedShape, Entity.Type.PLAYER);
        });

        it('should not have any behaviors', function () {
            var player = EntityFactory.buildPlayer(new Point(0, 0));
            assert.equal(0, player._behaviors.length);
        });
    });

    describe('Asteroid', function () {
        it('should have the correct shape', function () {
            var asteroid = EntityFactory.buildAsteroid({width: 100, height: 100});
            var expectedShape = new Shape([
                new Point(-20, 60),
                new Point(50, 20),
                new Point(40, -30),
                new Point(-10, -40),
                new Point(-50, -10),
                new Point(-40, 50)
            ]);

            checkShape(expectedShape, asteroid._shape);
            assert.equal(Entity.Type.ASTEROID, asteroid._type);
        });

        it('should generate a position within a specified range', function () {
            var maxX = Math.random() * 1000;
            var maxY = Math.random() * 1000;
            var config = {width: maxX, height: maxY};

            for (var i = 0; i < 100; i++) {
                var asteroid = EntityFactory.buildAsteroid(config);
                var position = asteroid.position;
                checkRange(position.x, 0, maxX);
                checkRange(position.y, 0, maxY);
            }
        });

        it('should generate a random velocity', function () {
            var config = {width: 10, height: 10};

            for (var i = 0; i < 100; i++) {
                var asteroid = EntityFactory.buildAsteroid(config);
                var velocity = asteroid.velocity;
                checkRange(velocity.x, -2, 2);
                checkRange(velocity.y, -2, 2);
            }
        });

        it('should rotate slowly', function () {
            var config = {width: 10, height: 10};

            var asteroid = EntityFactory.buildAsteroid(config);
            assert.equal(1, asteroid._behaviors.length);
            var rotationBehavior = asteroid._behaviors[0];

            var startingRotation = Math.random();
            asteroid.rotation = startingRotation;
            mockGameContainer.delta = 1.0;
            rotationBehavior(mockGameContainer, asteroid);

            var newRotation = asteroid.rotation;
            expect(newRotation - startingRotation).to.be.within(-2, 2);

        });
    });


    function checkEntity(actualEntity, expectedPosition, expectedVelocity, expectedShape, expectedType) {
        assert.isTrue(actualEntity instanceof Entity, 'Should use the "Entity" prototype');
        checkPoint(expectedPosition, actualEntity.position);
        checkPoint(expectedVelocity, actualEntity.velocity);
        assert.equal(expectedType, actualEntity._type);

        checkShape(expectedShape, actualEntity._shape);
    }

    function checkRange(actual, min, max) {
        if (actual < min || actual > max) {
            throw new Error(actual + ' is not between ' + min + ' and ' + max);
        }
    }

    function checkShape(expectedShape, actualShape) {
        assert.isTrue(actualShape instanceof Shape, 'Should use the "Shape" prototype');
        assert.equal(expectedShape._points.length, actualShape._points.length, 'Should have same number of points');
        for (var i = 0; i < expectedShape._points.length; i++) {
            checkPoint(expectedShape._points[i], actualShape._points[i]);
        }
    }

    function checkPoint(expectedPoint, actualPoint) {
        if (expectedPoint.x !== actualPoint.x || expectedPoint.y !== actualPoint.y) {
            throw new Error('Points did not match. Expected ' +
                expectedPoint.toString() +
                '\n but got: ' + actualPoint.toString());
        }
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