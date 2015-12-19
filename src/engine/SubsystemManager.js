/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {
    var subsystemManager = function () {
        this._subsystems = [];
    };

    subsystemManager.prototype.addSubsystem = function (subsystem) {
        this._subsystems.push(subsystem);
    };

    subsystemManager.prototype.update = function (updateContainer) {
        this._subsystems.forEach(function (subsystem) {
            subsystem.update(updateContainer);
        });
    };

    subsystemManager.prototype.render = function (renderer) {
        this._subsystems.forEach(function (subsystem) {
            subsystem.render(renderer);
        });
    };
    return subsystemManager;
})();