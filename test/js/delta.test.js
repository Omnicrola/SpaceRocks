/**
 * Created by Eric on 3/19/2015.
 */

describe('SpaceRocks.delta', function () {
    it('will set a FPS of 24', function(){
       expect(SpaceRocks.fps).to.be(24);
    });
    it('will return a time interval based on Date and FPS of 10', function () {
        SpaceRocks.fps = 10;

        var deltaValue1 = SpaceRocks.delta();
        expect(typeof deltaValue1).to.be('number');
    });
});