/**
 * Created by Eric on 4/5/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var VELOCITY_RANGE = 4.0;

    function _getRandomPosition() {
        var random = new Random();
        var screenWidth = spaceRocks.Renderer.width();
        var screenHeight = spaceRocks.Renderer.height();

        pX = random.nextInteger(screenWidth);
        pY = random.nextInteger(screenHeight);
        return {x: pX, y: pY};
    }

    function _createRandomVelocity() {
        var vX = (Math.random() * VELOCITY_RANGE) - (VELOCITY_RANGE / 2);
        var vY = (Math.random() * VELOCITY_RANGE) - (VELOCITY_RANGE / 2);
        return new spaceRocks.Point(vX, vY);
    }

    function _createDeathBehavior() {
        var score = 25;
        return function (entity) {
            spaceRocks.Gui.incrementScore(score);
            spawnParticles(entity.position);
        }
    }

    function spawnParticles(position) {
        spawnParticle(position.x, position.y, 5, 5);
        spawnParticle(position.x, position.y, 5, -5);
        spawnParticle(position.x, position.y, -5, 5);
        spawnParticle(position.x, position.y, -5, -5);
    }

    function spawnParticle(x, y, vX, vY) {
        var particle = spaceRocks.ParticleFactory.build(x, y, vX, vY, 10);
        spaceRocks.EntityManager.addEntity(particle, spaceRocks.CollisionManager.EFFECTS_GROUP());
    }

    function _buildAsteroid(shape, position) {
        position = position || _getRandomPosition();
        var asteroid = spaceRocks.Entity.build(position.x, position.y, shape);
        asteroid.velocity = _createRandomVelocity();
        asteroid.addBehavior(spaceRocks.BehaviorFactory.buildSpin(Math.random() * 2));
        asteroid.addDeathBehavior(_createDeathBehavior());
        return asteroid;
    }

    function _buildLarge() {
        var largeShape = spaceRocks.Shapes.asteroidLarge();
        var largeAsteroid = _buildAsteroid(largeShape);
        largeAsteroid.addDeathBehavior(spaceRocks.BehaviorFactory.buildSpawnMediumAsteroids());
        return largeAsteroid;
    }

    function _buildMedium(position) {
        var mediumShape = spaceRocks.Shapes.asteroidMedium();
        var mediumAsteroid = _buildAsteroid(mediumShape, position);
        mediumAsteroid.addDeathBehavior(spaceRocks.BehaviorFactory.buildSpawnSmallAsteroids());
        return mediumAsteroid;
    }

    function _buildSmall(position) {
        var smallShape = spaceRocks.Shapes.asteroidSmall();
        return _buildAsteroid(smallShape, position);
    }

    spaceRocks.AsteroidFactory = {
        buildLarge: _buildLarge,
        buildMedium: _buildMedium,
        buildSmall: _buildSmall
    }

    return spaceRocks;
})(SpaceRocks || {});