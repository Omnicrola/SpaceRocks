/**
 * Created by omnic on 11/29/2015.
 */

var DEBUG = require('../Debug');
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
        this._delta = _createDelta(config);
        this._subsystemManager = new SubsystemManager();
        this._input = new GameInput();
        this._audio = new GameAudio({basePath: config.audioPath});
        this._canvas = _getCanvas(config.canvas);
        this._renderer = new Renderer(this._canvas);
        this._eventHandler = new GameEventHandler();
        _addSubsystems.call(this, config.subsystems);
        _finishLoading.call(this);
    };

    function _createDelta(config) {
        return new Delta({
            time: new Time(),
            config: {
                fps: config.fps
            }
        });
    }

    function _addSubsystems(subsystems) {
        var subsystemManager = this._subsystemManager;
        if (subsystems) {
            var gameContainer = _createGameContainer.call(this, {delta: 1.0, milliseconds: 0});
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
        window.setInterval(cycle.bind(this), 1000 / 60);
    };

    function cycle() {
        var interval = this._delta.getInterval();
        var gameContainer = _createGameContainer.call(this, interval);
        _toggleDebug(gameContainer);
        this._eventHandler.process();
        this._subsystemManager.update(gameContainer);
        this._renderer.clearCanvas('#000000');
        this._subsystemManager.render(this._renderer);
        DEBUG.display.frametime = interval.milliseconds;
        DEBUG.render(this._renderer);
    }

    function _toggleDebug(gameContainer) {
        // key 200 is "\"
        if (gameContainer.input.isPressed(220)) {
            DEBUG.isDebugging = !DEBUG.isDebugging;

        }
    }

    function _createGameContainer(interval) {
        var width = this._canvas.canvas.width;
        var height = this._canvas.canvas.height;
        return {
            delta: interval.delta,
            timeSinceLastFrame: interval.milliseconds,
            input: this._input,
            audio: this._audio,
            display: {
                width: width,
                height: height
            },
            events: {
                emit: this._eventHandler.addEvent,
                subscribe: this._eventHandler.subscribe,
                unsubscribe: this._eventHandler.unsubscribe
            }
        };
    }

    return engine;
})();