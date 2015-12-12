/**
 * Created by Eric on 12/12/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');

var GameAudio = require('../../src/engine/GameAudio');


describe('GameAudio', function () {
    var stubAudio;
    var stubPlay;
    beforeEach(function () {
        stubAudio = spies.replace(window, 'Audio');
        stubPlay  = stubAudio.prototype.play = spies.create('play');
    });

    afterEach(function () {
        spies.restoreAll();
    });

    it('should play an audio file', function () {
        var basePath = 'fake/path/name/';

        var gameAudio = new GameAudio({
            basePath: basePath
        });
        var expectedFilename = 'test';
        gameAudio.play(expectedFilename);

        var expectedFilepath = basePath + expectedFilename + '.wav';
        verify(stubAudio).wasCalledWith(expectedFilepath);
        verify(stubAudio).wasCalledWithNew();
        verify(stubPlay).wasCalled();
    });

});
