/**
 * Created by Eric on 12/10/2015.
 */

var Time = require('../engine/Time');
var SpaceEngine = require('../engine/SpaceEngine');
var StateManager = require('../subsystems/state/StateManager');
var PlayerSubsystem = require('../subsystems/PlayerSubsystem');
var EntitySubsystem = require('../subsystems/entities/EntitySubsystem');
var EffectsSubsystem = require('../subsystems/fx/EffectsSubsystem');
var UserInterface = require('../subsystems/UserInterface');

module.exports = (function () {
    var spacerocks = function (canvasId) {
        var subsystems = _createSubsystems();
        new SpaceEngine({
            fps: 30,
            audioPath: 'audio/',
            canvas: canvasId,
            subsystems: subsystems
        }).start();
    };

    function _createSubsystems() {
        var entitySubsystem = new EntitySubsystem();
        var stateManager = new StateManager(entitySubsystem);
        var playerSubsystem = new PlayerSubsystem({
            entitySubsystem: entitySubsystem,
            time: new Time(),
            playerWeaponDelay: 250
        });
        var effectsSubsystem = new EffectsSubsystem(entitySubsystem);
        var userInterface = new UserInterface();
        return [
            stateManager,
            playerSubsystem,
            entitySubsystem,
            effectsSubsystem,
            userInterface
        ];
    }

    return spacerocks;
})();