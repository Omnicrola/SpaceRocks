/**
 * Created by Eric on 12/10/2015.
 */

var Time = require('../engine/Time');
var SpaceEngine = require('../engine/SpaceEngine');
var LevelManager = require('../subsystems/LevelManager');
var PlayerSubsystem = require('../subsystems/PlayerSubsystem');
var EntitySubsystem = require('../subsystems/entities/EntitySubsystem');

module.exports = (function () {
    var spacerocks = function (canvasId) {
        var subsystems = _createSubsystems();
        new SpaceEngine({
            fps: 30,
            audioPath: '',
            canvas: canvasId,
            subsystems: subsystems
        }).start();
    };

    function _createSubsystems() {
        var entitySubsystem = new EntitySubsystem();
        var levelManager = new LevelManager(entitySubsystem);
        var playerSubsystem = new PlayerSubsystem({
            entitySubsystem: entitySubsystem,
            time: new Time(),
            playerWeaponDelay: 250
        });
        return [
            levelManager,
            playerSubsystem,
            entitySubsystem
        ];
    }

    return spacerocks;
})();