/**
 * Created by Eric on 3/21/2015.
 */
describe('TimeWrapper.getTime', function () {
    it('will give time from system Date()', function () {
        var timestamp = TimeWrapper.getTime();
        var actualTime  = new Date().getTime();
        var allowedDelta = 0.00;

        var difference = Math.abs(timestamp-actualTime);
        expect(difference).to.equal(allowedDelta);

    });
});