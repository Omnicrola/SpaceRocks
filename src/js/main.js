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

    function spawnPlayer() {
        var playerShape = spaceRocks.Shapes.player();
        var newPlayer = spaceRocks.Entity.build(100, 100, playerShape);
        spaceRocks.EntityManager.player(newPlayer);
    }

    spaceRocks.start = function (elementId) {
        globals.setInterval(spaceRocks.run, 1000 / 24);
        spawnPlayer();
        var canvasContext = document.getElementById(elementId).getContext('2d');
        spaceRocks.Renderer.setCanvas(canvasContext);
        spaceRocks.InputManager.init(new Kibo());
    };
    return spaceRocks;
})(window, SpaceRocks || {});

