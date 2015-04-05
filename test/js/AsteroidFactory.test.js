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


    it('should not place an asteroid outside screen bounds', function () {
        var maxX = 500;
        var maxY = 300;
        stubHeight.returns(maxY);
        stubWidth.returns(maxX);

        for (var i = 0; i < 100; i++) {
            var asteroid = SpaceRocks.AsteroidFactory.build();
            expect(asteroid.position.x).to.be.above(-1);
            expect(asteroid.position.y).to.be.above(-1);
            expect(asteroid.position.x).to.be.below(maxX + 1);
            expect(asteroid.position.y).to.be.below(maxY + 1);
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