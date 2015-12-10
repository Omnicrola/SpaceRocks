/**
 * Created by Eric on 12/8/2015.
 */

module.exports = (function(){
    var gameEvent = function(type, data){
        Object.defineProperties(this,{
            'type':{
                writeable:false,
                get:function(){return type;}
            },
            'data':{
                writeable:false,
                get:function(){return data;}
            }
        });
    };

    return gameEvent;
})();