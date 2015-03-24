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
        var player = new SpaceRocks.Player();
        player.position = {x: 100, y: 100};
        player.velocity = {x: 0.05, y: 0.0};
        spaceRocks.EntityManager.player(player);
        var canvasContext = document.getElementById(elementId).getContext('2d');
        spaceRocks.Renderer.setCanvas(canvasContext);
        spaceRocks.InputManager.init(new Kibo());
    };
    return spaceRocks;
})(window, SpaceRocks || {});

