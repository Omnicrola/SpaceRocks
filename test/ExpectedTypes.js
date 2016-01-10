/**
 * Created by omnic on 12/27/2015.
 */
module.exports = {
    entities: {
        ASTEROID_LARGE: 'asteroid-large',
        ASTEROID_MEDIUM: 'asteroid-medium',
        ASTEROID_SMALL: 'asteroid-small',
        PLAYER: 'player',
        FX: 'fx',
        BULLET: 'bullet'
    },
    events: {
        ENGINE_START: 'engine-start',
        ENTITY_DEATH: 'entity-death',
        ENTITY_ADDED: 'entity-added',
        ENTITY_REMOVED: 'entity-removed',
        GAME_RESET: 'game-reset',
        NEW_LEVEL: 'new-level',
        NEW_GAME: 'new-game',
        PLAYER_LIFE_CHANGE: 'player-life-change',
        PLAYER_FIRE: 'player-fire',
        PLAYER_THRUST: 'player-thrust',
        STATE_CHANGE: 'state-change',
        SCORE_CHANGE: 'score-change',
    },
    state: {
        LOADING: 'loading',
        START: 'start-screen',
        PLAY: 'play',
        GAME_OVER: 'game-over'
    }
};