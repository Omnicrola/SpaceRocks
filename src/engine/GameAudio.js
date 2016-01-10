/**
 * Created by Eric on 12/12/2015.
 */

var AudioBufferLoader = require('./AudioBufferLoader');
var AudioContext = require('./AudioContext');
var AudioFx = require('../subsystems/fx/AudioFx');

var GameAudio = function (config) {
    this.audioContext = new AudioContext();
    var self = this;
    var files = getFiles();
    AudioBufferLoader.load({
        context: this.audioContext,
        files: fullPath(config.basePath, files),
        complete: function (buffers) {
            mapBuffers.call(self, files, buffers);
        }
    });
};
function mapBuffers(files, audioBuffers) {
    if (files.length !== audioBuffers.length) {
        throw new Error('Audio buffer count mismatch. Expected ' + files.length + ' but got' + audioBuffers.length);
    }
    this.buffers = [];
    for (var i = 0; i < files.length; i++) {
        this.buffers[files[i]] = audioBuffers[i];
    }
}
function getFiles() {
    return [
        AudioFx.EXPLOSION,
        AudioFx.WEAPON_FIRE
    ];
}
function fullPath(basePath, files) {
    return files.map(function (file) {
        return basePath + file + '.wav';
    });

}
GameAudio.prototype.play = function (soundName) {
    var source1 = this.audioContext.createBufferSource();
    source1.buffer = this.buffers[soundName];
    source1.connect(this.audioContext.destination);
    source1.start();
};
module.exports = GameAudio;
