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

    it('should have a read-only shape', function () {
        expect(entity.shape).to.equal(stubShape);
        entity.shape = {};
        expect(entity.shape).to.equal(stubShape);
    });

    it('should render its shape', function () {
        var stubRenderer = spies.createStubInstance(Renderer, 'Renderer');
        var expectedPosition = new Point(Math.random(), Math.random());

        entity.position = expectedPosition;

        entity.render(stubRenderer);
        verify(stubShape.render).wasCalledWith(stubRenderer, entity.position);
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
