/**
 * Created by omnic on 11/29/2015.
 */
var Config = require('../../src/engine/Config');

describe('Config', function () {
    it('should set default values', function () {
        var config = new Config();
        assert.equal(24, config.fps);
    });
});