/**
 * Created by omnic on 12/25/2015.
 */

var AudioFx = require('./AudioFx');
var Entity = require('../entities/Entity');

var EffectsSubsystem = function () {
};

EffectsSubsystem.prototype.initialize = function (gameContainer) {

    gameContainer.events.subscribe('player-fire', function (event) {
        gameContainer.audio.play(AudioFx.WEAPON_FIRE);
    });

    gameContainer.events.subscribe('entity-death', function (event) {
        if (event.data === Entity.Type.ASTEROID ||
            event.data === Entity.Type.PLAYER) {
            gameContainer.audio.play(AudioFx.EXPLOSION);
        }
        console.log('entity death: ' + event.data);
    });
};

EffectsSubsystem.prototype.update = function () {
};

EffectsSubsystem.prototype.render = function () {
};

module.exports = EffectsSubsystem;