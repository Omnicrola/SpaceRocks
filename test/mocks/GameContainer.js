/**
 * Created by Eric on 12/12/2015.
 */
var spies = require('../TestSpies');

module.exports = {
    create: function () {
        return {
            delta: 1.0,
            input: spies.create('input'),
            audio: spies.create('audio'),
            events: {
                emit: spies.create('emit'),
                subscribe: spies.create('subscribe')
            }
        }
    }
};