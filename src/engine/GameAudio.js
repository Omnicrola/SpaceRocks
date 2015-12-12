/**
 * Created by Eric on 12/12/2015.
 */
module.exports = (function () {
    var audio = function (settings) {
        this._basePath = settings.basePath;
    };
    audio.prototype.play = function (filename) {
        var filePath = this._basePath + filename + '.wav';
        new Audio(filePath).play();
    };
    return audio;
})();