/**
 * Created by omnic on 11/29/2015.
 */
var UpdateManager = require('../../src/engine/UpdateManager');

describe('UpdateManager', function () {
    it('should update its subsystems', function () {
        var subsystem1 = createMockSubsystem();
        var subsystem2 = createMockSubsystem();
        var expectedDelta = Math.random() * 100;

        var updateManager = new UpdateManager();
        updateManager.addSubsystem(subsystem1);
        updateManager.addSubsystem(subsystem2);

        assert.isFalse(subsystem1.update.called);
        assert.isFalse(subsystem2.update.called);

        updateManager.update(expectedDelta);

        assert.isTrue(subsystem1.update.calledOnce);
        assert.isTrue(subsystem2.update.calledOnce);
        assert.equal(expectedDelta, subsystem1.update.firstCall.args[0]);
        assert.equal(expectedDelta, subsystem2.update.firstCall.args[0]);
    });

    function createMockSubsystem(){
        return {
            update : sinon.spy()
        };
    }

});