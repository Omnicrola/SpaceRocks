/**
 * Created by Eric on 3/19/2015.
 */


var SpaceRocks = (function (spaceRocks) {
    var lastFrame = new Date().getTime();
    spaceRocks.delta = function () {
        var now = new Date().getTime();
        var elapsed = now-lastFrame;
        var delta = elapsed / (1000 / spaceRocks.fps) ;
        lastFrame = now;
        return delta;
    };
    spaceRocks.fps = 24;
    return spaceRocks;
})(SpaceRocks || {});