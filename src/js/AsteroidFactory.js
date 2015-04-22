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

    function _createSpinBehavior() {
        var spinRate = Math.random() * 2;
        return function (entity) {
            var currentAngle = entity.rotation();
            entity.rotation(currentAngle + spinRate);
        }
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

    function _build() {
        var position = _getRandomPosition();
        var asteroidShape = spaceRocks.Shapes.asteroid();
        var asteroid = new spaceRocks.Entity(position.x, position.y, asteroidShape);
        asteroid.velocity = _createRandomVelocity();
        asteroid.addBehavior(_createSpinBehavior());
        asteroid.setDeathBehavior(_createDeathBehavior());
        return asteroid;
    }


    spaceRocks.AsteroidFactory = {
        build: _build
    }

    return spaceRocks;
})(SpaceRocks || {});