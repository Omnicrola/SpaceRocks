/**
 * Created by Eric on 4/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    function _buildSpawnMediumAsteroids() {
        var asteroidGroup = spaceRocks.CollisionManager.ASTEROIDS_GROUP();
        return function (entity) {
            var position = {x: entity.position.x, y: entity.position.y};
            var asteroid1 = spaceRocks.AsteroidFactory.buildMedium(position);
            var asteroid2 = spaceRocks.AsteroidFactory.buildMedium(position);
            spaceRocks.EntityManager.addEntity(asteroid1, asteroidGroup);
            spaceRocks.EntityManager.addEntity(asteroid2, asteroidGroup);
            asteroid1.position
        };
    }

    function _buildSpawnSmallAsteroids() {
        var asteroidGroup = spaceRocks.CollisionManager.ASTEROIDS_GROUP();
        return function (entity) {
            var position = {x: entity.position.x, y: entity.position.y};
            var asteroid1 = spaceRocks.AsteroidFactory.buildSmall(position);
            var asteroid2 = spaceRocks.AsteroidFactory.buildSmall(position);
            spaceRocks.EntityManager.addEntity(asteroid1, asteroidGroup);
            spaceRocks.EntityManager.addEntity(asteroid2, asteroidGroup);
        };
    }

    function _buildParticleSpawnBehavior() {
        var life = 10;
        var effectsGroup = spaceRocks.CollisionManager.EFFECTS_GROUP();
        return function (entity) {
            var p = entity.position;
            var particle1 = spaceRocks.ParticleFactory.build(p.x, p.y, 5, 5, life);
            var particle2 = spaceRocks.ParticleFactory.build(p.x, p.y, 5, -5, life);
            var particle3 = spaceRocks.ParticleFactory.build(p.x, p.y, -5, 5, life);
            var particle4 = spaceRocks.ParticleFactory.build(p.x, p.y, -5, -5, life);
            spaceRocks.EntityManager.addEntity(particle1, effectsGroup);
            spaceRocks.EntityManager.addEntity(particle2, effectsGroup);
            spaceRocks.EntityManager.addEntity(particle3, effectsGroup);
            spaceRocks.EntityManager.addEntity(particle4, effectsGroup);
        };
    }

    function _buildDespawnBehavior() {
        return function (entity) {
            spaceRocks.EntityManager.removeEntity(entity);
        };
    }

    function _buildRespawnPlayer() {
        return function () {
            spaceRocks.Logic.registerEvent({
                delay: 1000,
                event: function () {
                    spaceRocks.Logic.spawnPlayer();
                }
            });
        };
    }

    function _buildIncrementScore(scoreValue) {
        return function (entity) {
            spaceRocks.Gui.incrementScore(scoreValue);
        };
    }

    function _buildSelfDestruct(lifetime) {
        var life = 0;
        return function (entity, delta) {
            life += delta;
            if (life >= lifetime) {
                entity.destroy();
            }
        };
    }

    function _buildSpin(spinRate) {
        return function (entity, delta) {
            entity.rotation(spinRate * delta);
        };
    }

    spaceRocks.BehaviorFactory = {
        buildSpawnMediumAsteroids: _buildSpawnMediumAsteroids,
        buildSpawnSmallAsteroids: _buildSpawnSmallAsteroids,
        buildParticleSpawnBehavior: _buildParticleSpawnBehavior,
        buildIncrementScore: _buildIncrementScore,
        buildSelfDestruct: _buildSelfDestruct,
        buildSpin: _buildSpin,
        buildDespawnBehavior: _buildDespawnBehavior,
        buildRespawnPlayer: _buildRespawnPlayer
    };
    return spaceRocks;
})(SpaceRocks || {});