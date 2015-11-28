/**
 * Created by Eric on 4/7/2015.
 */
var SpaceRocks = (function (spaceRocks) {


    function _spawnPlayer() {
        var pX = spaceRocks.Renderer.width() / 2;
        var pY = spaceRocks.Renderer.height() / 2;
        var player = spaceRocks.Entity.build(pX, pY, spaceRocks.Shapes.player());
        spaceRocks.EntityManager.player(player);
    }

    function _spawnAsteroids() {
        var collisionGroup = spaceRocks.CollisionManager.ASTEROIDS_GROUP();
        for (var i = 0; i < 5; i++) {
            var asteroid = spaceRocks.AsteroidFactory.buildLarge();
            spaceRocks.EntityManager.addEntity(asteroid, collisionGroup);
        }
    }

    function _init() {
        spaceRocks.LevelManager.addObserver(spaceRocks.Logic.spawnPlayer);
        spaceRocks.LevelManager.addObserver(_spawnAsteroids);
    }

    function _registerEvent(options) {
        window.setTimeout(options.event, options.delay);
    }

    spaceRocks.Logic = {
        init: _init,
        spawnPlayer : _spawnPlayer,
        registerEvent: _registerEvent
    };
    return spaceRocks;
})(SpaceRocks || {});