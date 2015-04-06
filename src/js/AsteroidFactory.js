/**
 * Created by Eric on 4/5/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var VELOCITY_RANGE = 4.0;

    function getRandomPosition() {
        var random = new Random();
        var screenWidth = spaceRocks.Renderer.width();
        var screenHeight = spaceRocks.Renderer.height();

        pX = random.nextInteger(screenWidth);
        pY = random.nextInteger(screenHeight);
        return {x: pX, y: pY};
    }

    function createRandomVelocity() {
        var vX = (Math.random() * VELOCITY_RANGE) - (VELOCITY_RANGE / 2);
        var vY = (Math.random() * VELOCITY_RANGE) - (VELOCITY_RANGE / 2);
        return new spaceRocks.Point(vX, vY);
    }

    function createSpinBehavior() {
        var spinRate = Math.random() * 2;
        return function (entity) {
            var currentAngle = entity.rotation();
            entity.rotation(currentAngle + spinRate);
        }
    }

    function _build() {
        var position = getRandomPosition();
        var asteroidShape = spaceRocks.Shapes.asteroid();
        var asteroid = new spaceRocks.Entity(position.x, position.y, asteroidShape);
        asteroid.velocity = createRandomVelocity();
        asteroid.addBehavior(createSpinBehavior());
        return asteroid;
    }


    spaceRocks.AsteroidFactory = {
        build: _build
    }

    return spaceRocks;
})(SpaceRocks || {});