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
        assert.isTrue(entity.isAlive);
    });

    it('should pass rotation to the shape', function () {
        var fakeShape = {};
        var expectedRotation = Math.random();
        entity = new Entity(fakeShape);
        expect(fakeShape.rotation).to.equal(0);

        entity.rotation = expectedRotation;
        expect(fakeShape.rotation).to.equal(expectedRotation);
    });

    it('shape is read-only', function () {
        verify.readOnlyProperty(entity, 'shape', stubShape);
    });

    it('should render its shape', function () {
        var stubRenderer = spies.createStubInstance(Renderer, 'Renderer');

        entity.render(stubRenderer);
        verify(stubShape.render).wasCalledWith(stubRenderer);
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
        verify.point(expectedPosition, entity.position);
        verify.point(expectedPosition, stubShape.position);
    });

    it('should update shapes position and rotation', function () {
        var expectedPosition = new Point(Math.random(), Math.random());
        var expectedRotation = Math.random();

        entity.position = expectedPosition;
        entity.rotation = expectedRotation;

        assert.equal(expectedRotation, stubShape.rotation);
        verify.point(expectedPosition, stubShape.position);
    });

    it('should call behaviors on update', function () {
        var behavior1 = spies.create('Behavior');
        var behavior2 = spies.create('Behavior');
        var expectedDelta = Math.random();

        entity.addBehavior(behavior1);
        entity.addBehavior(behavior2);

        verify(behavior1).wasNotCalled();
        verify(behavior2).wasNotCalled();

        entity.update(expectedDelta);
        verify(behavior1).wasCalledOnce();
        verify(behavior2).wasCalledOnce();
        verify(behavior1).wasCalledWith(expectedDelta, entity);
        verify(behavior2).wasCalledWith(expectedDelta, entity);
    });

});
