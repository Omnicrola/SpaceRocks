/**
 * Created by Eric on 4/5/2015.
 */
describe('Asteroid Factory', function () {
    var stubScreenWidth;
    var stubScreenHeight;
    var buildEntityStub;
    var expectedEntity;
    beforeEach(function (done) {
        stubScreenWidth = OMD.test.globalStub(SpaceRocks.Renderer, 'width');
        stubScreenHeight = OMD.test.globalStub(SpaceRocks.Renderer, 'height');
        buildEntityStub = OMD.test.globalStub(SpaceRocks.Entity, 'build');
        expectedEntity = sinon.stub(new SpaceRocks.Entity());
        buildEntityStub.returns(expectedEntity);
        done();
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });

    describe('shapes of asteroids', function () {

        beforeEach(function () {
            stubScreenSize(100, 100);
        });

        it('should have a large shape', function () {
            var expectedShape = stubShape('asteroidLarge');
            var actualAsteroid = SpaceRocks.AsteroidFactory.buildLarge();
            expectShapePassedToFactory(expectedShape, actualAsteroid);
        });
        it('should have a medium shape', function () {
            var expectedShape = stubShape('asteroidMedium');
            var actualAsteroid = SpaceRocks.AsteroidFactory.buildMedium();
            expectShapePassedToFactory(expectedShape, actualAsteroid);
        });
        it('should have a small shape', function () {
            var expectedShape = stubShape('asteroidSmall');
            var actualAsteroid = SpaceRocks.AsteroidFactory.buildSmall();
            expectShapePassedToFactory(expectedShape, actualAsteroid);
        });

        function expectShapePassedToFactory(expectedShape, actualAsteroid) {
            expect(buildEntityStub.calledOnce).to.equal(true);
            expect(buildEntityStub.firstCall.args[2]).to.equal(expectedShape);
        }

        function stubShape(shapeName) {
            var shapeStub = OMD.test.globalStub(SpaceRocks.Shapes, shapeName);
            var expectedShape = OMD.test.randomObject();
            shapeStub.returns(expectedShape);
            return expectedShape;
        }
    });

    it('should create an asteroid at a random position', function () {
        var screenWidth = 500;
        var screenHeight = 500;
        stubScreenSize(screenWidth, screenHeight);
        var asteroidFactory = SpaceRocks.AsteroidFactory;

        var firstAsteroid = asteroidFactory.buildLarge();

        expect(firstAsteroid.position.x).to.be.within(0, screenWidth);
        expect(firstAsteroid.position.y).to.be.within(0, screenHeight);
    });

    it('should create an asteroid with random velocity', function () {
        stubScreenSize(500, 500);
        var asteroidFactory = SpaceRocks.AsteroidFactory;

        var singleAsteroid = asteroidFactory.buildLarge();

        expect(singleAsteroid.velocity.x).to.be.within(-2, 2);
        expect(singleAsteroid.velocity.y).to.be.within(-2, 2);
    });

    describe('adding behaviors', function () {
        describe('spawn on death behaviors', function () {

            it('should attach spawn behavior to large asteroids', function () {
                var spawnMediumStub = OMD.test.globalStub(SpaceRocks.BehaviorFactory, 'buildSpawnMediumAsteroids');
                var expectedBehavior = OMD.test.randomObject();
                spawnMediumStub.returns(expectedBehavior);

                var largeAsteroid = SpaceRocks.AsteroidFactory.buildLarge();
                expectBehaviorOnEntity(largeAsteroid, expectedBehavior);
            });

            it('should attach spawn behavior to medium asteroids', function () {
                var spawnSmallStub = OMD.test.globalStub(SpaceRocks.BehaviorFactory, 'buildSpawnSmallAsteroids');
                var expectedBehavior = OMD.test.randomObject();
                spawnSmallStub.returns(expectedBehavior);

                var mediumAsteroid = SpaceRocks.AsteroidFactory.buildMedium();
                expectBehaviorOnEntity(mediumAsteroid, expectedBehavior);
            });

            function expectBehaviorOnEntity(actualEntity, expectedBehavior) {
                expect(actualEntity).to.equal(expectedEntity);
                expect(expectedEntity.addDeathBehavior.calledWith(expectedBehavior)).to.equal(true);
            }
        });

        describe('spin behaviors', function () {

            var spinStub;
            var expectedBehavior;
            beforeEach(function () {
                spinStub = OMD.test.globalStub(SpaceRocks.BehaviorFactory, 'buildSpin');
                expectedBehavior = OMD.test.randomObject();
                spinStub.returns(expectedBehavior);
            });

            it('should attach spin behavior to large asteroids', function () {
                var largeAsteroid = SpaceRocks.AsteroidFactory.buildLarge();
                expectBehaviorOnEntity(largeAsteroid);
            });


            it('should attach spin behavior to medium asteroids', function () {
                var mediumAsteroid = SpaceRocks.AsteroidFactory.buildMedium();
                expectBehaviorOnEntity(mediumAsteroid);
            });

            it('should attach spin behavior to small asteroids', function () {
                var smallAsteroid = SpaceRocks.AsteroidFactory.buildSmall();
                expectBehaviorOnEntity(smallAsteroid);
            });

            function expectBehaviorOnEntity(actualEntity) {
                expect(actualEntity).to.equal(expectedEntity);
                expect(expectedEntity.addBehavior.calledWith(expectedBehavior)).to.equal(true);
            }
        });
    });

    function stubScreenSize(width, height) {
        stubScreenHeight.returns(width);
        stubScreenWidth.returns(height);
    }


});