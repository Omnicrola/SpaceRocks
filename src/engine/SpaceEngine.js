/**
 * Created by omnic on 11/29/2015.
 */

var Delta = require('./Delta');
var Time = require('./Time');
var SubsystemManager = require('./SubsystemManager');

module.exports = (function () {
    var engine = function () {
        var time = new Time();
        console.log(Time);
        this._delta = new Delta({
            time: time,
            config: {
                fps: 0
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