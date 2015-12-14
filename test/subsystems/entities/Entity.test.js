/**
 * Created by omnic on 11/29/2015.
 */
var proxy = require('proxyquireify')(require);
var Renderer = require('../../../src/engine/Renderer');
var Entity = require('../../../src/subsystems/entities/Entity');
var Shape = require('../../../src/subsystems/entities/Shape');
var Point = require('../../../src/subsystems/entities/Point');
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

    it('should have an initial values', function () {
        assert.deepEqual(new Point(0, 0), entity.position);
        assert.deepEqual(new Point(0, 0), entity.velocity);
        assert.deepEqual(0, entity.rotation);
    });

    it('should render its shape', function () {
        var stubRenderer = spies.createStubInstance(Renderer, 'Renderer');
        var expectedRotation = Math.random();
        var expectedPosition = new Point(Math.random(), Math.random());

        entity.rotation = expectedRotation;
        entity.position = expectedPosition;

        entity.render(stubRenderer);
        verify(stubShape.render).wasCalledWith(stubRenderer, entity.position, expectedRotation);
    });

    it('should update position based on velocity and delta', function () {
        var initialPosition = new Point(Math.random(), Math.random());
        var initialVelocity = new Point(Math.random(), Math.random());
        var delta = Math.random();
        var expectedPosition = new Point(
            initialPosition.x + (initialVelocity.x * delta),
            initialPosition.y + (initialVelocity.y * delta)
        );

        entity.position = initialPosition;
        entity.velocity = initialVelocity;

        entity.update(delta);
        assert.equal(expectedPosition.x, entity.position.x);
        assert.equal(expectedPosition.y, entity.position.y);

    });

});
