/**
 * Created by omnic on 11/29/2015.
 */
var SpaceEngine = require('../../src/engine/SpaceEngine');

describe('engine will start', function () {
    it('will add a function window.interval', sinon.test(function () {
        setIntervalStub = this.stub(window, 'setInterval');
        var spaceEngine = new SpaceEngine();

        assert.isFalse(setIntervalStub.called);
        spaceEngine.start();

        assert.isTrue(setIntervalStub.called);
        var intervalFunction = setIntervalStub.firstCall.args[0];
        assert.equal(typeof intervalFunction, 'function');
        var fps24 = 1000 / 24;
        assert.equal(setIntervalStub.firstCall.args[1], fps24);

        intervalFunction();

    }));
});