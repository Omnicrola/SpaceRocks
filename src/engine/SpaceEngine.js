/**
 * Created by omnic on 11/29/2015.
 */

var Delta = require('./Delta');
var Time = require('./Time');
var SubsystemManager = require('./SubsystemManager');
var Renderer = require('./Renderer');

module.exports = (function () {
    var engine = function (config) {
        this._delta = _createDelta();
        this._subsystemManager = new SubsystemManager();
        this._renderer = new Renderer(_getCanvas(config.canvas));
        _addSubsystems.call(this, config.subsystems);
    };

    function _createDelta() {
        return new Delta({
            time: new Time(),
            config: {
                fps: 24
            }
        });
    }

    function _addSubsystems(subsystems) {
        var subsystemManager = this._subsystemManager;
        if (subsystems) {
            subsystems.forEach(function (singleSystem) {
                subsystemManager.addSubsystem(singleSystem);
            });
        }
    }

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
        window.setInterval(cycle.bind(this), 1000 / 24);
    };

    function cycle() {
        var interval = this._delta.getInterval();
        this._subsystemManager.update(interval);
        this._renderer.clearCanvas('#000000');
        this._subsystemManager.render(this._renderer);

    }

    return engine;
})();