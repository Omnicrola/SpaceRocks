/**
 * Created by Eric on 12/15/2015.
 */

var Entity = require('./Entity');
var Shape = require('./Shape');
var Point = require('./Point');
var Debug = require('../../Debug');


function _buildBullet(position, velocity) {
    var bullet = new Entity(new Shape([
        new Point(0, 0),
        new Point(1, 0)
    ]), 'bullet');
    bullet.position = position;
    bullet.velocity = velocity;
    var lifetime = 30;
    bullet.addBehavior(function (gameContainer, entity) {
        lifetime -= gameContainer.delta;
        if (lifetime <= 0) {
            entity.destroy(gameContainer);
        }
    });
    return bullet;
}

function _buildPlayer(position) {
    var player = new Entity(new Shape([
        new Point(-5, -5),
        new Point(0, -5),
        new Point(5, -5),
        new Point(0, 5),
    ]), 'player');
    player.position = position;
    return player;
}
function _buildMediumAsteroid(config) {
    var asteroid = new Entity(new Shape([
        new Point(-8, -10),
        new Point(6, -11),
        new Point(15, -5),
        new Point(14, -2),
        new Point(4, 0),
        new Point(14, 7),
        new Point(7, 13),
        new Point(-1, 9),
        new Point(-9, 13),
        new Point(-17, 3),
        new Point(-16, -4),
        new Point(-4, -4)
    ]), 'asteroid-medium');
    asteroid.position = new Point(config.x, config.y);
    _addRandomVelocity(asteroid);
    _rotateAsteroid(asteroid);
    return asteroid;
}

function _buildSmallAsteroid(config) {
    var asteroid = new Entity(new Shape([
        new Point(9, 3),
        new Point(4, 8),
        new Point(-2, 5),
        new Point(-5, 7),
        new Point(-8, 2),
        new Point(-5, 1),
        new Point(-7, -3),
        new Point(-3, -6),
        new Point(0, -3),
        new Point(4, -5),
        new Point(7, -3),
        new Point(4, 0)
    ]), 'asteroid-small');
    asteroid.position = new Point(config.x, config.y);
    _addRandomVelocity(asteroid);
    _rotateAsteroid(asteroid);
    return asteroid;
}

function _buildLargeAsteroid(config) {
    var asteroid = new Entity(new Shape([
        new Point(-10, -24),
        new Point(15, -24),
        new Point(29, -7),
        new Point(30, 5),
        new Point(15, 21),
        new Point(-1, 20),
        new Point(-1, 3),
        new Point(-15, 20),
        new Point(-30, 4),
        new Point(-17, -2),
        new Point(-30, -8)
    ]), 'asteroid-large');
    var x = Math.random() * config.width;
    var y = Math.random() * config.height;
    asteroid.position = new Point(0, 0);
    _addRandomVelocity(asteroid);
    _rotateAsteroid(asteroid);
    return asteroid;
}

function _addRandomVelocity(asteroid) {
    var vX = (Math.random() * 2) - 1;
    var vY = (Math.random() * 2) - 1;
    asteroid.velocity = new Point(vX, vY);
}
function _rotateAsteroid(asteroid) {
    var rotationRate = (Math.random() * 2) - 1;
    asteroid.addBehavior(function (delta, entity) {
        entity.rotation += rotationRate;
    });
}

function _buildParticles(config) {
    var particles = [];
    for (var c = 0; c < config.count; c++) {
        var particle = new Entity(new Shape([
            new Point(0, 0),
            new Point(1, 0)
        ]), 'fx');
        particle.position = config.position;
        particle.velocity = _particleVelocity(config);
        var lifetime = 0;
        particle.addBehavior(function (gameContainer, entity) {
            lifetime += gameContainer.delta;
            if (lifetime > config.duration) {
                entity.destroy(gameContainer);
            }
        });
        particles.push(particle);
    }
    return particles;
}

function _particleVelocity(config) {
    if (config.maxForce && config.minForce) {
        var velocity = (Math.random() * (config.maxForce - config.minForce)) + config.minForce;
        return new Point(0, velocity)
            .rotate(Math.random() * 360)
    } else if (config.direction && config.directionalSpread) {
        var spread = config.directionalSpread;
        var baseMagnitude = config.direction.magnitude();
        return config.direction
            .normalize()
            .scale(Math.random() * baseMagnitude)
            .rotate((Math.random() * spread * 2) - spread);
    }

}

var EntityFactory = {};
Object.defineProperties(EntityFactory, {
    buildBullet: {
        value: _buildBullet,
        writeable: false,
        enumerable: true
    },
    buildPlayer: {
        value: _buildPlayer,
        writeable: false,
        enumerable: true
    },
    buildLargeAsteroid: {
        value: _buildLargeAsteroid,
        writeable: false,
        enumerable: true
    },
    buildMediumAsteroid: {
        value: _buildMediumAsteroid,
        writeable: false,
        enumerable: true
    },
    buildSmallAsteroid: {
        value: _buildSmallAsteroid,
        writeable: false,
        enumerable: true
    },
    buildParticles: {
        value: _buildParticles,
        writeable: false,
        enumerable: true
    }
});
module.exports = EntityFactory;
