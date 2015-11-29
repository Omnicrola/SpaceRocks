/**
 * Created by omnic on 11/29/2015.
 */
var Renderer = require('../../src/engine/Renderer');
var verify = require('../TestVerification');
var spies = require('../TestSpies');

describe('Renderer', function () {
    var renderer;
    var mockCanvasContext;
    beforeEach(function () {
        mockCanvasContext = createMockCanvasContext();
        renderer = new Renderer(mockCanvasContext);
    });

    it('can draw a line', function () {

        var expectedColor = '#FF00FF';
        var x1 = Math.random();
        var y1 = Math.random();
        var x2 = Math.random();
        var y2 = Math.random();

        renderer.setColor(expectedColor);
        renderer.drawLine(x1, y1, x2, y2);

        verify(mockCanvasContext.beginPath).wasCalled();
        verify(mockCanvasContext.moveTo).wasCalledWith(x1, y1);
        verify(mockCanvasContext.lineTo).wasCalledWith(x2, y2);
        verify(mockCanvasContext.stroke).wasCalled();
        verify([
            mockCanvasContext.beginPath,
            mockCanvasContext.moveTo,
            mockCanvasContext.lineTo,
            mockCanvasContext.stroke
        ]).whereCalledInOrder();

    });

    function createMockCanvasContext() {
        return spies.createComplex([
            'beginPath',
            'moveTo',
            'stroke',
            'fillRect',
            'lineTo',
            'fillText'
        ]);
    }
});