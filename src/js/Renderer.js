/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var canvasContext;
    var lineFunc = function (x1, y1, x2, y2) {
        canvasContext.strokeStyle = '#FFFFFF';
        canvasContext.beginPath();
        canvasContext.moveTo(x1 | 0, y1 | 0);
        canvasContext.lineTo(x2 | 0, y2 | 0);
        canvasContext.stroke();
    };
    var fillRectFunc = function (style, x, y, w, h) {
        canvasContext.fillStyle = style;
        canvasContext.fillRect(x, y, w, h);
    };
    var setCanvasFunc = function (newContext) {
        canvasContext = newContext;
    };
    spaceRocks.Renderer = {
        drawLine: lineFunc,
        fillRectangle: fillRectFunc,
        setCanvas: setCanvasFunc,
        width: function () {
            return canvasContext.canvas.width;
        },
        height: function () {
            return canvasContext.canvas.height;
        }
    };
    return spaceRocks;
})(SpaceRocks || {});