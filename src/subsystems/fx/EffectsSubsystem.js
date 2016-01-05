/**
 * Created by omnic on 12/25/2015.
 */

var AudioFx = require('./AudioFx');
var Entity = require('../entities/Entity');
var EntityFactory = require('../entities/EntityFactory');
var CollisionManager = require('../entities/CollisionManager');

var EffectsSubsystem = function (entitySubsystem) {
    this._entitySubsystem = entitySubsystem;
};

EffectsSubsystem.prototype.initialize = function (gameContainer) {
    var self = this;
    gameContainer.events.subscribe('player-fire', function (event) {
        gameContainer.audio.play(AudioFx.WEAPON_FIRE);
    });

    gameContainer.events.subscribe('entity-death', function (event) {
        var type = event.data.type;
        if (type === 'asteroid-large' ||
            type === 'asteroid-medium' ||
            type === 'asteroid-small' ||
            type === 'player') {
            gameContainer.audio.play(AudioFx.EXPLOSION);
            _createParticles.call(self, event.data.position);
        }
    });

    gameContainer.events.subscribe('player-thrust', function (event) {
        var direction = event.data.direction.scale(-5);
        var particles = EntityFactory.buildParticles({
            count: 2,
            position: event.data.position,
            direction: direction,
            directionalSpread: 15,
            duration: 5
        });
        particles.forEach(function (particle) {
            self._entitySubsystem.addEntity(particle);
        });

    });
};

function _createParticles(position) {
    var entitySubsystem = this._entitySubsystem;
    var newParticles = EntityFactory.buildParticles({
        count: 4,
        position: position,
        duration: 50,
        minForce: 1,
        maxForce: 3
    });
    newParticles.forEach(function (newParticle) {
        entitySubsystem.addEntity(newParticle, CollisionManager.FX);
    });
}

EffectsSubsystem.prototype.update = function () {
};

EffectsSubsystem.prototype.render = function () {
};

module.exports = EffectsSubsystem;