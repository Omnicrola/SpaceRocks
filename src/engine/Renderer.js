/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {
    var renderer = function (canvasContext) {
        this._canvasContext = canvasContext;
    };
    renderer.prototype.setColor = function () {

    };
    renderer.prototype.drawLine = function (x1, y1, x2, y2) {
        this._canvasContext.beginPath();
        this._canvasContext.moveTo(x1, y1);
        this._canvasContext.lineTo(x2, y2);
        this._canvasContext.stroke();

    };

    return renderer;
})();