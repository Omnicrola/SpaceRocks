/**
 * Created by Eric on 3/24/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var state = {
        up: false,
        down: false,
        left: false,
        right: false
    };

    function bindKey(kibo, stateName) {
        kibo.up(stateName, function () {
            state[stateName] = false;
        });
        kibo.down(stateName, function () {
            state[stateName] = true;
        });
    }

    var initFunc = function (kibo) {
        bindKey(kibo, 'up');
        bindKey(kibo, 'down');
        bindKey(kibo, 'left');
        bindKey(kibo, 'right');
    };
    spaceRocks.InputManager = {
        init: initFunc,
        isAccellerating: function () {
            return state['up'];
        },
        isDecellerating: function () {
            return state['down'];
        },
        rotateCounterClockwise: function () {
            return state['left'];
        },
        rotateClockwise: function () {
            return state['right'];
        }
    };
    return spaceRocks;
})
(SpaceRocks || {});