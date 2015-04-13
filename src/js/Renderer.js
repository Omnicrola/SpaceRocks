/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var canvasContext;

    function _lineFunc(x1, y1, x2, y2) {
        canvasContext.strokeStyle = '#FFFFFF';
        canvasContext.beginPath();
        canvasContext.moveTo(x1 | 0, y1 | 0);
        canvasContext.lineTo(x2 | 0, y2 | 0);
        canvasContext.stroke();
    }

    function _fillRectFunc(style, x, y, w, h) {
        canvasContext.fillStyle = style;
        canvasContext.fillRect(x, y, w, h);
    }

    function _drawText(x, y, text) {
        canvasContext.fillStyle = '#FFFFFF';
        canvasContext.font = '12px monospace';
        canvasContext.fillText(text, x, y);
    }

    function _setCanvasFunc(newContext) {
        canvasContext = newContext;
    }

    spaceRocks.Renderer = {
        drawLine: _lineFunc,
        fillRectangle: _fillRectFunc,
        setCanvas: _setCanvasFunc,
        drawText: _drawText,
        width: function () {
            return canvasContext.canvas.width;
        },
        height: function () {
            return canvasContext.canvas.height;
        }
    };
    return spaceRocks;
})(SpaceRocks || {});