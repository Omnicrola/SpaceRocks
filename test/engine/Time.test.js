/**
 * Created by omnic on 11/29/2015.
 */
var Time = require('../../src/engine/Time');

describe('Time', function(){
    it('will return the date from Date.time', function() {
        var time = new Time();
        var actualTime = new Date().getTime();
        assert.isTrue(Math.abs(actualTime -time.getCurrentTime()) <= 1, 'Should return the current time');
    });
});