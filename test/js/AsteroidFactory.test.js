/**
 * Created by Eric on 4/5/2015.
 */
describe('Asteroid Factory', function () {
    var stubWidth;
    var stubHeight;
    beforeEach(function (done) {
        stubWidth = OMD.test.globalStub(SpaceRocks.Renderer, 'width');
        stubHeight = OMD.test.globalStub(SpaceRocks.Renderer, 'height');
        done();
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });

    it('should have an asteroid shape', function () {
        stubScreenSize(100, 100);

        var expectedShape = SpaceRocks.Shapes.asteroid();
        var oneHundredAsteroids = createOneHundredAsteroids();
        oneHundredAsteroids.forEach(function (oneAsteroid) {
            expect(oneAsteroid.shape).to.deep.equal(expectedShape);
        });

    });

    it('should create an asteroid at a random position', function () {
        stubScreenSize(500, 500);

        var asteroid1 = createOneAsteroid();
        var asteroid2 = createOneAsteroid();
        var asteroid3 = createOneAsteroid();
        var oneHundredAsteroids = createOneHundredAsteroids();
        oneHundredAsteroids.forEach(function (oneAsteroid) {
            expect(oneAsteroid.position).to.not.equal(asteroid1.position);
            expect(oneAsteroid.position).to.not.equal(asteroid2.position);
            expect(oneAsteroid.position).to.not.equal(asteroid3.position);
        });

    });

    it('should give each asteroid a random velocity', function () {
        var asteroid1 = createOneAsteroid();
        var asteroid2 = createOneAsteroid();
        var asteroid3 = createOneAsteroid();
        var oneHundredAsteroids = createOneHundredAsteroids();
        oneHundredAsteroids.forEach(function (oneAsteroid) {
            expect(oneAsteroid.velocity).to.not.equal(asteroid1.velocity);
            expect(oneAsteroid.velocity).to.not.equal(asteroid2.velocity);
            expect(oneAsteroid.velocity).to.not.equal(asteroid3.velocity);
            expect(oneAsteroid.velocity.x).to.be.within(-2, 2);
            expect(oneAsteroid.velocity.y).to.be.within(-2, 2);
        });

    });
    it('should give each asteroid a random spin', function () {
        var asteroid1 = createOneAsteroid();
        expect(asteroid1.behaviors.length).to.equal(1);
        var rotationBehavior = asteroid1.behaviors[0];

        var mockEntity = {
            rotation: sinon.stub()
        };
        mockEntity.rotation.returns(0);
        rotationBehavior(mockEntity);
        expect(mockEntity.rotation.calledTwice).to.equal(true);
        expect(mockEntity.rotation.firstCall.args.length).to.equal(0);

        var newAngle = mockEntity.rotation.secondCall.args[0];
        expect(newAngle).to.be.within(0.25,2.0);

        rotationBehavior(mockEntity);
        expect(mockEntity.rotation.getCalls().length).to.equal(4);
        expect(mockEntity.rotation.getCall(3).args[0]).to.equal(newAngle);
    });

    it('should not place an asteroid outside screen bounds', function () {
        var maxX = 500;
        var maxY = 300;
        stubHeight.returns(maxY);
        stubWidth.returns(maxX);

        for (var i = 0; i < 100; i++) {
            var asteroid = SpaceRocks.AsteroidFactory.build();
            expect(asteroid.position.x).to.be.within(0, maxX);
            expect(asteroid.position.y).to.be.within(0, maxY);
        }

    });

    function createOneHundredAsteroids() {
        var asteroids = [];
        for (var i = 0; i < 100; i++) {
            var asteroid = createOneAsteroid();
            asteroids.push(asteroid);
        }
        return asteroids;
    }

    function createOneAsteroid() {
        var asteroid = SpaceRocks.AsteroidFactory.build();
        return asteroid;
    }

    function stubScreenSize(width, height) {
        stubHeight.returns(width);
        stubWidth.returns(height);
    };


});