/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {
    var updateManager = function () {
        this._subsystems = [];
    };
    updateManager.prototype.addSubsystem = function (subsystem) {
        this._subsystems.push(subsystem);
    };
    updateManager.prototype.update = function (delta) {
        this._subsystems.forEach(function (subsystem) {
            subsystem.update(delta);
        });
    };
    return updateManager;
})();