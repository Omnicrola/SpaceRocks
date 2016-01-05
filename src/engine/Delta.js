/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {

    var delta = function (options) {
        this._time = options.time;
        this._config = options.config;
        this._lastFrame = 0;
    };

    delta.prototype.getInterval = function () {
        var currentTime = this._time.getCurrentTime();
        var elapsed = currentTime - this._lastFrame;
        var delta = elapsed / (1000 / this._config.fps);
        this._lastFrame = currentTime;
        delta = Math.min(10, delta);
        return {delta: delta, milliseconds: elapsed};
    };

    return delta;
})();