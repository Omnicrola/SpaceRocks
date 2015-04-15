/**
 * Created by Eric on 4/7/2015.
 */
describe('Gui', function () {

    afterEach(function () {
        OMD.test.restoreAll();
    });

    it('should draw score', function () {
        var drawTextSpy = OMD.test.globalSpy(SpaceRocks.Renderer, 'drawText');
        var expectedX = 10;
        var expectedY = 20;
        var expectedScore = new Random().nextInteger(5000);
        var expectedText = 'Score: ' + expectedScore;

        SpaceRocks.Gui.incrementScore(expectedScore);
        SpaceRocks.Gui.render();
        expect(drawTextSpy.calledOnce).to.equal(true);
        expect(drawTextSpy.firstCall.args[0]).to.equal(expectedX);
        expect(drawTextSpy.firstCall.args[1]).to.equal(expectedY);
        expect(drawTextSpy.firstCall.args[2]).to.equal(expectedText);

    });
});