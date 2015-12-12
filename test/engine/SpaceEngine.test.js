/**
 * Created by omnic on 11/29/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');

var SpaceEngine;
var Delta = require('../../src/engine/Delta');
var Time = require('../../src/engine/Time');
var Renderer = require('../../src/engine/Renderer');
var SubsystemManager = require('../../src/engine/SubsystemManager');
var GameInput = require('../../src/engine/GameInput');
var GameAudio = require('../../src/engine/GameAudio');


describe('GameEngine', function () {
    var setIntervalStub;

    var stubDelta;
    var stubTime;
    var stubSubsystem;
    var stubRenderer;
    var stubInput;
    var stubAudio;

    var mockDeltaModule;
    var mockSubsystemModule;
    var mockTimeModule;
    var mockRendererModule;
    var mockInputModule;
    var mockAudioModule;

    beforeEach(function () {
        mockDeltaModule = spies.createStub('DeltaModule');
        mockSubsystemModule = spies.createStub('SubsystemModule');
        mockTimeModule = spies.createStub('TimeModule');
        mockRendererModule = spies.createStub('RendererModule');
        mockInputModule = spies.createStub('InputModule');
        mockAudioModule = spies.createStub('AudioModule');

        stubDelta = spies.createStubInstance(Delta, 'Delta');
        stubTime = spies.createStubInstance(Time, 'Time');
        stubSubsystem = spies.createStubInstance(SubsystemManager, 'SubsystemManager');
        stubRenderer = spies.createStubInstance(Renderer, 'Renderer');
        stubInput = spies.createStubInstance(GameInput, 'GameInput');
        stubAudio = spies.createStubInstance(GameAudio, 'GameAudio');

        mockDeltaModule.returns(stubDelta);
        mockTimeModule.returns(stubTime);
        mockSubsystemModule.returns(stubSubsystem);
        mockRendererModule.returns(stubRenderer);
        mockInputModule.returns(stubInput);
        mockAudioModule.returns(stubAudio);

        require('../../src/engine/SpaceEngine');
        SpaceEngine = proxy('../../src/engine/SpaceEngine', {
            './Delta': mockDeltaModule,
            './SubsystemManager': mockSubsystemModule,
            './Time': mockTimeModule,
            './Renderer': mockRendererModule,
            './GameInput': mockInputModule,
            './GameAudio': mockAudioModule
        });

        setIntervalStub = spies.replace(window, 'setInterval');
    });

    afterEach(function () {
        spies.restoreAll();
    })


    it('will add the cycle function as an interval', function () {
        var fps24 = 1000 / 24;

        var spaceEngine = createSpaceEngineForTesting();
        assert.isFalse(setIntervalStub.called);
        spaceEngine.start();
        assert.isTrue(setIntervalStub.called);

        var cycle = setIntervalStub.firstCall.args[0];
        assert.equal(typeof cycle, 'function');
    });


    it('cycle will call update on the subsystemManager', function () {
        var expectedDelta = Math.random();
        stubDelta.getInterval.returns(expectedDelta);

        var spaceEngine = createSpaceEngineForTesting();

        assert.isFalse(stubSubsystem.update.called);

        callCycleFunction(spaceEngine);

        assert.isTrue(stubSubsystem.update.calledOnce);
        var updateArgs = stubSubsystem.update.firstCall.args
        assert.equal(expectedDelta, updateArgs[0]);

        var container = updateArgs[1];
        assert.equal(stubInput, container.input);
        assert.equal(stubAudio, container.audio);

        verify(mockAudioModule).wasCalledWithNew();
        verify(mockAudioModule).wasCalledOnce();
        verify(mockInputModule).wasCalledWithNew();
        verify(mockInputModule).wasCalledOnce();

    });

    it('cycle will call render on subsystemManager', function () {
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

        verify(mockTimeModule).wasCalledWithNew();
        verify(mockDeltaModule).wasCalledWithNew();

        var deltaArgs = mockDeltaModule.firstCall.args[0];
        assert.equal(stubTime, deltaArgs.time);
        assert.equal(24, deltaArgs.config.fps);

    });

    it('will correctly initialize the subsystem manager', function () {
        var expectedSystem1 = {stuff: 'things'};
        var expectedSystem2 = {other: 'stuff'};
        var expectedSystem3 = {more: 'others'};

        var options = {
            subsystems: [
                expectedSystem1,
                expectedSystem2,
                expectedSystem3,
            ]
        };

        var spaceEngine = createSpaceEngineForTesting(options);

        verify(mockSubsystemModule).wasCalledWithNew();
        verify(stubSubsystem.addSubsystem).wasCalledWith(expectedSystem1);
        verify(stubSubsystem.addSubsystem).wasCalledWith(expectedSystem2);
        verify(stubSubsystem.addSubsystem).wasCalledWith(expectedSystem3);
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

        var spaceEngine = createSpaceEngineForTesting({canvas: expectedCanvasId});
        verify(mockRendererModule).wasCalledWithNew();
        verify(mockRendererModule).wasCalledWith(expectedContext);

    }));

    function createSpaceEngineForTesting(extraOptions) {
        extraOptions = extraOptions || {};
        var options = {
            canvas: 'my-canvas-id',
        };
        for (var attrname in extraOptions) {
            options[attrname] = extraOptions[attrname];
        }
        return new SpaceEngine(options);
    }

    function callCycleFunction(spaceEngine) {
        spaceEngine.start();
        var cycle = setIntervalStub.firstCall.args[0];
        cycle.call({});
    }

});