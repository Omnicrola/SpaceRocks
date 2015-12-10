/**
 * Created by omnic on 11/29/2015.
 */
var proxy = require('proxyquireify')(require);
var SpaceEngine;
var Delta = require('../../src/engine/Delta');
var Time = require('../../src/engine/Time');
var Renderer = require('../../src/engine/Renderer');
var SubsystemManager = require('../../src/engine/SubsystemManager');
var verify = require('../TestVerification');
var spies = require('../TestSpies');


describe('engine will start', function () {
    var setIntervalStub;
    var stubDelta;
    var stubTime;
    var stubSubsystem;
    var stubRenderer;
    var mockDeltaModule;
    var mockSubsystemModule;
    var mockTimeModule;
    var mockRendererModule;
    beforeEach(function () {
        mockDeltaModule = spies.stubConstructor('DeltaModule');
        mockSubsystemModule = spies.stubConstructor('SubsystemModule');
        mockTimeModule = spies.stubConstructor('TimeModule');
        mockRendererModule = spies.stubConstructor('RendererModule');

        stubDelta = spies.createStubInstance(Delta, 'Delta');
        stubTime = spies.createStubInstance(Time, 'Time');
        stubSubsystem = spies.createStubInstance(SubsystemManager, 'SubsystemManager');
        stubRenderer = spies.createStubInstance(Renderer, 'Renderer');

        mockDeltaModule.returns(stubDelta);
        mockTimeModule.returns(stubTime);
        mockSubsystemModule.returns(stubSubsystem);
        mockRendererModule.returns(stubRenderer);

        require('../../src/engine/SpaceEngine');
        SpaceEngine = proxy('../../src/engine/SpaceEngine', {
            './Delta': mockDeltaModule,
            './SubsystemManager': mockSubsystemModule,
            './Time': mockTimeModule,
            './Renderer': mockRendererModule
        });

        setIntervalStub = spies.replace(window, 'setInterval');
    });

    afterEach(function () {
        spies.restoreAll();
    })

    function createSpaceEngineForTesting(canvasId) {
        canvasId = canvasId || 'my-test-canvas';
        return new SpaceEngine({canvas: canvasId});
    }

    it('will add the cycle function as an interval', function () {
        var fps24 = 1000 / 24;

        var spaceEngine = createSpaceEngineForTesting();
        assert.isFalse(setIntervalStub.called);
        spaceEngine.start();
        assert.isTrue(setIntervalStub.called);

        var cycle = setIntervalStub.firstCall.args[0];
        assert.equal(typeof cycle, 'function');
    });

    it('cycle will pass delta to the subsystem manager', function () {
        var expectedDelta = Math.random();
        stubDelta.getInterval.returns(expectedDelta);

        var spaceEngine = createSpaceEngineForTesting();
        assert.isFalse(stubSubsystem.update.called);

        callCycleFunction(spaceEngine);
        verify(stubSubsystem.update).wasCalledWith(expectedDelta);
    });

    it('cycle will pass Renderer to the subsystem manager', function () {

        var spaceEngine = createSpaceEngineForTesting();
        assert.isFalse(stubSubsystem.render.called);

        callCycleFunction(spaceEngine);
        verify(stubSubsystem.render).wasCalledWith(stubRenderer);
    });

    it('should clear the screen each frame', function () {
        var spaceEngine = createSpaceEngineForTesting();
        callCycleFunction(spaceEngine);
        verify(stubRenderer.clearCanvas).wasCalledWith('#000000');
    });

    it('should call render and update in the correct order', function () {
        var spaceEngine = createSpaceEngineForTesting();
        callCycleFunction(spaceEngine);
        verify([
            stubSubsystem.update,
            stubRenderer.clearCanvas,
            stubSubsystem.render
        ]).whereCalledInOrder();

    });


    it('will initialize Delta with a new Time', function () {
        var spaceEngine = createSpaceEngineForTesting();

        verify(mockTimeModule).wasCalled();
        verify(mockDeltaModule).wasCalled();

        var deltaArgs = mockDeltaModule.firstCall.args[0];
        assert.equal(stubTime, deltaArgs.time);
        assert.equal(24, deltaArgs.config.fps);

    });
    it('will initialize Renderer with canvas context', sinon.test(function () {
        var expectedCanvasId = 'expect this canvas';
        var contextStub = sinon.stub();
        var expectedContext = {foo: Math.random()};

        this.stub(document, 'getElementById')
            .withArgs(expectedCanvasId)
            .returns({
                getContext: contextStub
            });

        contextStub
            .withArgs('2d')
            .returns(expectedContext);

        var spaceEngine = createSpaceEngineForTesting(expectedCanvasId);
        verify(mockRendererModule).wasCalledWith(expectedContext);

    }));

    function callCycleFunction(spaceEngine) {
        spaceEngine.start();
        var cycle = setIntervalStub.firstCall.args[0];
        cycle.call({});
    }

});