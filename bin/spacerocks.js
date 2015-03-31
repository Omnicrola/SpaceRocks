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


/**
 * Created by Eric on 3/21/2015.
 */
var SpaceRocks = (function (spaceRocks) {

    function getPlayer() {
        return spaceRocks.EntityManager.player();
    }

    spaceRocks.update = function (frameDelta) {
        if (spaceRocks.InputManager.isAccellerating()) {
            getPlayer().velocity.y = 1;
        }
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