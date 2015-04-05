/**
 * Created by Eric on 4/5/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    function getRandomPosition() {
        var random = new Random();
        var screenWidth = spaceRocks.Renderer.width();
        var screenHeight = spaceRocks.Renderer.height();

        pX = random.nextInteger(screenWidth);
        pY = random.nextInteger(screenHeight);
        return {x: pX, y: pY};
    }

    function _build() {
        var position = getRandomPosition();
        var asteroidShape = spaceRocks.Shapes.asteroid();
        var asteroid = new spaceRocks.Entity(position.x, position.y, asteroidShape);
        return asteroid;
    }

    spaceRocks.AsteroidFactory = {
        build: _build
    }

    return spaceRocks;
})(SpaceRocks || {});