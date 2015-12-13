/**
 * Created by Eric on 12/10/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');

var SpaceRocks = require('../../src/game/SpaceRocks');
var actualModules = {
    SpaceEngine: require('../../src/engine/SpaceEngine'),
    LevelManager: require('../../src/subsystems/LevelManager'),
    PlayerSubsystem: require('../../src/subsystems/PlayerSubsystem'),
    EntitySubsystem: require('../../src/subsystems/entities/EntitySubsystem'),
};

describe('SpaceRocks', function () {
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
        var levelManager = mockModule('LevelManager');
        var playerSubsystem = mockModule('PlayerSubsystem');
        var entitySubsystem = mockModule('EntitySubsystem');
        var spaceEngine = mockModule('SpaceEngine');

        SpaceRocks = proxy('../../src/game/SpaceRocks', {
            '../engine/SpaceEngine': spaceEngine,
            '../subsystems/LevelManager': levelManager,
            '../subsystems/PlayerSubsystem': playerSubsystem,
            '../subsystems/entities/EntitySubsystem': entitySubsystem,
        });

    });

    it('should call SpaceEngine with correct configuration', function () {
        var expectedCanvasId = 'my-test-id';
        var expectedConfig = {
            audioPath: '',
            canvas: expectedCanvasId,
            subsystems: [
                mockedModules.stubs.LevelManager,
                mockedModules.stubs.PlayerSubsystem,
                mockedModules.stubs.EntitySubsystem,
            ]
        };
        var spaceRocks = new SpaceRocks(expectedCanvasId);
        verify(mockedModules.SpaceEngine).wasCalledWithNew();
        verify(mockedModules.SpaceEngine).wasCalledWithConfig(0, expectedConfig);
    });

    it('will initialize subsystems correctly', function () {
        var spaceRocks = new SpaceRocks('mycanvas');

        verify(mockedModules.LevelManager).wasCalledWithNew();
        verify(mockedModules.PlayerSubsystem).wasCalledWithNew();
        verify(mockedModules.EntitySubsystem).wasCalledWithNew();

        verify(mockedModules.PlayerSubsystem).wasCalledWith(mockedModules.stubs.EntitySubsystem);
    });

    it('will call start on  engine', function () {
        var spaceRocks = new SpaceRocks('');
        verify(mockedModules.stubs.SpaceEngine.start).wasCalled();
    });
});