/**
 * Created by omnic on 11/29/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');

var GameEvent = require('../../src/engine/GameEvent')
var SpaceEngine;
var actualModules = {
    Delta: require('../../src/engine/Delta'),
    Time: require('../../src/engine/Time'),
    Renderer: require('../../src/engine/Renderer'),
    SubsystemManager: require('../../src/engine/SubsystemManager'),
    GameInput: require('../../src/engine/GameInput'),
    GameAudio: require('../../src/engine/GameAudio'),
    GameEventHandler: require('../../src/engine/GameEventHandler'),
};


describe('GameEngine', function () {
    var setIntervalStub;

    var expectedCanvasId;
    var expectedContext;
    var getElementStub;
    var expectedSubscribe;
    var expectedUnsubscribe;
    var expectedEmit;
    var expectedProcess;
    var expectedWidth;
    var expectedHeight;

    var mockedModules = {
        stubs: {}
    };

    function mockModule(name) {
        var mockModule = spies.createStub(name + 'Module');
        mockedModules[name] = mockModule;
        var moduleInstance = spies.createStubInstance(actualModules[name], name);
        mockModule.returns(moduleInstance);
        mockedModules.stubs[name] = moduleInstance;
        return mockModule;
    }

    beforeEach(function () {
        setupCanvas();
        var mockDelta = mockModule('Delta');
        var mockTime = mockModule('Time');
        var mockSubystemManager = mockModule('SubsystemManager');
        var mockRenderer = mockModule('Renderer');
        var mockGameInput = mockModule('GameInput');
        var mockGameAudio = mockModule('GameAudio');
        var mockEventHandler = mockModule('GameEventHandler');


        var stubEventHandler = mockedModules.stubs.GameEventHandler;
        expectedSubscribe = stubEventHandler.subscribe = spies.create('subscribe');
        expectedUnsubscribe = stubEventHandler.unsubscribe = spies.create('unsubscribe');
        expectedEmit = stubEventHandler.addEvent = spies.create('addEvent');
        expectedProcess = stubEventHandler.process = spies.create('process');

        require('../../src/engine/SpaceEngine');
        SpaceEngine = proxy('../../src/engine/SpaceEngine', {
            './Delta': mockDelta,
            './SubsystemManager': mockSubystemManager,
            './Time': mockTime,
            './Renderer': mockRenderer,
            './GameInput': mockGameInput,
            './GameAudio': mockGameAudio,
            './GameEventHandler': mockEventHandler
        });

        mockedModules.stubs.Delta.getInterval.returns({delta: 1.0, milliseconds: 0});
        setIntervalStub = spies.replace(window, 'setInterval');
    });

    function setupCanvas() {
        expectedCanvasId = 'my-super-canvas';
        expectedWidth = Math.random() * 100;
        expectedHeight = Math.random() * 100;
        expectedContext = {
            canvas: {
                width: expectedWidth,
                height: expectedHeight
            }
        };
        var contextStub = sinon.stub();
        getElementStub = sinon.stub(document, 'getElementById')
            .withArgs(expectedCanvasId)
            .returns({
                getContext: contextStub
            });
        contextStub
            .withArgs('2d')
            .returns(expectedContext);
    }

    afterEach(function () {
        spies.restoreAll();
        document.getElementById.restore();
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

    describe('Using the subsystem manager', function () {
        var expectedUpdateContainer;
        var expectedDelta;
        var expectedTime;
        var stubSubsystemManager;

        beforeEach(function () {
            expectedDelta = Math.random();
            expectedTime = Math.random();
            mockedModules.stubs.Delta.getInterval.returns({delta: expectedDelta, milliseconds: expectedTime});
            stubSubsystemManager = mockedModules.stubs.SubsystemManager;
            expectedUpdateContainer = {
                delta: expectedDelta,
                timeSinceLastFrame: expectedTime,
                input: mockedModules.stubs.GameInput,
                audio: mockedModules.stubs.GameAudio,
                display: {
                    width: expectedWidth,
                    height: expectedHeight
                },
                events: {
                    emit: expectedEmit,
                    subscribe: expectedSubscribe,
                    unsubscribe: expectedUnsubscribe
                }
            };
        });

        it('should initialize a subsystem before sending to subsystemManager', function () {
            var mockSubsystem = createMockSubsystem('subsandwich');
            var options = {
                subsystems: [
                    mockSubsystem,
                ]
            };
            expectedUpdateContainer.delta = 1.0;
            expectedUpdateContainer.timeSinceLastFrame = 0;

            var spaceEngine = createSpaceEngineForTesting(options);

            verify(mockSubsystem.update).wasNotCalled();
            verify(mockSubsystem.render).wasNotCalled();
            verify(mockSubsystem.initialize).wasCalledWithConfig(0, expectedUpdateContainer);
            verify(stubSubsystemManager.addSubsystem).wasCalledAfter(mockSubsystem.initialize);
        });

        it('cycle will call update on the subsystemManager', function () {

            var spaceEngine = createSpaceEngineForTesting();
            assert.isFalse(stubSubsystemManager.update.called);

            callCycleFunction(spaceEngine);

            verify(stubSubsystemManager.update).wasCalledWithConfig(0, expectedUpdateContainer);

            verify(mockedModules.GameAudio).wasCalledWithNew();
            verify(mockedModules.GameInput).wasCalledWithNew();
            verify(mockedModules.GameEventHandler).wasCalledWithNew();

        });

        it('cycle will call render on subsystemManager', function () {
            var spaceEngine = createSpaceEngineForTesting();
            assert.isFalse(stubSubsystemManager.render.called);

            callCycleFunction(spaceEngine);
            verify(stubSubsystemManager.render).wasCalledWith(mockedModules.stubs.Renderer);
        });

        it('will correctly initialize the subsystem manager', function () {
            var expectedSystem1 = createMockSubsystem('stuff');
            var expectedSystem2 = createMockSubsystem('other');
            var expectedSystem3 = createMockSubsystem('things');

            var options = {
                subsystems: [
                    expectedSystem1,
                    expectedSystem2,
                    expectedSystem3,
                ]
            };

            var spaceEngine = createSpaceEngineForTesting(options);

            verify(mockedModules.SubsystemManager).wasCalledWithNew();
            verify(stubSubsystemManager.addSubsystem).wasCalledWith(expectedSystem1);
            verify(stubSubsystemManager.addSubsystem).wasCalledWith(expectedSystem2);
            verify(stubSubsystemManager.addSubsystem).wasCalledWith(expectedSystem3);

        });

        it('will emit an event after loading', function () {
            var stubEventHandler = mockedModules.GameEventHandler;
            var mockSubsystem1 = createMockSubsystem('stuffs');
            var mockSubsystem2 = createMockSubsystem('stuffs');
            var options = {
                subsystems: [
                    mockSubsystem1,
                    mockSubsystem2
                ]
            };

            var spaceEngine = createSpaceEngineForTesting(options);

            verify(expectedEmit).wasCalledOnce();
            verify(expectedProcess).wasNotCalled();
            var actualEvent = expectedEmit.firstCall.args[0];

            assert.equal('engine-start', actualEvent.type);
            assert.equal(null, actualEvent.data);
        });

        function createMockSubsystem(name) {
            return {
                name: name,
                update: spies.create('update'),
                render: spies.create('render'),
                initialize: spies.create('initialize')
            };
        }
    });


    it('should clear the screen each frame', function () {
        var spaceEngine = createSpaceEngineForTesting();
        callCycleFunction(spaceEngine);
        verify(mockedModules.stubs.Renderer.clearCanvas).wasCalledWith('#000000');
    });

    it('should call render and update in the correct order', function () {
        var spaceEngine = createSpaceEngineForTesting();
        callCycleFunction(spaceEngine);
        verify([
            mockedModules.stubs.GameEventHandler.process,
            mockedModules.stubs.SubsystemManager.update,
            mockedModules.stubs.Renderer.clearCanvas,
            mockedModules.stubs.SubsystemManager.render
        ]).whereCalledInOrder();

    });


    it('will initialize Delta with a new Time', function () {
        var expectedFps = Math.random();
        var expectedConfig = {
            time: mockedModules.stubs.Time,
            config: {
                fps: expectedFps
            }
        };

        var spaceEngine = createSpaceEngineForTesting({fps: expectedFps});

        verify(mockedModules.Time).wasCalledWithNew();
        verify(mockedModules.Delta).wasCalledWithNew();

        verify(mockedModules.Delta).wasCalledWithConfig(0, expectedConfig);

    });


    it('will initialize Renderer with canvas context', sinon.test(function () {

        var spaceEngine = createSpaceEngineForTesting({canvas: expectedCanvasId});
        verify(mockedModules.Renderer).wasCalledWithNew();
        verify(mockedModules.Renderer).wasCalledWith(expectedContext);

    }));


    it('will initialize audio system', function () {
        var expectedPath = '/my/test/path/';
        var spaceEngineForTesting = createSpaceEngineForTesting({audioPath: expectedPath});
        verify(mockedModules.GameAudio).wasCalledWithConfig(0, {basePath: expectedPath});
    });

    function createSpaceEngineForTesting(extraOptions) {
        extraOptions = extraOptions || {};
        var options = {
            canvas: expectedCanvasId,
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