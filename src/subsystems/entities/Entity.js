/**
 * Created by omnic on 11/29/2015.
 */
var Point = require('./Point');
var Debug = require('../../Debug');

module.exports = (function () {
    var entity = function (shape) {
        this._shape = shape;
        this._behaviors = [];
        this.isAlive = true;
        this.position = new Point(0, 0);
        this.velocity = new Point(0, 0);
        var self = this;
        Object.defineProperty(self, 'rotation', {
            enumerble: true,
            writeable: true,
            get: function () {
                return self._shape.rotation;
            },
            set: function (value) {
                self._shape.rotation = value;
            }
        });
        this.rotation = 0;
    };

    entity.prototype.render = function (renderer) {
        this._shape.render(renderer, this.position);
    };

    entity.prototype.update = function (delta) {
        _invokeBehaviors.call(this, delta);
        var vX = this.velocity.x * delta;
        var vY = this.velocity.y * delta;
        this.position = this.position.translate({x: vX, y: vY});
    };

    entity.prototype.addBehavior = function (newBehavior) {
        this._behaviors.push(newBehavior);
    }

    function _invokeBehaviors(delta) {
        var entity = this;
        this._behaviors.forEach(function (behavior) {
            behavior(delta, entity);
        });
    }

    return entity;
})();