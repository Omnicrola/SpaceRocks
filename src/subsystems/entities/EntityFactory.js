/**
 * Created by Eric on 12/15/2015.
 */

var Entity = require('./Entity');
var Shape = require('./Shape');
var Point = require('./Point');
var Debug = require('../../Debug');

module.exports = (function () {

    function _buildBullet(position, velocity) {
        var bullet = new Entity(new Shape([
            new Point(0, 0),
            new Point(1, 0)
        ]));
        bullet.position = position;
        bullet.velocity = velocity;
        var lifetime = 30;
        bullet.addBehavior(function (delta, entity) {
            lifetime -= delta;
            if (lifetime <= 0) {
                entity.isAlive = false;
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
        ]));
        player.position = position;
        return player;
    }

    function _buildAsteroid(config) {
        var asteroid = new Entity(new Shape([
            new Point(-20, 60),
            new Point(50, 20),
            new Point(40, -30),
            new Point(-10, -40),
            new Point(-50, -10),
            new Point(-40, 50)
        ]));
        var x = Math.random() * config.width;
        var y = Math.random() * config.height;
        asteroid.position = new Point(x, y);
        var vX = (Math.random() * 2) - 2;
        var vY = (Math.random() * 2) - 2;
        asteroid.velocity = new Point(vX, vY);
        asteroid.addBehavior(function (delta, entity) {
            entity.rotation += 2;
        });
        return asteroid;
    }

    var entityFactory = {};
    Object.defineProperties(entityFactory, {
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
        buildAsteroid: {
            value: _buildAsteroid,
            writeable: false,
            enumerable: true
        }
    });
    return entityFactory

})();