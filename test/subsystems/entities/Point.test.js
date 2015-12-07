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

    it('x and y are read only', function () {
        var expectedX = Math.random();
        var expectedY = Math.random();

        var point = new Point(expectedX, expectedY);
        point.x = 2.4;
        point.y = 5.2;

        assert.equal(expectedX, point.x);
        assert.equal(expectedY, point.y);
    });
});