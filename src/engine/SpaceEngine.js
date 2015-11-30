/**
 * Created by omnic on 11/29/2015.
 */

//var Delta = require('./Delta');
//var Time = require('./Time');
//var SubsystemManager = require('SubsystemManager');

module.exports = (function () {
    var engine = function () {
        //var delta = new Delta(new Time());
        //var subsystemManager = new SubsystemManager();
    };

    engine.prototype.start = function () {
        window.setInterval(this.cycle, 1000 / 24);
    };

    engine.prototype.cycle = function(){

    };

    return engine;
})();