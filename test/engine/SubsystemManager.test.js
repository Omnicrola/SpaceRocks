/**
 * Created by omnic on 11/29/2015.
 */
var SubsystemManager = require('../../src/engine/SubsystemManager');
var Renderer = require('../../src/engine/Renderer');

describe('SubsystemManager', function () {
    it('should update its subsystems', function () {
        var subsystem1 = createMockSubsystem();
        var subsystem2 = createMockSubsystem();
        var expectedDelta = Math.random() * 100;

        var subsystemManager = new SubsystemManager();
        subsystemManager.addSubsystem(subsystem1);
        subsystemManager.addSubsystem(subsystem2);

        assert.isFalse(subsystem1.update.called);
        assert.isFalse(subsystem2.update.called);

        subsystemManager.update(expectedDelta);

        assert.isTrue(subsystem1.update.calledOnce);
        assert.isTrue(subsystem2.update.calledOnce);
        assert.equal(expectedDelta, subsystem1.update.firstCall.args[0]);
        assert.equal(expectedDelta, subsystem2.update.firstCall.args[0]);
    });

    it('should render its subsystems', function () {
        var mockSubsystem1 = createMockSubsystem();
        var mockSubsystem2 = createMockSubsystem();
        var mockRenderer = {};

        var subsystemManager = new SubsystemManager();
        subsystemManager.addSubsystem(mockSubsystem1);
        subsystemManager.addSubsystem(mockSubsystem2);


        assert.isFalse(mockSubsystem1.render.called);
        assert.isFalse(mockSubsystem2.render.called);

        subsystemManager.render(mockRenderer);

        assert.isTrue(mockSubsystem1.render.calledOnce);
        assert.isTrue(mockSubsystem2.render.calledOnce);
        assert.strictEqual(mockRenderer, mockSubsystem1.render.firstCall.args[0]);
        assert.strictEqual(mockRenderer, mockSubsystem2.render.firstCall.args[0]);

    });

    function createMockSubsystem() {
        return {
            update: sinon.spy(),
            render: sinon.spy()
        };
    }

});