/**
 * Created by Eric on 12/10/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');

var SpaceRocks = require('../../src/game/SpaceRocks');
var actualModules = {
    Time: require('../../src/engine/Time'),
    SpaceEngine: require('../../src/engine/SpaceEngine'),
    LevelManager: require('../../src/subsystems/LevelManager'),
    PlayerSubsystem: require('../../src/subsystems/PlayerSubsystem'),
    EffectsSubsystem: require('../../src/subsystems/fx/EffectsSubsystem'),
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
        var timeModule = mockModule('Time');
        var effectsSubsystemModule = mockModule('EffectsSubsystem');

        SpaceRocks = proxy('../../src/game/SpaceRocks', {
            '../engine/Time': timeModule,
            '../engine/SpaceEngine': spaceEngine,
            '../subsystems/LevelManager': levelManager,
            '../subsystems/PlayerSubsystem': playerSubsystem,
            '../subsystems/entities/EntitySubsystem': entitySubsystem,
            '../subsystems/fx/EffectsSubsystem': effectsSubsystemModule,
        });

    });

    it('should call SpaceEngine with correct configuration', function () {
        var expectedCanvasId = 'my-test-id';
        var expectedConfig = {
            audioPath: 'audio/',
            canvas: expectedCanvasId,
            fps: 30,
            subsystems: [
                mockedModules.stubs.LevelManager,
                mockedModules.stubs.PlayerSubsystem,
                mockedModules.stubs.EntitySubsystem,
                mockedModules.stubs.EffectsSubsystem,
            ]
        };
        var spaceRocks = new SpaceRocks(expectedCanvasId);
        verify(mockedModules.SpaceEngine).wasCalledWithNew();
        verify(mockedModules.SpaceEngine).wasCalledWithConfig(0, expectedConfig);
    });

    it('will initialize subsystems correctly', function () {
        var expectedPlayerSubsystemConfig = {
            entitySubsystem: mockedModules.stubs.EntitySubsystem,
            time: mockedModules.stubs.Time,
            playerWeaponDelay: 250
        };

        var spaceRocks = new SpaceRocks('mycanvas');

        verify(mockedModules.LevelManager).wasCalledWithNew();
        verify(mockedModules.PlayerSubsystem).wasCalledWithNew();
        verify(mockedModules.EntitySubsystem).wasCalledWithNew();
        verify(mockedModules.EffectsSubsystem).wasCalledWithNew();

        verify(mockedModules.PlayerSubsystem).wasCalledWithConfig(0, expectedPlayerSubsystemConfig);
        verify(mockedModules.LevelManager).wasCalledWith(mockedModules.stubs.EntitySubsystem);
    });

    it('will call start on  engine', function () {
        var spaceRocks = new SpaceRocks('');
        verify(mockedModules.stubs.SpaceEngine.start).wasCalled();
    });
});