/**
 * Created by Eric on 12/26/2015.
 */
var UserInterface = function () {
    this._score = 0;
    this._lives = 0;
    this._displayStartMessage = true;
    this._displayGameOver = false;
};

UserInterface.prototype.initialize = function (gameContainer) {
    var subscribe = gameContainer.events.subscribe;
    subscribe('score-change', _scoreChange.call(this, gameContainer));
    subscribe('player-life-change', _playerLifeChange.call(this, gameContainer));
    subscribe('game-reset', _gameReset.call(this, gameContainer));
    subscribe('new-level', _newLevel.call(this, gameContainer));
    subscribe('new-game', _newGame.call(this, gameContainer));
    subscribe('state-change', _stateChange.call(this, gameContainer));
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
        this._displayStartMessage = true;
    }.bind(this);
}

function _newGame(gameContainer){
    return function(event){
        this._displayGameOver = false;
    }.bind(this);
}

function _newLevel(gameContainer) {
    return function () {
        this._displayStartMessage = false;
    }.bind(this);
}

function _stateChange(gameContainer) {
    return function (event) {
        if (event.type === 'state-change') {
            if (event.data.state == 'game-over') {
                this._displayGameOver = true;
            }
        }
    }.bind(this);
}

UserInterface.prototype.update = function (gameContainer) {
};

UserInterface.prototype.render = function (renderer) {
    renderer.setFont('12px atari');
    renderer.drawText(10, 20, 'SCORE: ' + this._score);
    renderer.drawText(500, 20, 'LIVES: ' + this._lives);
    if (this._displayStartMessage) {
        renderer.setFont('16px atari');
        renderer.drawText(300, 300, 'PRESS SPACE TO START');
    }
    if (this._displayGameOver) {
        renderer.setFont('16px atari');
        renderer.drawText(250, 250, 'GAME OVER');
    }
};


module.exports = UserInterface;