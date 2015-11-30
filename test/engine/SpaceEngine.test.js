/**
 * Created by omnic on 11/29/2015.
 */
var SpaceEngine ;
var Delta;
var verify = require('../TestVerification');
var spies = require('../TestSpies');


describe('engine will start', function () {
    var mockDeltaModule;
    var mockSubsystemModule;
    var realRequire ;
    beforeEach(function () {
        realRequire = require;
    });

    afterEach(function () {
        spies.restoreAll();
        require = realRequire;
    });

    //it('will add the cycle function as an interval', function () {
    //    setIntervalStub = spies.replace(window, 'setInterval');
    //    var fps24 = 1000 / 24;
    //
    //    var spaceEngine = new SpaceEngine();
    //
    //    assert.isFalse(setIntervalStub.called);
    //    spaceEngine.start();
    //
    //    assert.isTrue(setIntervalStub.called);
    //
    //    var verify2 = verify(setIntervalStub);
    //    console.log(verify2);
    //    verify2.wasCalledWith(spaceEngine.cycle, fps24);
    //});

    //it('will initialize with configuration', sinon.test(function () {
    //    mockDeltaModule = spies.createStub('DeltaModule');
    //    mockSubsystemModule = spies.createStub('SubsystemManager');
    //    //var requireStub = sinon.stub(window, 'require');
    //    //requireStub.withArgs('./Delta').returns(mockDeltaModule);
    //
    //    SpaceEngine = realRequire('../../src/engine/SpaceEngine');
    //    var spaceEngine = new SpaceEngine();
    //
    //}));

    function getModuleForTesting(path){
        return realRequire(path);
    }

});