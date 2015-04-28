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

        it('should have a large shape', function () {
            stubScreenSize(100, 100);

            var shapeStub = OMD.test.globalStub(SpaceRocks.Shapes, 'asteroidLarge');
            var expectedShape = OMD.test.randomObject();
            shapeStub.returns(expectedShape);

            var actualAsteroid = SpaceRocks.AsteroidFactory.buildLarge();
            expect(buildEntityStub.calledOnce).to.equal(true);
            expect(buildEntityStub.firstCall.args[2]).to.equal(expectedShape);
        });

        it('should have a medium shape', function () {
            stubScreenSize(100, 100);

            var shapeStub = OMD.test.globalStub(SpaceRocks.Shapes, 'asteroidMedium');
            var expectedShape = OMD.test.randomObject();
            shapeStub.returns(expectedShape);

            var actualAsteroid = SpaceRocks.AsteroidFactory.buildMedium();
            expect(buildEntityStub.calledOnce).to.equal(true);
            expect(buildEntityStub.firstCall.args[2]).to.equal(expectedShape);
        });

        it('should have a small shape', function () {
            stubScreenSize(100, 100);

            var shapeStub = OMD.test.globalStub(SpaceRocks.Shapes, 'asteroidSmall');
            var expectedShape = OMD.test.randomObject();
            shapeStub.returns(expectedShape);

            var actualAsteroid = SpaceRocks.AsteroidFactory.buildSmall();
            expect(buildEntityStub.calledOnce).to.equal(true);
            expect(buildEntityStub.firstCall.args[2]).to.equal(expectedShape);
        });

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

        describe('spin behaviors', function () {

            it('should attach spin behavior to large asteroids', function () {
                var spinStub = OMD.test.globalStub(SpaceRocks.BehaviorFactory, 'buildSpin');
                var expectedBehavior = spinStub.returns(OMD.test.randomObject());
                spinStub.returns(expectedBehavior);
                var buildLarge = SpaceRocks.AsteroidFactory.buildLarge();

                expect(expectedEntity.addBehavior.calledOnce).to.equal(true);
                expect(expectedEntity.addBehavior.calledWith(expectedBehavior)).to.equal(true);

            });
            it('should attach spin behavior to medium asteroids', function () {
                var spinStub = OMD.test.globalStub(SpaceRocks.BehaviorFactory, 'buildSpin');
                var expectedBehavior = spinStub.returns(OMD.test.randomObject());
                spinStub.returns(expectedBehavior);
                var buildLarge = SpaceRocks.AsteroidFactory.buildMedium();

                expect(expectedEntity.addBehavior.calledOnce).to.equal(true);
                expect(expectedEntity.addBehavior.calledWith(expectedBehavior)).to.equal(true);

            });
            it('should attach spin behavior to small asteroids', function () {
                var spinStub = OMD.test.globalStub(SpaceRocks.BehaviorFactory, 'buildSpin');
                var expectedBehavior = spinStub.returns(OMD.test.randomObject());
                spinStub.returns(expectedBehavior);
                var buildLarge = SpaceRocks.AsteroidFactory.buildSmall();

                expect(expectedEntity.addBehavior.calledOnce).to.equal(true);
                expect(expectedEntity.addBehavior.calledWith(expectedBehavior)).to.equal(true);

            });
        });
    });

    function stubScreenSize(width, height) {
        stubScreenHeight.returns(width);
        stubScreenWidth.returns(height);
    }


});