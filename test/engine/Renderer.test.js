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

    it('defaults color to white', function () {
        assert.equal('#FFFFFF', mockCanvasContext.strokeStyle);
        assert.equal('#FFFFFF', mockCanvasContext.fillStyle);
    });

    it('defaults font to 12px monospaced', function () {
        assert.equal('12px monospace', mockCanvasContext.font);
    });

    it('can set the color', function () {
        var expectedColor = '#028244';

        renderer.setColor(expectedColor);
        renderer.drawLine(0, 0, 1, 1);
        renderer.fillRectangle(0, 0, 1, 1);

        assert.equal(expectedColor, mockCanvasContext.strokeStyle);
        assert.equal(expectedColor, mockCanvasContext.fillStyle);
    });

    it('can draw a line', function () {

        var x1 = Math.random();
        var y1 = Math.random();
        var x2 = Math.random();
        var y2 = Math.random();

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

    it('can fill a rectangle', function () {
        var x = Math.random();
        var y = Math.random();
        var w = Math.random();
        var h = Math.random();

        var expectedColor = '#0F7224';
        renderer.setColor(expectedColor);
        renderer.fillRectangle(x, y, w, h);

        verify(mockCanvasContext.fillRect).wasCalledWith(x, y, w, h);
        assert.equal(expectedColor, mockCanvasContext.fillStyle);
    });

    it('will fill screen with a color', function () {
        var expectedColor = '#220203';
        var expectedWidth = Math.random() * 100;
        var expectedHeight = Math.random() * 100;

        mockCanvasContext.width = expectedWidth;
        mockCanvasContext.height = expectedHeight;

        renderer.clearCanvas(expectedColor);
        verify(mockCanvasContext.fillRect).wasCalledWith(0, 0, expectedWidth, expectedHeight);
        assert.equal(expectedColor, mockCanvasContext.fillStyle);
    });

    it('can draw text to canvas', function () {
        var x = Math.random();
        var y = Math.random();
        var text = 'My text in SPAAAACCCEEEE';

        var expectedColor = '#2FA77F';
        var expectedFont = '39px bold';
        renderer.setColor(expectedColor);
        renderer.setFont(expectedFont);
        renderer.drawText(x, y, text);

        verify(mockCanvasContext.fillText).wasCalledWith(text, x, y);
        assert.equal(mockCanvasContext.fillStyle, expectedColor);
        assert.equal(mockCanvasContext.font, expectedFont);
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