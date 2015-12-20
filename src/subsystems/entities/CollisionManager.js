/**
 * Created by Eric on 12/19/2015.
 */
module.exports = (function () {
    var CollisionManager = function () {
        this._entities = [];
    };

    CollisionManager.prototype.add = function (entity) {
        this._entities.push(entity);
    };

    CollisionManager.prototype.update = function () {
        var entities = this._entities;
        var totalEntities = this._entities.length;
        for(var x=0;x<totalEntities;x++){
            for(var j=0;j<totalEntities;j++){
                var entity1 = entities[x];
                var entity2 = entities[j];
                if(entity1.shape.intersects(entity2.shape)){
                    entity1.isAlive = false;
                    entity2.isAlive = false;
                }

            }
        }
    };

    return CollisionManager;
})();