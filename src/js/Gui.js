/**
 * Created by Eric on 4/7/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var _score = 0;

    function _incrementScore(amount) {
        _score += amount;
    }

    function _render() {
        spaceRocks.Renderer.drawText(10, 20, 'Score: ' + _score);
    }

    spaceRocks.Gui = {
        render: _render,
        incrementScore: _incrementScore
    };

    return spaceRocks;
})(SpaceRocks || {});