/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {

    var allStubs = [];

    function createNamedSpy(name) {
        var spy = sinon.spy();
        spy.methodName = name;
        return spy;
    }

    function createNamedStub(name) {
        var stub = sinon.stub();
        stub.methodName = name;
        return stub;
    }

    function createStubOfObject(obj) {
        var propName;
        var objMethods = [];
        for (propName in obj) {
            if (typeof obj[propName] === 'function') {
                objMethods.push(propName);
            }
        }
        objMethods.forEach(function (methodName) {
            obj[methodName] = createNamedStub(methodName);
        });
        return obj;
    }

    return {
        create: function (name) {
            return createNamedSpy(name);
        },
        createStub: function (stubTarget) {
            if (typeof stubTarget == 'string') {
                return createNamedStub(stubTarget);
            } else if (typeof stubTarget == 'object') {
                return createStubOfObject(stubTarget);
            }
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
        },
        replace: function (object, property) {
            var newStub = sinon.stub(object, property);
            newStub.methodName = property;
            allStubs.push(newStub);
            return newStub;
        },
        restoreAll: function () {
            allStubs.forEach(function (singleStub) {
                singleStub.restore();
            });
            allStubs = [];
        }
    };
})();