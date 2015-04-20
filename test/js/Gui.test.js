/**
 * Created by Eric on 4/7/2015.
 */
describe('Gui', function () {

    beforeEach(function(){
        SpaceRocks.Gui.resetScore();
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });

    it('should reset the score', function(){
        var drawTextSpy = OMD.test.globalSpy(SpaceRocks.Renderer, 'drawText');
        SpaceRocks.Gui.incrementScore(20);
       SpaceRocks.Gui.incrementScore(60);

        SpaceRocks.Gui.resetScore();
        SpaceRocks.Gui.render();

        expect(drawTextSpy.getCall(0).args[2]).to.equal('Score: 0');
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