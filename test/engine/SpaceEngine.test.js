/**
 * Created by omnic on 11/29/2015.
 */
var proxy = require('proxyquireify')(require);
var SpaceEngine;
var Delta = require('../../src/engine/Delta');
var SubsystemManager = require('../../src/engine/SubsystemManager');
var verify = require('../TestVerification');
var spies = require('../TestSpies');


describe('engine will start', function () {
    var stubDelta;
    var stubTime;
    var stubSubsystem;
    var mockDeltaModule;
    var mockSubsystemModule;
    var mockTimeModule;
    beforeEach(function () {
        mockDeltaModule = spies.createStub('DeltaModule');
        mockSubsystemModule = spies.createStub('SubsystemManagerModule');
        mockTimeModule = spies.createStub('TimeModule');

        stubDelta = spies.createStub(new Delta({time: '', config: {}}));
        stubTime = spies.createStub('time');
        stubSubsystem = spies.createStub(new SubsystemManager());

        mockDeltaModule.returns(stubDelta);
        mockTimeModule.returns(stubTime);
        mockSubsystemModule.returns(stubSubsystem);

        require('../../src/engine/SpaceEngine');
        SpaceEngine = proxy('../../src/engine/SpaceEngine', {
            './Delta': mockDeltaModule,
            './SubsystemManager': mockSubsystemModule,
            './Time': mockTimeModule
        });

    });

    it('will add the cycle function as an interval', function () {
        var setIntervalStub = spies.replace(window, 'setInterval');
        var fps24 = 1000 / 24;

        var spaceEngine = new SpaceEngine();
        assert.isFalse(setIntervalStub.called);
        spaceEngine.start();
        assert.isTrue(setIntervalStub.called);
        verify(setIntervalStub).wasCalledWith(spaceEngine.cycle, fps24);
    });

    it('cycle will pass delta to the subsystem manager', function () {
        var expectedDelta = Math.random();
        stubDelta.getInterval.returns(expectedDelta);

        var spaceEngine = new SpaceEngine();
        assert.isFalse(stubSubsystem.update.called);

        spaceEngine.cycle();
        verify(stubSubsystem.update).wasCalledWith(expectedDelta);

    });

    it('will initialize with configuration', function () {
        console.log('-----');
        mockTimeModule.returns(stubTime);
        console.log(stubTime);
        console.log(new mockTimeModule());
        //var spaceEngine = new SpaceEngine();
        //
        //assert.isTrue(mockDeltaModule.called);
        //var deltaArgs = mockDeltaModule.firstCall.args[0];
        //verify(mockTimeModule).wasCalled();
        //assert.equal(stubTime, deltaArgs.time);
        //assert.equal(24, deltaArgs.config.fps);

    });


});