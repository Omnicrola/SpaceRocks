/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    function setPosition(context, x, y) {
        context.position.x = x || 0;
        context.position.y = y || 0;
    }

    var protoClass = function (x, y, shape) {
        this.position = {
            x: 0,
            y: 0
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.shape = shape;
        setPosition(this, x, y);
    };
    protoClass.prototype.update = function (delta) {
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
    };
    spaceRocks.Entity = protoClass;
    return spaceRocks;

})(SpaceRocks || {});
/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var entities = [];
    var player;
    var addEntityFunc = function (newEntity) {
        entities.push(newEntity);
    };
    var removeEntityFunc = function (entityToRemove) {
        var index = entities.indexOf(entityToRemove);
        entities.splice(index, 1);
    };
    var invokeOnEntities = function (customFunction) {
        if (player) {
            customFunction(player);
        }
        entities.forEach(function (entity) {
            customFunction(entity);
        });
    };
    var playerFunc = function (newPlayer) {
        if (!newPlayer) {
            return player;
        }
        player = newPlayer;
    };
    spaceRocks.EntityManager = {
        addEntity: addEntityFunc,
        player: playerFunc,
        removeEntity: removeEntityFunc,
        callEntities: invokeOnEntities
    };

    return spaceRocks;
})(SpaceRocks || {});
/**
 * Created by Eric on 3/22/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    function createShape() {
        var Point = spaceRocks.Point;
        var Polygon = spaceRocks.Polygon;
        return new Polygon([
            new Point(0, 5),
            new Point(5, -5),
            new Point(0, 0),
            new Point(-5, -5)
        ]);
    }

    var protoClass = function () {
        spaceRocks.Entity.call(this);
        this.shape = createShape();
    };

    spaceRocks.Player = protoClass;
    return spaceRocks;
})(SpaceRocks || {});
/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    spaceRocks.Point = function (x, y) {
        this.x = x;
        this.y = y;
    };
    return spaceRocks;
})(SpaceRocks || {});

/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks=(function(spaceRocks){
    var protoClass = function(points){
        this.points = points;
    };
    protoClass.prototype.getPoints = function(){
        return this.points;
    };
    spaceRocks.Polygon = protoClass;
    return spaceRocks;
})(SpaceRocks||{});
/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var canvasContext;
    var lineFunc = function (x1, y1, x2, y2) {
        canvasContext.strokeStyle = '#FFFFFF';
        canvasContext.beginPath();
        canvasContext.moveTo(x1, y1);
        canvasContext.lineTo(x2, y2);
        canvasContext.stroke();
    };
    var fillRectFunc = function (style, x, y, w, h) {
        canvasContext.fillStyle = style;
        canvasContext.fillRect(x, y, w, h);
    };
    var setCanvasFunc = function (newContext) {
        canvasContext = newContext;
    };
    spaceRocks.Renderer = {
        drawLine: lineFunc,
        fillRectangle: fillRectFunc,
        setCanvas: setCanvasFunc,
        width: function () {
            return canvasContext.canvas.width;
        },
        height: function () {
            return canvasContext.canvas.height;
        }
    };
    return spaceRocks;
})(SpaceRocks || {});
/**
 * Created by Eric on 3/21/2015.
 */
var TimeWrapper = (function () {
    return {
        getTime: function () {
            return new Date().getTime();
        }
    };
})();
/**
 * Created by Eric on 3/19/2015.
 */


var SpaceRocks = (function (spaceRocks, timeWrapper) {
    var lastFrame = timeWrapper.getTime();
    spaceRocks.delta = function () {
        var now = timeWrapper.getTime();
        var elapsed = now - lastFrame;
        var delta = elapsed / (1000 / spaceRocks.fps);
        lastFrame = now;
        return Math.min(10.0, delta);
    };
    spaceRocks.fps = 24;
    return spaceRocks;
})(SpaceRocks || {}, TimeWrapper);
/**
 * Created by Eric on 3/22/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    function fillBackground() {
        var width = spaceRocks.Renderer.width();
        var height = spaceRocks.Renderer.height();

        spaceRocks.Renderer.fillRectangle(
            '#000000',
            0, 0,
            width, height);
    }

    var drawLine = function (offset, point1, point2) {
        var p1 = new spaceRocks.Point(point1.x + offset.x, point1.y + offset.y);
        var p2 = new spaceRocks.Point(point2.x + offset.x, point2.y + offset.y);
        spaceRocks.Renderer.drawLine(p1.x, p1.y, p2.x, p2.y);
    };
    var drawEntityShape = function (entity) {
        var points = entity.shape.points;
        for (var i = 0; i < points.length - 1; i++) {
            drawLine(entity.position, points[i], points[i + 1]);
        }
        drawLine(entity.position, points[points.length - 1], points[0]);
    };
    spaceRocks.draw = function () {
        fillBackground();
        spaceRocks.EntityManager.callEntities(drawEntityShape);
    };
    return spaceRocks;
})(SpaceRocks || {});
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
        player.position = {x:100,y:100};
        spaceRocks.EntityManager.player(player);
        var canvasContext = document.getElementById(elementId).getContext('2d');
        spaceRocks.Renderer.setCanvas(canvasContext);
    };
    return spaceRocks;
})(window, SpaceRocks || {});


/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    spaceRocks.update = function () {
    };
    return spaceRocks;
})(SpaceRocks || {});