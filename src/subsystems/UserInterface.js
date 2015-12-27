/**
 * Created by Eric on 12/26/2015.
 */
var UserInterface = function () {
    this._score = 0;
    this._lives = 0;
};

UserInterface.prototype.initialize = function (gameContainer) {
    var subscribe = gameContainer.events.subscribe;
    subscribe('score-change', _scoreChange.call(this, gameContainer));
    subscribe('player-life-change', _playerLifeChange.call(this, gameContainer));
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

UserInterface.prototype.update = function (gameContainer) {
};

UserInterface.prototype.render = function (renderer) {
    renderer.setFont('12px atari');
    renderer.drawText(10, 20, 'SCORE: ' + this._score);
    renderer.drawText(500, 20, 'LIVES: ' + this._lives);
};


module.exports = UserInterface;