/**
 * Created by Eric on 1/10/2016.
 */
var spies = require('./TestSpies');

module.exports = {
    load: function (modules) {
        var Mocks = this;
        modules.forEach(function (moduleName) {
            var mockModule = spies.createStub(moduleName + 'Module');
            Mocks.modules[moduleName] = mockModule;
            var moduleInstance = spies.createStub(moduleName, 'Instance');
            Mocks.stubs[moduleName] = moduleInstance;
        });
    },
    modules: {},
    stubs: {}

};
