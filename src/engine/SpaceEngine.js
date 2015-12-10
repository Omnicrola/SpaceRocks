/**
 * Created by omnic on 11/29/2015.
 */

var Delta = require('./Delta');
var Time = require('./Time');
var SubsystemManager = require('./SubsystemManager');
var Renderer = require('./Renderer');

module.exports = (function () {
    var engine = function (options) {
        this._delta = new Delta({
            time: new Time(),
            config: {
                fps: 24
            }
        });
        this._subsystemManager = new SubsystemManager();
        this._renderer = new Renderer(_getCanvas(options.canvas));
    };

    function _getCanvas(canvasId) {
        var canvasElement = document.getElementById(canvasId);
        if (canvasElement) {
            return canvasElement.getContext('2d');
        }
        else {
            return null;
        }
    }

    engine.prototype.start = function () {
        window.setInterval(this.cycle, 1000 / 24);
    };

    engine.prototype.cycle = function () {
        var interval = this._delta.getInterval();
        this._subsystemManager.update(interval);
        this._renderer.clearCanvas('#000000');
        this._subsystemManager.render(this._renderer);
    };

    return engine;
})();