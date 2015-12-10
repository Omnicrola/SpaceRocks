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
        var w = this._canvasContext.canvas.width;
        var h = this._canvasContext.canvas.height;
        this._canvasContext.fillRect(0, 0, w, h);
    }

    return renderer;
})();