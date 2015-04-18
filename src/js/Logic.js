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

    function _spawnAsteroids(){
        var collisionGroup = spaceRocks.CollisionManager.ASTEROIDS_GROUP();
        for (var i = 0; i < 5; i++) {
            var asteroid = spaceRocks.AsteroidFactory.build();
            spaceRocks.EntityManager.addEntity(asteroid, collisionGroup);
        }
    }

    function _init() {
        spaceRocks.LevelManager.addObserver(_spawnPlayer);
        spaceRocks.LevelManager.addObserver(_spawnAsteroids);
    }

    spaceRocks.Logic = {
        init: _init
    };
    return spaceRocks;
})(SpaceRocks || {});