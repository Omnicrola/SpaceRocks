/**
 * Created by omnic on 11/29/2015.
 */

var Entity = require('../../../src/subsystems/entities/Entity');
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

describe('Entity', function () {
    var entity;

    beforeEach(function () {
        entity = new Entity();
    });

    it('should have a render method', function () {
        assert.equal('function', typeof entity.render);
    });
});