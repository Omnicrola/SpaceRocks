/**
 * Created by Eric on 1/9/2016.
 */

var Util = require('../Util');

module.exports = {
    load: function (config) {
        var finishedBuffers = createEmptyArray(config.files.length);
        config.files.forEach(function (file, index) {
            requestFile(config, finishedBuffers, file, index);
        });
    }
};

function requestFile(config, finishedBuffers, file, index) {
    Util.Ajax
        .getBuffer(file)
        .onSuccess(function (data) {
            config.context.decodeAudioData(data, function (buffer) {
                finishedBuffers[index] = buffer;
                if (allBuffersFinished(finishedBuffers)) {
                    config.complete(finishedBuffers);
                }
            });
        })
        .send();
}

function allBuffersFinished(buffers) {
    var unfinished = buffers.reduce(function (cumulativeValue, buffer) {
        var addValue = (buffer) ? 0 : 1;
        return cumulativeValue + addValue;
    }, 0);
    if (unfinished > 0) {
        return false;
    } else {
        return true;
    }
}

function createEmptyArray(length) {
    var arr = [];
    for (var i = 0; i < length; i++) {
        arr.push(false);
    }
    return arr;
}