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

    function _buildAsteroid(shape){
        var position = _getRandomPosition();
        var asteroid =  spaceRocks.Entity.build(position.x, position.y, shape);
        asteroid.velocity = _createRandomVelocity();
        asteroid.addBehavior(spaceRocks.BehaviorFactory.buildSpin(Math.random()*2));
        asteroid.setDeathBehavior(_createDeathBehavior());
        return asteroid;
    }
    function _buildLarge() {
        var largeShape = spaceRocks.Shapes.asteroidLarge();
        return _buildAsteroid(largeShape)
    }

    function _buildMedium(){
        var mediumShape = spaceRocks.Shapes.asteroidMedium();
        return _buildAsteroid(mediumShape)
    }

    function _buildSmall(){
        var smallShape = spaceRocks.Shapes.asteroidSmall();
        return _buildAsteroid(smallShape)
    }

    spaceRocks.AsteroidFactory = {
        buildLarge: _buildLarge,
        buildMedium: _buildMedium,
        buildSmall: _buildSmall
    }

    return spaceRocks;
})(SpaceRocks || {});