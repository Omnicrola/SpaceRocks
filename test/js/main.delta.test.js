/**
 * Created by Eric on 3/19/2015.
 */

describe('SpaceRocks.delta', function () {
    beforeEach(function(done){
        sinon.stub(TimeWrapper, "getTime");
        done();
    });
    afterEach(function(){
       TimeWrapper.getTime.restore();
    });

    it('will have a default FPS of 24', function(){
       expect(SpaceRocks.fps).to.be(24);
    });

    it('will return a delta based on a fps of 10', function () {
        var tempFps = SpaceRocks.fps;
        SpaceRocks.fps = 10;

        TimeWrapper.getTime.onFirstCall().returns(1000);
        TimeWrapper.getTime.onSecondCall().returns(1100);
        var deltaValue1 = SpaceRocks.delta();
        var deltaValue2 = SpaceRocks.delta();

        expect(TimeWrapper.getTime.calledTwice);
        expect(deltaValue2).to.be(1.0);

        SpaceRocks.fps = tempFps;

    });
    it('will return a delta based on a fps of 24', function () {
        var tempFps = SpaceRocks.fps;
        SpaceRocks.fps = 24;

        TimeWrapper.getTime.onFirstCall().returns(1300);
        TimeWrapper.getTime.onSecondCall().returns(1322);
        var deltaValue1 = SpaceRocks.delta();
        var deltaValue2 = SpaceRocks.delta();

        expect(TimeWrapper.getTime.calledTwice);
        expect(deltaValue2).to.be(0.528);

        SpaceRocks.fps = tempFps;

    });

    it('will not return a delta greater than 10', function () {
        var tempFps = SpaceRocks.fps;
        SpaceRocks.fps = 12;

        TimeWrapper.getTime.onFirstCall().returns(50);
        TimeWrapper.getTime.onSecondCall().returns(5000);
        var deltaValue1 = SpaceRocks.delta();
        var deltaValue2 = SpaceRocks.delta();

        expect(TimeWrapper.getTime.calledTwice);
        expect(deltaValue2).to.be(10.0);

        SpaceRocks.fps = tempFps;

    });
});