/**
 * Created by omnic on 12/25/2015.
 */

var AudioFx = require('./AudioFx');

var EffectsSubsystem = function () {
};

EffectsSubsystem.prototype.initialize = function (gameContainer) {
    gameContainer.events.subscribe('player-fire', function (event) {
        gameContainer.audio.play(AudioFx.WEAPON_FIRE);
    });
};

EffectsSubsystem.prototype.update = function () {
};

EffectsSubsystem.prototype.render = function () {
};

module.exports = EffectsSubsystem;