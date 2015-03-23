/**
 * Created by Eric on 3/21/2015.
 */
describe('Point', function () {
    it('should store x and y', function () {
        var x = Math.random();
        var y = Math.random();
        var point = new SpaceRocks.Point(x, y);
        expect(point.x).to.be(x);
        expect(point.y).to.be(y);
    });
});