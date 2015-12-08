/**
 * Created by omnic on 11/29/2015.
 */

var Delta = require('./Delta');
var Time = require('./Time');
var SubsystemManager = require('./SubsystemManager');

module.exports = (function () {
    var engine = function () {
        this._delta = new Delta({
            time: new Time(),
            config: {
                fps: 24
            }
        });
        this._subsystemManager = new SubsystemManager();
    };

    engine.prototype.start = function () {
        window.setInterval(this.cycle, 1000 / 24);
    };

    engine.prototype.cycle = function () {
        var interval = this._delta.getInterval();
        this._subsystemManager.update(interval);
    };

    return engine;
})();