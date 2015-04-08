/**
 * Created by Eric on 3/14/2015.
 */
var SpaceRocks = (function (globals, spaceRocks) {
    'use strict';
    spaceRocks.run = function () {
        var delta = spaceRocks.delta();
        spaceRocks.update(delta);
        spaceRocks.draw();
    };


    spaceRocks.start = function (elementId) {
        globals.setInterval(spaceRocks.run, 1000 / 24);
        var canvasContext = document.getElementById(elementId).getContext('2d');
        spaceRocks.Renderer.setCanvas(canvasContext);
        spaceRocks.InputManager.init(new Kibo());
        spaceRocks.Logic.init();
        spaceRocks.LevelManager.setState(LevelState.START());
    };
    return spaceRocks;
})(window, SpaceRocks || {});

