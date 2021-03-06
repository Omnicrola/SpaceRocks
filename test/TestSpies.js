/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {

    var allStubs = [];

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

    function createStubOfClass(targetClass, name) {
        var stubInstance = createStubOfObject(sinon.create(targetClass.prototype));
        stubInstance.methodName = name;
        return stubInstance;
    }
    function createStubFromProperties(target){
        var obj = {};
        for(prop in target){
            obj[prop] = createNamedStub(prop);
        }
        return obj;
    }

    return {
        create: function (name) {
            return createNamedStub(name);
        },
        createStub: function (stubTarget) {
            if (typeof stubTarget == 'string') {
                return createNamedStub(stubTarget);
            } else if (typeof stubTarget == 'object') {
                return createStubOfObject(stubTarget);
            }
        },
        createStubCopy : function(target){
          return createStubFromProperties(target);
        },
        createStubInstance: function (stubTarget, name) {
            return createStubOfClass(stubTarget, name);
        },
        createComplex: function (params) {
            if (params.length) {
                var mockObj = {};
                params.forEach(function (stubName) {
                    mockObj[stubName] = createNamedStub(stubName);
                });
                return mockObj;
            } else {
                throw new Error('createComplex spy requires an array of method names');
            }
        },
        replace: function (object, property, newProperty) {
            var newStub = newProperty || sinon.stub(object, property);
            newStub.methodName = property;
            allStubs.push(newStub);
            return newStub;
        },
        stubConstructor : function(name){
            return stubConstructor(name);
        },
        restoreAll: function () {
            allStubs.forEach(function (singleStub) {
                singleStub.restore();
            });
            allStubs = [];
        }
    };
})();