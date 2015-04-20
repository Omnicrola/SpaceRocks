/**
 * Created by Eric on 4/5/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var VELOCITY_RANGE = 4.0;

    function _getRandomPosition() {
        var random = new Random();
        var screenWidth = spaceRocks.Renderer.width();
        var screenHeight = spaceRocks.Renderer.height();

        pX = random.nextInteger(screenWidth);
        pY = random.nextInteger(screenHeight);
        return {x: pX, y: pY};
    }

    function _createRandomVelocity() {
        var vX = (Math.random() * VELOCITY_RANGE) - (VELOCITY_RANGE / 2);
        var vY = (Math.random() * VELOCITY_RANGE) - (VELOCITY_RANGE / 2);
        return new spaceRocks.Point(vX, vY);
    }

    function _createSpinBehavior() {
        var spinRate = Math.random() * 2;
        return function (entity) {
            var currentAngle = entity.rotation();
            entity.rotation(currentAngle + spinRate);
        }
    }

    function _createIncrementScoreBehavior(){
        var score = 25;
        return function(entity){
            spaceRocks.Gui.incrementScore(score);
        }
    }

    function _build() {
        var position = _getRandomPosition();
        var asteroidShape = spaceRocks.Shapes.asteroid();
        var asteroid = new spaceRocks.Entity(position.x, position.y, asteroidShape);
        asteroid.velocity = _createRandomVelocity();
        asteroid.addBehavior(_createSpinBehavior());
        asteroid.setDeathBehavior(_createIncrementScoreBehavior());
        return asteroid;
    }


    spaceRocks.AsteroidFactory = {
        build: _build
    }

    return spaceRocks;
})(SpaceRocks || {});
/**
 * Created by Eric on 4/4/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    var BULLET_VELOCITY = 5.0;

    function selfDestructBehavior(entity, delta) {
        if (!entity.lifetime) {
            entity.lifetime = delta;
        } else {
            entity.lifetime += delta;
        }
        if (entity.lifetime >= 30) {
            entity.destroy();
        }
    }

    function build(pX, pY, rotation) {
        var shape = spaceRocks.Shapes.bullet();
        var bullet = new spaceRocks.Entity(pX, pY, shape);
        bullet.velocity = new spaceRocks.Point(0, BULLET_VELOCITY).rotate(rotation);
        bullet.addBehavior(selfDestructBehavior);
        return bullet;
    }

    spaceRocks.BulletFactory = {
        build: build
    };

    return spaceRocks;
})(SpaceRocks || {});
/**
 * Created by Eric on 4/18/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var entities = {};
    var groups = [];

    function _addEntity(entity, collisionGroup) {
        if (!collisionGroup) {
            throw 'No collision group specified.';
        }
        if (!entities.hasOwnProperty(collisionGroup)) {
            entities[collisionGroup] = [];
            groups.push(collisionGroup);
        }
        entities[collisionGroup].push(entity);
    }

    function _removeEntity(entity) {

    }

    function _removeAllEntities() {
        entities = {};
        groups = [];
    }

    function _checkCollisions() {
        groups.forEach(function (firstGroupName) {
            groups.forEach(function (secondGroupName) {
                if (firstGroupName !== secondGroupName) {
                    _collideTwoGroupsByName(firstGroupName, secondGroupName);
                }
            });
        });
    }

    function _collideTwoGroupsByName(firstGroupName, secondGroupName) {
        var firstGroup = entities[firstGroupName];
        var secondGroup;
        firstGroup.forEach(function (firstEntity) {
            secondGroup = entities[secondGroupName];
            secondGroup.forEach(function (secondEntity) {
                _checkSingleCollision(firstEntity, secondEntity);
            });
        });
    }

    function _checkSingleCollision(firstEntity, secondEntity) {
        var bothAreAlive = firstEntity.isAlive() && secondEntity.isAlive();
        var areNotSameEntity = (firstEntity !== secondEntity);
        if (bothAreAlive && areNotSameEntity) {
            if (firstEntity.collide(secondEntity)) {
                firstEntity.destroy();
                secondEntity.destroy();
            }
        }
    }


    spaceRocks.CollisionManager = {
        addEntity: _addEntity,
        removeEntity: _removeEntity,
        checkCollisions: _checkCollisions,
        removeAllEntities: _removeAllEntities,
        ASTEROIDS_GROUP: function () {
            return 1;
        },
        PLAYER_GROUP: function () {
            return 2;
        }
    };
    return spaceRocks;
})(SpaceRocks || {});
/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    function setPosition(x, y) {
        this.position.x = x || 0;
        this.position.y = y || 0;
    }

    var _entity = function (x, y, shape) {
        this.position = new spaceRocks.Point(x, y);
        this.velocity = new spaceRocks.Point(0, 0);
        this.shape = shape;
        this._isAlive = true;
        this._deathBehavior = function () { };
        this.behaviors = [];
        setPosition.call(this, x, y);
    };



    _entity.prototype.rotation = function (newAngle) {
        if (newAngle) {
            this.shape.angle = newAngle;
        }
        return this.shape.angle;
    };

    function wrapPositionOnScreen() {
        var maxX = spaceRocks.Renderer.width();
        var maxY = spaceRocks.Renderer.height();
        if (this.position.x > maxX) {
            this.position.x -= maxX;
        } else if (this.position.x < 0) {
            this.position.x += maxX;
        }
        if (this.position.y > maxY) {
            this.position.y -= maxY;
        } else if (this.position.y < 0) {
            this.position.y += maxY;
        }

    }

    function invokeBehaviors(delta) {
        var currentEntity = this;
        this.behaviors.forEach(function (singleBehavior) {
            singleBehavior(currentEntity, delta);
        });
    }

    _entity.prototype.update = function (delta) {
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        if (isNaN(this.position.x) || isNaN(this.position.y)) {
            throw "position was NaN";
        }
        wrapPositionOnScreen.call(this);
        invokeBehaviors.call(this, delta);
    };

    _entity.prototype.addBehavior = function (newBehavior) {
        this.behaviors.push(newBehavior);
    };

    _entity.prototype.collide = function (otherEntity) {
        var offsetX = this.position.x - otherEntity.position.x;
        var offsetY = this.position.y - otherEntity.position.y;
        return this.shape.intersects(otherEntity.shape, offsetX, offsetY);
    }

    _entity.prototype.isAlive = function () {
        return this._isAlive;
    }

    _entity.prototype.setDeathBehavior = function (deathBehavior) {
        this._deathBehavior = deathBehavior;
    }

    _entity.prototype.destroy = function () {
        this._isAlive = false;
        this._deathBehavior(this);
    }

    _entity.build = function (x, y, shape, type) {
        return new _entity(x, y, shape, type)
    };

    spaceRocks.Entity = _entity;
    return spaceRocks;

})(SpaceRocks || {});
/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var entities = [];
    var player;

    function _addEntity(newEntity, collisionGroup) {
        entities.push(newEntity);
        spaceRocks.CollisionManager.addEntity(newEntity, collisionGroup);
    }

    function _removeEntity(entityToRemove) {
        var index = entities.indexOf(entityToRemove);
        entities.splice(index, 1);
        spaceRocks.CollisionManager.removeEntity(entityToRemove);
    }

    function _callEntities(customFunction) {
        if (player) {
            customFunction(player);
        }
        entities.forEach(function (entity) {
            customFunction(entity);
        });
    }

    function _cleanDeadEntities() {
        var entitiesCopy = [];
        entities.forEach(function (singleEntity) {
            if (singleEntity.isAlive()) {
                entitiesCopy.push(singleEntity);
            }
        });
        entities = entitiesCopy;
    }

    function _player(newPlayer) {
        if (!newPlayer) {
            return player;
        }
        player = newPlayer;
        var collisionGroup = spaceRocks.CollisionManager.PLAYER_GROUP();
        spaceRocks.CollisionManager.addEntity(newPlayer, collisionGroup);
    };

    function _removeAllEntities() {
        entities = [];
    }

    spaceRocks.EntityManager = {
        addEntity: _addEntity,
        player: _player,
        removeEntity: _removeEntity,
        callEntities: _callEntities,
        cleanDeadEntities: _cleanDeadEntities,
        removeAllEntities: _removeAllEntities
    };

    return spaceRocks;
})(SpaceRocks || {});
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
/**
 * Created by Eric on 3/24/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var state = {
        up: false,
        down: false,
        left: false,
        right: false,
        space: false
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
        bindKey(kibo, 'space');
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
        },
        fireWeapon : function(){
            return state['space']
        }
    };
    return spaceRocks;
})
(SpaceRocks || {});
/**
 * Created by Eric on 4/5/2015.
 */
var LevelState = (function () {
    return {
        START: function () {
            return 'START'
        },
        END: function () {
            return 'END'
        },
        DEAD: function () {
            return 'DEAD'
        },
        SPAWN: function () {
            return 'SPAWN'
        },
        PLAY: function () {
            return 'PLAY'
        }
    }
})();

var SpaceRocks = (function (spaceRocks) {

    var currentLevelNumber = 0;
    var levelState = LevelState.END();
    var _observers = [];

    function _currentLevel() {
        return currentLevelNumber;
    }

    function _addObserver(observer) {
        _observers.push(observer);
    }


    function _startNextLevel() {
        currentLevelNumber++;
    }

    function _spawnPlayer() {
        var playerShape = spaceRocks.Shapes.player();
        var newPlayer = spaceRocks.Entity.build(100, 100, playerShape);
        spaceRocks.EntityManager.player(newPlayer);
    }

    function notifyObserversOfState(){
        _observers.forEach(function(singleObserver){
           singleObserver(levelState);
        });
    }

    function _setState(newState){
        levelState = newState;
        notifyObserversOfState();
    }

    spaceRocks.LevelManager = {
        currentLevel: _currentLevel,
        startNextLevel: _startNextLevel,
        addObserver: _addObserver,
        setState : _setState
    };
    return spaceRocks;
})
(SpaceRocks || {});

/**
 * Created by Eric on 4/7/2015.
 */
var SpaceRocks = (function (spaceRocks) {


    function _spawnPlayer() {
        var pX = spaceRocks.Renderer.width() / 2;
        var pY = spaceRocks.Renderer.height() / 2;
        var player = spaceRocks.Entity.build(pX, pY, spaceRocks.Shapes.player());
        spaceRocks.EntityManager.player(player);
    }

    function _spawnAsteroids(){
        var collisionGroup = spaceRocks.CollisionManager.ASTEROIDS_GROUP();
        for (var i = 0; i < 5; i++) {
            var asteroid = spaceRocks.AsteroidFactory.build();
            spaceRocks.EntityManager.addEntity(asteroid, collisionGroup);
        }
    }

    function _init() {
        spaceRocks.LevelManager.addObserver(_spawnPlayer);
        spaceRocks.LevelManager.addObserver(_spawnAsteroids);
    }

    spaceRocks.Logic = {
        init: _init
    };
    return spaceRocks;
})(SpaceRocks || {});
/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    var _point = function (x, y) {
        this.x = x;
        this.y = y;
    };

    _point.prototype.distance = function (otherPoint) {
        var a = this.x - otherPoint.x;
        var b = this.y - otherPoint.y;
        var c2 = a*a + b*b;
        return Math.sqrt(c2);
    };

    _point.prototype.rotate = function(degrees){
        var theta = degrees * Math.PI / 180.0;
        var x = Math.cos(theta) * this.x - Math.sin(theta) * this.y;
        var y = Math.sin(theta) * this.x + Math.cos(theta) * this.y;
        return new spaceRocks.Point(x, y);
    };

    spaceRocks.Point = _point;
    return spaceRocks;
})(SpaceRocks || {});

/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var _polygon = function (points) {
        this.pointArray = points;
        this.angle = 0;
    };

    _polygon.prototype.getPoints = _getPoints
    function _getPoints(offsetX, offsetY) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        var rotatedPoints = [];
        var theta = this.angle;
        this.pointArray.forEach(function (singlePoint) {
            var rotatedPoint = singlePoint.rotate(theta);
            rotatedPoint.x += offsetX;
            rotatedPoint.y += offsetY;
            rotatedPoints.push(rotatedPoint);
        });
        return rotatedPoints;
    };

    function _findMaxPoint(points) {
        var maxX = Number.MIN_VALUE;
        var maxY = Number.MIN_VALUE;
        points.forEach(function (singlePoint) {
            maxX = (singlePoint.x > maxX) ? singlePoint.x : maxX;
            maxY = (singlePoint.y > maxY) ? singlePoint.y : maxY;
        });
        return new spaceRocks.Point(maxX, maxY);
    }

    function _findMinPoint(points) {
        var minX = Number.MAX_VALUE;
        var minY = Number.MAX_VALUE;
        points.forEach(function (singlePoint) {
            minX = (singlePoint.x < minX) ? singlePoint.x : minX;
            minY = (singlePoint.y < minY) ? singlePoint.y : minY;
        });
        return new spaceRocks.Point(minX, minY);
    }

    _polygon.prototype.contains = _contains;
    function _contains(pointToContain) {
        var rotatedPoints = this.getPoints();
        var max = _findMaxPoint(rotatedPoints);
        var min = _findMinPoint(rotatedPoints);
        if (pointToContain.x < min.x || pointToContain.x > max.x) {
            return false;
        }
        if (pointToContain.y < min.y || pointToContain.y > max.y) {
            return false;
        }
        return true;
    }

    _polygon.prototype.intersects = _intersects;
    function _intersects(otherPolygon, offsetX, offsetY) {
        var otherPoints = otherPolygon.getPoints(offsetX, offsetY);
        var intersects = false;
        otherPoints.forEach(function (singlePoint) {
            if (this.contains(singlePoint)) {
                intersects = true;
            }
        }.bind(this));
        return intersects;
    }


    spaceRocks.Polygon = _polygon;
    return spaceRocks;
})(SpaceRocks || {});
/**
 * Created by Eric on 4/5/2015.
 */
var Random = (function () {
    function _random(seedToUse) {
        if (!seedToUse) {
            this.seed = generateSeed();
        } else {
            this.seed = seedToUse;
        }
    }

    function generateSeed() {
        return new Date().getUTCMilliseconds() + Math.random() * 100;
    }

    function _nextInteger(max) {
        if (!max) {
            max = Number.MAX_VALUE;
        }
        var v = Math.sin(this.seed++) * max;
        return Math.abs(Math.floor(v));
    }

    function _next() {
        var v = Math.sin(this.seed++) * 10000;
        return Math.abs(v - Math.floor(v));
    }

    _random.prototype.next = _next;
    _random.prototype.nextInteger = _nextInteger;
    return _random;
})();
/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var canvasContext;

    function _lineFunc(x1, y1, x2, y2) {
        canvasContext.strokeStyle = '#FFFFFF';
        canvasContext.beginPath();
        canvasContext.moveTo(x1 | 0, y1 | 0);
        canvasContext.lineTo(x2 | 0, y2 | 0);
        canvasContext.stroke();
    }

    function _fillRectFunc(style, x, y, w, h) {
        canvasContext.fillStyle = style;
        canvasContext.fillRect(x, y, w, h);
    }

    function _drawText(x, y, text) {
        canvasContext.fillStyle = '#FFFFFF';
        canvasContext.font = '12px monospace';
        canvasContext.fillText(text, x, y);
    }

    function _setCanvasFunc(newContext) {
        canvasContext = newContext;
    }

    spaceRocks.Renderer = {
        drawLine: _lineFunc,
        fillRectangle: _fillRectFunc,
        setCanvas: _setCanvasFunc,
        drawText: _drawText,
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
 * Created by Eric on 3/31/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    spaceRocks.Shapes = {
        player: function () {
            return new spaceRocks.Polygon([
                new spaceRocks.Point(-5, -5),
                new spaceRocks.Point(0, 5),
                new spaceRocks.Point(5, -5),
                new spaceRocks.Point(0, 0)
            ]);
        },
        asteroid: function () {
            return new spaceRocks.Polygon([
                new spaceRocks.Point(-12, 0),
                new spaceRocks.Point(-8, 8),
                new spaceRocks.Point(0, 16),
                new spaceRocks.Point(8, 6),
                new spaceRocks.Point(8, -4),
                new spaceRocks.Point(-2, -14)
            ]);
        },
        bullet: function () {
            return new spaceRocks.Polygon([
                new spaceRocks.Point(0, 0),
                new spaceRocks.Point(1, 0)
            ]);
        }
    };
    return spaceRocks;
})(SpaceRocks || {});
/**
 * Created by Eric on 4/19/2015.
 */
var SpaceRocks = (function(spaceRocks){

    function _playLaser(){
        var audio = new Audio('audio/atarisquare.wav');
        audio.play();
    }

    spaceRocks.SoundManager = {
        playLaser : _playLaser
    };
    return spaceRocks;
})(SpaceRocks||{});
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
        var points = entity.shape.getPoints();
        for (var i = 0; i < points.length - 1; i++) {
            drawLine(entity.position, points[i], points[i + 1]);
        }
        drawLine(entity.position, points[points.length - 1], points[0]);
    };
    spaceRocks.draw = function () {
        fillBackground();
        spaceRocks.EntityManager.callEntities(drawEntityShape);
        spaceRocks.Gui.render();
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
        var canvasContext = document.getElementById(elementId).getContext('2d');
        spaceRocks.Renderer.setCanvas(canvasContext);
        spaceRocks.InputManager.init(new Kibo());
        spaceRocks.Logic.init();
        spaceRocks.LevelManager.setState(LevelState.START());
    };
    return spaceRocks;
})(window, SpaceRocks || {});


/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var ACCEL_RATE = 0.25;
    var TURN_RATE = 5.0;

    function getPlayer() {
        return spaceRocks.EntityManager.player();
    }

    function updateEntities(frameDelta) {
        spaceRocks.EntityManager.callEntities(function (entity) {
            entity.update(frameDelta);
        });
    }

    function calculatePlayerThrust() {
        var vector = new SpaceRocks.Point(0, ACCEL_RATE);
        var thrustVector = vector.rotate(getPlayer().rotation());
        return thrustVector;
    }

    function updateThrust(player) {
        if (spaceRocks.InputManager.isAccellerating()) {
            var thrust = calculatePlayerThrust();
            player.velocity.x += thrust.x;
            player.velocity.y += thrust.y;
        }
        if (spaceRocks.InputManager.isDecellerating()) {
            var thrust = calculatePlayerThrust();
            player.velocity.x -= thrust.x;
            player.velocity.y -= thrust.y;
        }
    }

    function updateRotation(player, frameDelta) {
        if (spaceRocks.InputManager.rotateCounterClockwise()) {
            player.rotation(TURN_RATE * frameDelta * -1 + player.rotation());
        }
        if (spaceRocks.InputManager.rotateClockwise()) {
            player.rotation(TURN_RATE * frameDelta + player.rotation());
        }
    }

    var _timeSinceLastBullet = 99999;
    var FIRING_DELAY = 5;
    function checkForWeaponFire(player, frameDelta){
        var userWantsToFire = spaceRocks.InputManager.fireWeapon();
        _timeSinceLastBullet += frameDelta;
        var enoughTimeHasElapsed = _timeSinceLastBullet >= FIRING_DELAY;

        if(userWantsToFire && enoughTimeHasElapsed){
            var x = player.position.x;
            var y = player.position.y;
            var rotation = player.rotation();
            var bullet = spaceRocks.BulletFactory.build(x, y, rotation);
            spaceRocks.EntityManager.addEntity(bullet, spaceRocks.CollisionManager.PLAYER_GROUP());
            spaceRocks.SoundManager.playLaser();
            _timeSinceLastBullet = 0;
        }
    }

    function updatePlayer(frameDelta) {
        var player = getPlayer();
        updateThrust(player);
        updateRotation(player, frameDelta);
        checkForWeaponFire(player, frameDelta);
    }

    spaceRocks.update = function (frameDelta) {
        updatePlayer(frameDelta);
        updateEntities(frameDelta);
        spaceRocks.EntityManager.cleanDeadEntities();
        spaceRocks.CollisionManager.checkCollisions();
    };

    return spaceRocks;
})(SpaceRocks || {});
var Kibo = function(element) {
    this.element = element || window.document;
    this.initialize();
};

Kibo.KEY_NAMES_BY_CODE = {
    8: 'backspace', 9: 'tab', 13: 'enter',
    16: 'shift', 17: 'ctrl', 18: 'alt',
    20: 'caps_lock',
    27: 'esc',
    32: 'space',
    33: 'page_up', 34: 'page_down',
    35: 'end', 36: 'home',
    37: 'left', 38: 'up', 39: 'right', 40: 'down',
    45: 'insert', 46: 'delete',
    48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
    65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',
    112: 'f1', 113: 'f2', 114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12',
    144: 'num_lock'
};

Kibo.KEY_CODES_BY_NAME = {};
(function() {
    for(var key in Kibo.KEY_NAMES_BY_CODE)
        if(Object.prototype.hasOwnProperty.call(Kibo.KEY_NAMES_BY_CODE, key))
            Kibo.KEY_CODES_BY_NAME[Kibo.KEY_NAMES_BY_CODE[key]] = +key;
})();

Kibo.MODIFIERS = ['shift', 'ctrl', 'alt'];

Kibo.WILDCARD_TYPES = ['arrow', 'number', 'letter', 'f'];

Kibo.WILDCARDS = {
    arrow: [37, 38, 39, 40],
    number: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57],
    letter: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
    f: [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
};

Kibo.registerEvent = (function() {
    if(document.addEventListener) {
        return function(element, eventName, func) {
            element.addEventListener(eventName, func, false);
        };
    }
    else if(document.attachEvent) {
        return function(element, eventName, func) {
            element.attachEvent('on' + eventName, func);
        };
    }
})();

Kibo.unregisterEvent = (function() {
    if(document.removeEventListener) {
        return function(element, eventName, func) {
            element.removeEventListener(eventName, func, false);
        };
    }
    else if(document.detachEvent) {
        return function(element, eventName, func) {
            element.detachEvent('on' + eventName, func);
        };
    }
})();

Kibo.stringContains = function(string, substring) {
    return string.indexOf(substring) !== -1;
};

Kibo.neatString = function(string) {
    return string.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
};

Kibo.capitalize = function(string) {
    return string.toLowerCase().replace(/^./, function(match) { return match.toUpperCase(); });
};

Kibo.isString = function(what) {
    return Kibo.stringContains(Object.prototype.toString.call(what), 'String');
};

Kibo.arrayIncludes = (function() {
    if(Array.prototype.indexOf) {
        return function(haystack, needle) {
            return haystack.indexOf(needle) !== -1;
        };
    }
    else {
        return function(haystack, needle) {
            for(var i = 0; i < haystack.length; i++)
                if(haystack[i] === needle)
                    return true;
            return false;
        };
    }
})();

Kibo.extractModifiers = function(keyCombination) {
    var modifiers, i
    modifiers = [];
    for(i = 0; i < Kibo.MODIFIERS.length; i++)
        if(Kibo.stringContains(keyCombination, Kibo.MODIFIERS[i]))
            modifiers.push(Kibo.MODIFIERS[i]);
    return modifiers;
}

Kibo.extractKey = function(keyCombination) {
    var keys, i;
    keys = Kibo.neatString(keyCombination).split(' ');
    for(i = 0; i < keys.length; i++)
        if(!Kibo.arrayIncludes(Kibo.MODIFIERS, keys[i]))
            return keys[i];
};

Kibo.modifiersAndKey = function(keyCombination) {
    var result, key;

    if(Kibo.stringContains(keyCombination, 'any')) {
        return Kibo.neatString(keyCombination).split(' ').slice(0, 2).join(' ');
    }

    result = Kibo.extractModifiers(keyCombination);

    key = Kibo.extractKey(keyCombination);
    if(key && !Kibo.arrayIncludes(Kibo.MODIFIERS, key))
        result.push(key);

    return result.join(' ');
}

Kibo.keyName = function(keyCode) {
    return Kibo.KEY_NAMES_BY_CODE[keyCode + ''];
};

Kibo.keyCode = function(keyName) {
    return +Kibo.KEY_CODES_BY_NAME[keyName];
};

Kibo.prototype.initialize = function() {
    var i, that = this;

    this.lastKeyCode = -1;
    this.lastModifiers = {};
    for(i = 0; i < Kibo.MODIFIERS.length; i++)
        this.lastModifiers[Kibo.MODIFIERS[i]] = false;

    this.keysDown = { any: [] };
    this.keysUp = { any: [] };
    for(i = 0; i < Kibo.WILDCARD_TYPES.length; i++) {
        this.keysDown['any ' + Kibo.WILDCARD_TYPES[i]] = [];
        this.keysUp['any ' + Kibo.WILDCARD_TYPES[i]] = [];
    }

    this.downHandler = this.handler('down');
    this.upHandler = this.handler('up');

    Kibo.registerEvent(this.element, 'keydown', this.downHandler);
    Kibo.registerEvent(this.element, 'keyup', this.upHandler);
    Kibo.registerEvent(window, 'unload', function unloader() {
        Kibo.unregisterEvent(that.element, 'keydown', that.downHandler);
        Kibo.unregisterEvent(that.element, 'keyup', that.upHandler);
        Kibo.unregisterEvent(window, 'unload', unloader);
    });
};

Kibo.prototype.handler = function(upOrDown) {
    var that = this;
    return function(e) {
        var i, j, registeredKeys, lastModifiersAndKey;

        e = e || window.event;

        that.lastKeyCode = e.keyCode;
        for(i = 0; i < Kibo.MODIFIERS.length; i++)
            that.lastModifiers[Kibo.MODIFIERS[i]] = e[Kibo.MODIFIERS[i] + 'Key'];
        if(Kibo.arrayIncludes(Kibo.MODIFIERS, Kibo.keyName(that.lastKeyCode)))
            that.lastModifiers[Kibo.keyName(that.lastKeyCode)] = true;

        registeredKeys = that['keys' + Kibo.capitalize(upOrDown)];

        for(i = 0; i < registeredKeys.any.length; i++)
            if((registeredKeys.any[i](e) === false) && e.preventDefault)
                e.preventDefault();

        for(i = 0; i < Kibo.WILDCARD_TYPES.length; i++)
            if(Kibo.arrayIncludes(Kibo.WILDCARDS[Kibo.WILDCARD_TYPES[i]], that.lastKeyCode))
                for(j = 0; j < registeredKeys['any ' + Kibo.WILDCARD_TYPES[i]].length; j++)
                    if((registeredKeys['any ' + Kibo.WILDCARD_TYPES[i]][j](e) === false) && e.preventDefault)
                        e.preventDefault();

        lastModifiersAndKey = that.lastModifiersAndKey();
        if(registeredKeys[lastModifiersAndKey])
            for(i = 0; i < registeredKeys[lastModifiersAndKey].length; i++)
                if((registeredKeys[lastModifiersAndKey][i](e) === false) && e.preventDefault)
                    e.preventDefault();
    };
};

Kibo.prototype.registerKeys = function(upOrDown, newKeys, func) {
    var i, keys, registeredKeys = this['keys' + Kibo.capitalize(upOrDown)];

    if(Kibo.isString(newKeys))
        newKeys = [newKeys];

    for(i = 0; i < newKeys.length; i++) {
        keys = newKeys[i];
        keys = Kibo.modifiersAndKey(keys + '');

        if(registeredKeys[keys])
            registeredKeys[keys].push(func);
        else
            registeredKeys[keys] = [func];
    }

    return this;
};

Kibo.prototype.unregisterKeys = function(upOrDown, newKeys, func) {
    var i, j, keys, registeredKeys = this['keys' + Kibo.capitalize(upOrDown)];

    if(Kibo.isString(newKeys))
        newKeys = [newKeys];

    for(i = 0; i < newKeys.length; i++) {
        keys = newKeys[i];
        keys = Kibo.modifiersAndKey(keys + '');

        if(func === null)
            delete registeredKeys[keys];
        else {
            if(registeredKeys[keys]) {
                for(j = 0; j < registeredKeys[keys].length; j++) {
                    if(String(registeredKeys[keys][j]) === String(func)) {
                        registeredKeys[keys].splice(j, 1);
                        break;
                    }
                }
            }
        }
    }

    return this;
};

Kibo.prototype.delegate = function(upOrDown, keys, func) {
    return func !== null ? this.registerKeys(upOrDown, keys, func) : this.unregisterKeys(upOrDown, keys, func);
};

Kibo.prototype.down = function(keys, func) {
    return this.delegate('down', keys, func);
};

Kibo.prototype.up = function(keys, func) {
    return this.delegate('up', keys, func);
};

Kibo.prototype.lastKey = function(modifier) {
    if(!modifier)
        return Kibo.keyName(this.lastKeyCode);

    return this.lastModifiers[modifier];
};

Kibo.prototype.lastModifiersAndKey = function() {
    var result, i;

    result = [];
    for(i = 0; i < Kibo.MODIFIERS.length; i++)
        if(this.lastKey(Kibo.MODIFIERS[i]))
            result.push(Kibo.MODIFIERS[i]);

    if(!Kibo.arrayIncludes(result, this.lastKey()))
        result.push(this.lastKey());

    return result.join(' ');
};