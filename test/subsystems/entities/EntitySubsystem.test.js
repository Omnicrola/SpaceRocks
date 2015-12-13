/**
 * Created by omnic on 11/29/2015.
 */
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');
var interface = require('../../TestInterfaces');
var containerGenerator = require('../../mocks/GameContainer');

var Entity = require('../../../src/subsystems/entities/Entity');
var EntitySubsystem = require('../../../src/subsystems/entities/EntitySubsystem');

describe('EntitySubsystem', function () {
    var entitySubsystem;
    var mockContainer;
    beforeEach(function () {
        entitySubsystem = new EntitySubsystem();
        mockContainer = containerGenerator.create();
    });

    it('should implement Subsystem interface', function () {
        interface.assert.subsystems(entitySubsystem);
    });

    it('should update entities', function () {
        var stubEntity1 = sinon.stub(new Entity());
        var stubEntity2 = sinon.stub(new Entity());

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        var expectedDelta = Math.random();
        mockContainer.delta = expectedDelta;
        entitySubsystem.update(mockContainer);

        assert.equal(expectedDelta, stubEntity1.update.firstCall.args[0]);
        assert.equal(expectedDelta, stubEntity2.update.firstCall.args[0]);

    });

    it('should render entities', function () {
        var stubEntity1 = sinon.stub(new Entity());
        var stubEntity2 = sinon.stub(new Entity());

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        var renderSpy = sinon.spy();
        entitySubsystem.render(renderSpy);

        assert.isFalse(renderSpy.called);
        assert.equal(renderSpy, stubEntity1.render.firstCall.args[0]);
        assert.equal(renderSpy, stubEntity2.render.firstCall.args[0]);


    });
});