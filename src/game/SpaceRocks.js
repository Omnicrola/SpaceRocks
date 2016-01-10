/**
 * Created by Eric on 12/10/2015.
 */

var Time = require('../engine/Time');
var SpaceEngine = require('../engine/SpaceEngine');
var StateManager = require('../subsystems/state/StateManager');
var GameStateBuilder = require('./GameStateBuilder');
var PlayerSubsystem = require('../subsystems/PlayerSubsystem');
var EntitySubsystem = require('../subsystems/entities/EntitySubsystem');
var EntityFactory = require('../subsystems/entities/EntityFactory');
var EffectsSubsystem = require('../subsystems/fx/EffectsSubsystem');
var UserInterface = require('../subsystems/UserInterface');


var SpaceRocks = function (canvasId) {
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
    var playerSubsystem = new PlayerSubsystem({
        entitySubsystem: entitySubsystem,
        time: new Time(),
        playerWeaponDelay: 250
    });
    var stateManager = createGameStates(entitySubsystem, playerSubsystem);
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

function createGameStates(entitySubsystem, playerSubsystem) {
    var stateManager = new StateManager();
    var loadingState = GameStateBuilder.buildLoadingState(stateManager);
    var startScreen = GameStateBuilder.buildStartScreen(stateManager, playerSubsystem);
    var gameOverState = GameStateBuilder.buildGameOverState(stateManager);
    var playState = GameStateBuilder.buildPlayState(
        {
            stateManager: stateManager,
            entityFactory: EntityFactory,
            entitySubsystem: entitySubsystem,
            playerSubsystem: playerSubsystem
        });

    stateManager.addState(loadingState);
    stateManager.addState(startScreen);
    stateManager.addState(playState);
    stateManager.addState(gameOverState);
    return stateManager;
}

module.exports = SpaceRocks;

