/**
 * Created by Eric on 12/9/2015.
 */

var proxy = require('proxyquireify')(require);

describe('Global Exports', function () {
    it('should expose GameEngine globally', sinon.test(function () {
        var expectedModule = {module: 'spaaaaaaaace'};

        delete window.SpaceEngine;
        assert.isUndefined(window.SpaceEngine);

        var gameExports = proxy('../src/exports', {
            './engine/SpaceEngine': expectedModule
        });

        require('../src/exports');

        assert.isDefined(window.SpaceEngine);
        assert.equal(expectedModule, window.SpaceEngine);

    }));
});