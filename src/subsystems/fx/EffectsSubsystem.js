/**
 * Created by omnic on 12/25/2015.
 */

var AudioFx = require('./AudioFx');
var Entity = require('../entities/Entity');
var EntityFactory = require('../entities/EntityFactory');

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
        if (type === Entity.Type.ASTEROID ||
            type === Entity.Type.PLAYER) {
            gameContainer.audio.play(AudioFx.EXPLOSION);
            _createParticles.call(self, event.data.position);
        }
        console.log('entity death: ' + type);
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
        entitySubsystem.addEntity(newParticle);
    });
}

EffectsSubsystem.prototype.update = function () {
};

EffectsSubsystem.prototype.render = function () {
};

module.exports = EffectsSubsystem;