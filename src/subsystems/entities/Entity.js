/**
 * Created by omnic on 11/29/2015.
 */
var Point = require('./Point');
var GameEvent = require('../../engine/GameEvent');
var Debug = require('../../Debug');

module.exports = (function () {
    var Entity = function (shape, type) {
        this._shape = shape;
        this._type = type;
        this._behaviors = [];
        this._isAlive = true;
        this.position = new Point(0, 0);
        this.velocity = new Point(0, 0);
        var self = this;
        Object.defineProperties(self, {
            rotation: {
                enumerable: true,
                writeable: true,
                get: function () {
                    return self._shape.rotation;
                },
                set: function (value) {
                    self._shape.rotation = value;
                }
            },
            position: {
                enumerable: true,
                writeable: true,
                get: function () {
                    return self._shape.position;
                },
                set: function (value) {
                    self._shape.position = value;
                }
            },
            isAlive: {
                enumerable: true,
                writeable: true,
                get: function () {
                    return self._isAlive;
                },
                set: function () {
                    throw new Error('Illegal operation, do not set isAlive directly, call Entity.destroy() instead.');
                }
            },
            shape: {
                value: shape,
                writeable: false,
                enumerable: true
            }
        });
        this.rotation = 0;
    };

    Entity.prototype.render = function (renderer) {
        this._shape.render(renderer);
    };

    Entity.prototype.update = function (gameContainer) {
        _invokeBehaviors.call(this, gameContainer);
        var vX = this.velocity.x * gameContainer.delta;
        var vY = this.velocity.y * gameContainer.delta;
        this.position = this.position.translate({x: vX, y: vY});
    };

    Entity.prototype.destroy = function (gameContainer) {
        this._isAlive = false;
        gameContainer.events.emit(new GameEvent('entity-death', this._type));
    };

    Entity.prototype.addBehavior = function (newBehavior) {
        this._behaviors.push(newBehavior);
    }

    function _invokeBehaviors(gameContainer) {
        var entity = this;
        this._behaviors.forEach(function (behavior) {
            behavior(gameContainer, entity);
        });
    }

    var Types = {};
    Object.defineProperties(Types, {
        PLAYER: {
            value: 'player',
            writeable: false,
            enumerable: true
        },
        ASTEROID: {
            value: 'asteroid',
            writeable: false,
            enumerable: true
        },
        BULLET: {
            value: 'bullet',
            writeable: false,
            enumerable: true
        },
        FX: {
            value: 'fx',
            writeable: false,
            enumerable: true
        },

    });
    Entity.Type = Types;

    return Entity;
})
();