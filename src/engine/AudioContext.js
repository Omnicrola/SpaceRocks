/**
 * Created by Eric on 1/10/2016.
 */

var AudioContext = null;
try {
    AudioContext = window.AudioContext || window.webkitAudioContext;
}
catch (e) {
    throw new Error('Web Audio API is not supported in this browser');
}

module.exports = AudioContext;