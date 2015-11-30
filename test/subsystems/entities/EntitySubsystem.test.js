/**
 * Created by omnic on 11/29/2015.
 */
var EntitySubsystem = require('../../../src/subsystems/entities/EntitySubsystem');
var Entity = require('../../../src/subsystems/entities/Entity');
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

describe('EntitySubsystem', function () {
    var entitySubsystem;
    beforeEach(function () {
        entitySubsystem = new EntitySubsystem();
    });

    it('should implement Subsystem interface', function () {
        assert.equal('function', typeof entitySubsystem.update);
        assert.equal('function', typeof entitySubsystem.render);
    });

    it('should update entities', function () {
        var stubEntity1 = sinon.stub(new Entity());
        var stubEntity2 = sinon.stub(new Entity());

        entitySubsystem.addEntity(stubEntity1);
        entitySubsystem.addEntity(stubEntity2);

        var delta = Math.random();
        entitySubsystem.update(delta);

        assert.equal(delta, stubEntity1.update.firstCall.args[0]);
        assert.equal(delta, stubEntity2.update.firstCall.args[0]);

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