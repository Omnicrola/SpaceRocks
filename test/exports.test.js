/**
 * Created by Eric on 12/9/2015.
 */

var proxy = require('proxyquireify')(require);

describe('Global Exports', function () {
    it('should expose SpaceRocks globally', sinon.test(function () {
        var expectedModule = {module: 'spaaaaaaaace'};

        delete window.SpaceRocks;
        assert.isUndefined(window.SpaceRocks);

        var gameExports = proxy('../src/exports', {
            './game/SpaceRocks': expectedModule
        });

        //require('../src/exports');

        assert.isDefined(window.SpaceRocks);
        assert.equal(expectedModule, window.SpaceRocks);

    }));
});