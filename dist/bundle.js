(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        return Math.min(10, delta);
    };

    return delta;
})();
},{}],2:[function(require,module,exports){
/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {
    var renderer = function (canvasContext) {
        this._canvasContext = canvasContext;
        this._color = '#FFFFFF';
        this._font = '12px monospace';
        this._canvasContext.fillStyle = this._color;
        this._canvasContext.strokeStyle = this._color;
        this._canvasContext.font = this._font;
    };

    renderer.prototype.setColor = function (newColor) {
        this._color = newColor;
    };

    renderer.prototype.setFont = function (newFont) {
        this._font = newFont;
    };

    renderer.prototype.drawText = function (x, y, text) {
        this._canvasContext.fillStyle = this._color;
        this._canvasContext.font = this._font;
        this._canvasContext.fillText(text, x, y);
    }

    renderer.prototype.fillRectangle = function (x, y, w, h) {
        this._canvasContext.fillStyle = this._color;
        this._canvasContext.fillRect(x, y, w, h);
    };

    renderer.prototype.drawLine = function (x1, y1, x2, y2) {
        this._canvasContext.strokeStyle = this._color;
        this._canvasContext.beginPath();
        this._canvasContext.moveTo(x1, y1);
        this._canvasContext.lineTo(x2, y2);
        this._canvasContext.stroke();

    };

    renderer.prototype.clearCanvas = function (color) {
        this._canvasContext.fillStyle = color;
        var w = this._canvasContext.width;
        var h = this._canvasContext.height;
        this._canvasContext.fillRect(0, 0, w, h);
    }


    return renderer;
})();
},{}],3:[function(require,module,exports){
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
        console.log(canvasId);
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
},{"./Delta":1,"./Renderer":2,"./SubsystemManager":4,"./Time":5}],4:[function(require,module,exports){
/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {
    var subsystemManager = function () {
        this._subsystems = [];
    };
    subsystemManager.prototype.addSubsystem = function (subsystem) {
        this._subsystems.push(subsystem);
    };
    subsystemManager.prototype.update = function (delta) {
        this._subsystems.forEach(function (subsystem) {
            subsystem.update(delta);
        });
    };

    subsystemManager.prototype.render = function (renderer) {
        this._subsystems.forEach(function (subsystem) {
            subsystem.render(renderer);
        });
    };
    return subsystemManager;
})();
},{}],5:[function(require,module,exports){
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
},{}]},{},[3])


//# sourceMappingURL=bundle.js.map
