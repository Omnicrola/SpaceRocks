/**
 * Created by Eric on 12/5/2015.
 */

var Point = require('../../../src/subsystems/entities/Point');
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

describe('Point', function () {
    it('store 2 numbers', function () {
        var expectedX = Math.random();
        var expectedY = Math.random();

        var point = new Point(expectedX, expectedY);
        assert.equal(expectedX, point.x);
        assert.equal(expectedY, point.y);
    });
});