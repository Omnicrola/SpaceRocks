/**
 * Created by omnic on 11/29/2015.
 */
var Delta = require('../../src/engine/Delta');
var Time = require('../../src/engine/Time');
var Config = require('../../src/engine/Config');

describe('Delta', function () {
    var stubTime;
    var stubConfig;
    var delta;
    beforeEach(function () {
        stubTime = sinon.stub(new Time());
        stubConfig = sinon.stub(new Config());
        delta = new Delta({
            time: stubTime,
            config: stubConfig
        });

    });

    it('should calculate delta based on a fps of 10', function () {
        stubTime.getCurrentTime.onFirstCall().returns(1000);
        stubTime.getCurrentTime.onSecondCall().returns(1100);
        stubConfig.fps = 10;


        var deltaValue1 = delta.getInterval();
        var deltaValue2 = delta.getInterval();

        assert.equal(deltaValue2, 1.0);

    });

    it('should calculate delta based on a fps of 24', function () {

        stubTime.getCurrentTime.onFirstCall().returns(1300);
        stubTime.getCurrentTime.onSecondCall().returns(1322);
        stubConfig.fps = 24;


        var deltaValue1 = delta.getInterval();
        var deltaValue2 = delta.getInterval();

        assert.equal(deltaValue2, 0.528);

    });

    it('will not return a delta greater than 10', function () {
        stubTime.getCurrentTime.onFirstCall().returns(50);
        stubTime.getCurrentTime.onSecondCall().returns(890);
        stubConfig.fps = 12;

        var deltaValue1 = delta.getInterval();
        var deltaValue2 = delta.getInterval();
        assert.equal(deltaValue2, 10.0);

    });
});