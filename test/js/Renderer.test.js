/**
 * Created by Eric on 3/21/2015.
 */
describe('spacerocks renderer', function () {
    describe('line function', function () {
        var mockCanvas;
        beforeEach(function (done) {
            mockCanvas = {};
            mockCanvas.canvas ={};
            mockCanvas.beginPath = sinon.spy();
            mockCanvas.moveTo = sinon.spy();
            mockCanvas.lineTo = sinon.spy();
            mockCanvas.stroke = sinon.spy();
            mockCanvas.strokeStyle = {};
            mockCanvas.fillStyle = {};
            mockCanvas.fillRect = sinon.spy();
            done();
        });

        it('should report Width from canvas', function () {
            SpaceRocks.Renderer.setCanvas(mockCanvas);
            var expectedWidth = Math.random();
            mockCanvas.canvas.width = expectedWidth;
            var actualWidth = SpaceRocks.Renderer.width();
            expect(actualWidth).to.be(expectedWidth);
        });

        it('should report Height from canvas', function () {
            SpaceRocks.Renderer.setCanvas(mockCanvas);
            var expectedHeight = Math.random();
            mockCanvas.canvas.height = expectedHeight;
            var actualHeight = SpaceRocks.Renderer.height();
            expect(actualHeight).to.be(expectedHeight);
        });

        it('should draw a line on canvas', function () {
            SpaceRocks.Renderer.setCanvas(mockCanvas);
            SpaceRocks.Renderer.drawLine(10, 11, 20, 21);
            expect(mockCanvas.beginPath.calledOnce).to.be(true);
            expect(mockCanvas.moveTo.calledOnce).to.be(true);
            expect(mockCanvas.lineTo.calledOnce).to.be(true);
            expect(mockCanvas.stroke.calledOnce).to.be(true);

            expect(mockCanvas.strokeStyle).to.be('#FFFFFF');
            var moveToCall = mockCanvas.moveTo.getCall(0);
            expect(moveToCall.args[0]).to.be(10);
            expect(moveToCall.args[1]).to.be(11);

            var lineToCall = mockCanvas.lineTo.getCall(0);
            expect(lineToCall.args[0]).to.be(20);
            expect(lineToCall.args[1]).to.be(21);
        });

        it('should fill a rectangle on canvas', function () {
            SpaceRocks.Renderer.setCanvas(mockCanvas);

            var expectedColor = '#FF00FA';
            var expectedX = Math.random();
            var expectedY = Math.random();
            var expectedWidth = Math.random();
            var expectedHeight = Math.random();
            SpaceRocks.Renderer.fillRectangle(
                expectedColor,
                expectedX, expectedY,
                expectedWidth, expectedHeight);
            expect(mockCanvas.fillStyle).to.be(expectedColor);
            expect(mockCanvas.fillRect.calledOnce).to.be(true);
            var methodCall = mockCanvas.fillRect.getCall(0);
            expect(methodCall.args[0]).to.be(expectedX);
            expect(methodCall.args[1]).to.be(expectedY);
            expect(methodCall.args[2]).to.be(expectedWidth);
            expect(methodCall.args[3]).to.be(expectedHeight);
        });
    });
});