/**
 * Created by Eric on 3/19/2015.
 */


var SpaceRocks = (function (spaceRocks) {
    var lastFrame;
    spaceRocks.delta = function () {
        var now = TimeWrapper.getTime();
        var elapsed = now - lastFrame;
        var delta = elapsed / (1000 / spaceRocks.fps);
        lastFrame = now;
        return Math.min(10.0, delta);
    };
    spaceRocks.fps = 24;
    return spaceRocks;
})(SpaceRocks || {});