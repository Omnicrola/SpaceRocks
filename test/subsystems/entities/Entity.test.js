/**
 * Created by omnic on 11/29/2015.
 */
var proxy = require('proxyquireify')(require);
var Renderer = require('../../../src/engine/Renderer');
var Entity;
var Shape = require('../../../src/subsystems/entities/Shape');
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

describe('Entity', function () {
    var entity;
    var stubShape;
    var pointStub;
    beforeEach(function () {
        pointStub = sinon.stub();
        require('../../../src/subsystems/entities/Entity');
        Entity = proxy('../../../src/subsystems/entities/Entity', {
            './Point': pointStub
        });
        stubShape = spies.createStub(new Shape());
        entity = new Entity(stubShape);
    });

    it('should render its shape', function () {
        var stubRenderer = spies.createStub(new Renderer(sinon.spy()));
        entity.render(stubRenderer);
        verify(stubShape.render).wasCalledWith(stubRenderer);
    });

    it('should have an initial position and velocity', function () {
        assert.isTrue(pointStub.called);
        //assert.equal(0, entity.position.x);
        //assert.equal(0, entity.position.y);
        //assert.equal(0, entity.velocity.x);
        //assert.equal(0, entity.velocity.y);
    });
});
