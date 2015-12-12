/**
 * Created by Eric on 12/10/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');

var SpaceRocks = require('../../src/game/SpaceRocks');
var SpaceEngine = require('../../src/engine/SpaceEngine');


describe('SpaceRocks', function () {
    var mockEngineModule;
    var stubEngine;
    beforeEach(function () {
        mockEngineModule = spies.createStub('SpaceEngineModule');
        stubEngine = spies.createStubInstance(SpaceEngine, 'SpaceEngine');
        mockEngineModule.returns(stubEngine);

        SpaceRocks = proxy('../../src/game/SpaceRocks', {
            '../engine/SpaceEngine': mockEngineModule,
        });

    });

    it('should call SpaceEngine with correct configuration', function () {
        var expectedCanvasId = 'my-test-id';
        var expectedConfig = {
            audioPath: '',
            canvas: expectedCanvasId
        };
        var spaceRocks = new SpaceRocks(expectedCanvasId);
        verify(mockEngineModule).wasCalledWithNew();
        verify(mockEngineModule).wasCalledWithConfig(0, expectedConfig);
    });

    it('will call start on  engine', function(){
        var spaceRocks = new SpaceRocks('');
        verify(stubEngine.start).wasCalled();
    });
});