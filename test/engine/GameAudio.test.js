/**
 * Created by Eric on 12/12/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');
var MockModules = require('../MockModules');

var GameAudio = require('../../src/engine/GameAudio');
var AudioFx = require('../../src/subsystems/fx/AudioFx');
var AudioBufferLoader = require('../../src/engine/AudioBufferLoader');
var AudioContext = require('../../src/engine/AudioContext');


describe('GameAudio', function () {
    beforeEach(function () {
        MockModules.load(['AudioContext', 'AudioBufferLoader']);

        GameAudio = proxy('../../src/engine/GameAudio', {
            './AudioBufferLoader': MockModules.modules.AudioBufferLoader,
            './AudioContext': MockModules.modules.AudioContext
        });
    });

    afterEach(function () {
        spies.restoreAll();
    });

    // TODO: fix test. Currently will not proxy AudioBufferLoader, and so cannot mock that key dependancy
    it('should use AudioBufferLoader on startup', function () {
        var expectedBasePath = 'hello dolly';
        var expectedFiles = getExpectedFiles(expectedBasePath);

        var gameAudio = new GameAudio({basePath: expectedBasePath});

        //verify(AudioBufferLoader.load).wasCalledOnce();
        //var actualConfig = AudioBufferLoader.load.firstCall.args[0];
        //assert.equal(MockModules.stubs.AudioContext, actualConfig.context);
        //verify.config(expectedFiles, actualConfig.files);
    });

    function getExpectedFiles(basePath) {
        return [
            AudioFx.EXPLOSION,
            AudioFx.WEAPON_FIRE
        ].map(function (file) {
                return basePath + file + '.wav';
            });
    }
});
