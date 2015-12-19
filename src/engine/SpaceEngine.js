/**
 * Created by omnic on 11/29/2015.
 */

var Delta = require('./Delta');
var Time = require('./Time');
var SubsystemManager = require('./SubsystemManager');
var Renderer = require('./Renderer');
var GameInput = require('./GameInput');
var GameAudio = require('./GameAudio');
var GameEventHandler = require('./GameEventHandler');
var GameEvent = require('./GameEvent');

module.exports = (function () {
    var engine = function (config) {
        this._delta = _createDelta();
        this._subsystemManager = new SubsystemManager();
        this._input = new GameInput();
        this._audio = new GameAudio({basePath: config.audioPath});
        this._canvas = _getCanvas(config.canvas);
        this._renderer = new Renderer(this._canvas);
        this._eventHandler = new GameEventHandler();
        _addSubsystems.call(this, config.subsystems);
        _finishLoading.call(this);
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
            var gameContainer = _createGameContainer.call(this, 1.0);
            subsystems.forEach(function (singleSystem) {
                singleSystem.initialize(gameContainer);
                subsystemManager.addSubsystem(singleSystem);
            });
        }
    }

    function _finishLoading() {
        var startEvent = new GameEvent('engine-start', null);
        this._eventHandler.addEvent(startEvent);
    }

    function _getCanvas(canvasId) {
        var canvasElement = document.getElementById(canvasId);
        if (canvasElement) {
            return canvasElement.getContext('2d');
        } else {
            return {width: 0, height: 0};
        }
    }

    engine.prototype.start = function () {
        window.setInterval(cycle.bind(this), 1000 / 24);
    };

    function cycle() {
        var interval = this._delta.getInterval();
        var gameContainer = _createGameContainer.call(this, interval);
        this._eventHandler.process();
        this._subsystemManager.update(gameContainer);
        this._renderer.clearCanvas('#000000');
        this._subsystemManager.render(this._renderer);

    }

    function _createGameContainer(interval) {
        var width = this._canvas.canvas.width;
        var height = this._canvas.canvas.height;
        return {
            delta: interval,
            input: this._input,
            audio: this._audio,
            display: {
                width: width,
                height: height
            },
            events: {
                emit: this._eventHandler.addEvent,
                subscribe: this._eventHandler.subscribe
            }
        };
    }

    return engine;
})();