/**
 * Created by Eric on 12/19/2015.
 */
module.exports = (function () {
    var CollisionManager = function () {
        this._entities = [];
    };

    CollisionManager.prototype.add = function (entity) {
        this._entities.push(entity);
        console.log(this._entities.length);
    };

    CollisionManager.prototype.update = function () {
        removeDestroyedEntities.call(this);
        var entities = this._entities;
        var totalEntities = this._entities.length;
        for (var i = 0; i < totalEntities; i++) {
            for (var j = 0; j < totalEntities; j++) {
                var entity1 = entities[i];
                var entity2 = entities[j];
                if (entity1 !== entity2 && entity1.isAlive && entity2.isAlive) {
                    if (entity1.shape.intersects(entity2.shape)) {
                        console.log('intersected');
                        entity1.isAlive = false;
                        entity2.isAlive = false;
                    }
                }
            }
        }
    };

    function removeDestroyedEntities() {
        this._entities = this._entities.filter(function (entity) {
            return entity.isAlive;
        });
    }

    return CollisionManager;
})();