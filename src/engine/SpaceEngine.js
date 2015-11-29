/**
 * Created by omnic on 11/29/2015.
 */

module.exports = (function () {
    var engine = function () {
    };

    engine.prototype.start = function () {
        window.setInterval(function () {
        }, 1000 / 24);
    };
    return engine;
})();