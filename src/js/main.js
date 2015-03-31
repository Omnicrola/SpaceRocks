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
    function playerShape(){
        return new spaceRocks.Polygon([
            new spaceRocks.Point(-5,-5),
            new spaceRocks.Point(0,5),
            new spaceRocks.Point(5,-5),
            new spaceRocks.Point(0,0)
        ]);
    }

    spaceRocks.start = function (elementId) {
        globals.setInterval(spaceRocks.run, 1000 / 24);
        var player = new SpaceRocks.Entity(0,0,playerShape());
        player.position = {x: 100, y: 100};
        player.velocity = {x: 0.05, y: 0.0};
        spaceRocks.EntityManager.player(player);
        var canvasContext = document.getElementById(elementId).getContext('2d');
        spaceRocks.Renderer.setCanvas(canvasContext);
        spaceRocks.InputManager.init(new Kibo());
    };
    return spaceRocks;
})(window, SpaceRocks || {});

