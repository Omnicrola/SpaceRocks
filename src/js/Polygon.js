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