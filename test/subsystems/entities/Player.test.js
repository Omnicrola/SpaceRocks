/**
 * Created by Eric on 12/8/2015.
 */
var Player = require('../../../src/subsystems/entities/Player');

describe('Player', function () {

    it('should track number of lives', function () {
        var player = new Player();
        assert.equal(3, player.lives);
        assert.equal(0, player.score);
    });

});