/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {
    function createNamedSpy(name) {
        var spy = sinon.spy();
        spy.methodName = name;
        return spy;
    }

    return {
        create: function (name) {
            return createNamedSpy(name);
        },
        createComplex: function (params) {
            if (params.length) {
                var mockObj = {};
                params.forEach(function (spyName) {
                    mockObj[spyName] = createNamedSpy(spyName);
                });
                return mockObj;
            } else {
                throw new Error('createComplex spy requires an array of method names');
            }
        }
    };
})();