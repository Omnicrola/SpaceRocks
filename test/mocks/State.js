/**
 * Created by omnic on 1/3/2016.
 */

var spies = require('../TestSpies');

module.exports = {
    create: function (name) {
        var mockState = {
            load: spies.create('state.load'),
            unload: spies.create('state.unload'),
            update: spies.create('state.update')
        };
        Object.defineProperties(mockState, {
            name: {
                writeable: false,
                enumerable: true,
                value: name
            }
        });
        return mockState;
    }
};