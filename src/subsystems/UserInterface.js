/**
 * Created by Eric on 12/26/2015.
 */
var UserInterface = function () {
    this._score = 0;
    this._lives = 0;
    this._shouldDisplayStartMessage = true;
};

UserInterface.prototype.initialize = function (gameContainer) {
    var subscribe = gameContainer.events.subscribe;
    subscribe('score-change', _scoreChange.call(this, gameContainer));
    subscribe('player-life-change', _playerLifeChange.call(this, gameContainer));
    subscribe('game-reset', _gameReset.call(this, gameContainer));
    subscribe('new-level', _newLevel.call(this, gameContainer));
};

function _scoreChange(gameContainer) {
    return function (event) {
        this._score = event.data.score;
    }.bind(this);
}

function _playerLifeChange(gameContainer) {
    return function (event) {
        this._lives = event.data.lives;
    }.bind(this);
}

function _gameReset(gameContainer) {
    return function (event) {
        this._shouldDisplayStartMessage = true;
    }.bind(this);
}
function _newLevel(gameContainer) {
    return function () {
        this._shouldDisplayStartMessage = false;
    }.bind(this);
}

UserInterface.prototype.update = function (gameContainer) {
};

UserInterface.prototype.render = function (renderer) {
    renderer.setFont('12px atari');
    renderer.drawText(10, 20, 'SCORE: ' + this._score);
    renderer.drawText(500, 20, 'LIVES: ' + this._lives);
    if (this._shouldDisplayStartMessage) {
        renderer.drawText(300, 300, 'PRESS SPACE TO START');
    }
};


module.exports = UserInterface;