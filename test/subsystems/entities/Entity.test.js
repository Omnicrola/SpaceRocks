/**
 * Created by omnic on 11/29/2015.
 */
var proxy = require('proxyquireify')(require);
var Renderer = require('../../../src/engine/Renderer');
var Entity = require('../../../src/subsystems/entities/Entity');
var Shape = require('../../../src/subsystems/entities/Shape');
var Point= require('../../../src/subsystems/entities/Point');
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

describe('Entity', function () {
    var entity;
    var stubShape;
    var pointStub;
    beforeEach(function () {
        stubShape = spies.createStub(new Shape());
        entity = new Entity(stubShape);
    });

    it('should render its shape', function () {
        var stubRenderer = spies.createStubInstance(Renderer, 'Renderer');
        entity.render(stubRenderer);
        verify(stubShape.render).wasCalledWith(stubRenderer);
    });

    it('should have an initial position and velocity', function () {
        assert.deepEqual(new Point(0,0), entity.position);
        assert.deepEqual(new Point(0,0), entity.velocity);
        assert.deepEqual(0, entity.rotation);
    });
});
