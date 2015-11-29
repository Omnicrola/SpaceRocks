/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {
    var timer = function () {

    };
    timer.prototype.getCurrentTime = function () {
        return new Date().getTime();
    }
    return timer;
})();