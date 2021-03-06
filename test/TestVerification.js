/**
 * Created by omnic on 11/29/2015.
 */
var GameEvent = require('../src/engine/GameEvent');

module.exports = (function () {

    function spyName(spy) {
        return '"' + (spy.methodName || 'Anonymous') + '"';
    }

    function checkArgumentCount(actualCall, expectedArguments) {
        var actualCount = actualCall.args.length;
        var expectedCount = expectedArguments.length;
        return actualCount == expectedCount;
    }

    function runVerification(sinonSpy, expectedArguments) {
        if (!sinonSpy.called) {
            throw new Error(spyName(sinonSpy) + ' was not called at all.');
        }
        var allCalls = sinonSpy.getCalls();
        var argumentStrings = [];
        var callsThatMatch = allCalls.filter(function (actualCall) {
            return checkArgumentCount(actualCall, expectedArguments) &&
                argumentsMatch(expectedArguments, actualCall, sinonSpy);
        });
        if (callsThatMatch.length == 0) {
            var expectedArgs = '(' + expectedArguments.join(', ') + ')';
            var actualArgs = allCalls.map(function (actualCall, i) {
                return i + ': (' + actualCall.args.join(', ') + ')'
            }).join('\n');
            throw new Error(spyName(sinonSpy) + ' was not called with expected arguments.\n' +
                'Expected : ' + expectedArgs + '\n' +
                'Actual calls :\n' + actualArgs);

        }
    }

    function verifyConfigProperties(expectedConfig, actualConfig, parentName) {
        var expectedProperties = Object.getOwnPropertyNames(expectedConfig);
        for (var i = 0; i < expectedProperties.length; i++) {
            var propName = expectedProperties[i];
            var expectedValue = expectedConfig[propName];
            var actualValue = actualConfig[propName];
            if (expectedValue === undefined) {
                throw new Error('Expectation error: "' + parentName + '.' + propName + '" was expected to be undefined.');
            }
            if (typeof expectedValue == 'object') {
                if (typeof actualValue !== 'object') {
                    throwConfigError(parentName, propName, expectedValue, actualValue);
                }
                verifyConfigProperties(expectedValue, actualValue, parentName + '.' + propName);
            }
            else if (expectedValue !== actualValue) {
                throwConfigError(parentName, propName, expectedValue, actualValue);
            }
        }
    }

    function throwConfigError(parentName, propName, expectedValue, actualValue) {
        throw new Error('Configuration object was not correct. ' +
            '\nProperty "' + parentName + '.' + propName + '" should be "' + expectedValue +
            '"\nbut was "' + actualValue + '".');

    }

    function argumentsMatch(expectedArguments, actualCall) {
        for (var i = 0; i < expectedArguments.length; i++) {
            if (actualCall.args[i] !== expectedArguments[i]) {
                return false;
            }
        }
        return true;
    }

    function createSingleSpyVerifier(singleSpy) {
        return {
            wasCalledWith: function () {
                var expectedArguments = new Array(arguments.length);
                for (var i = 0; i < expectedArguments.length; ++i) {
                    expectedArguments[i] = arguments[i];
                }
                runVerification(singleSpy, expectedArguments);
            },
            wasCalledWithConfig: function (callIndex, expectedConfig) {
                if (typeof expectedConfig !== 'object') {
                    throw new Error('Expected configuration is not an object. Was: ' + expectedConfig);
                }
                var singleCall = singleSpy.getCall(callIndex);
                if (singleCall === undefined) {
                    throw new Error('Expected ' + spyName(singleSpy) + ' to have been called with config object, but was not called at all.');
                }
                if (singleCall.args.length !== 1) {
                    throw new Error('Expected ' + spyName(singleSpy) + ' to have been called with a single configuration object. ' +
                        'Instead got ' + singleCall.args.length + ' arguments.');
                }
                var actualConfig = singleCall.args[0];
                verifyConfigProperties(expectedConfig, actualConfig, '');
            },
            wasCalledAfter: function (otherSpy) {
                var wasNotCalledAfter = !singleSpy.called || !singleSpy.calledAfter(otherSpy);
                if (wasNotCalledAfter) {
                    throw new Error(spyName(singleSpy) + ' was not called after ' + spyName(otherSpy));
                }
            },
            wasCalled: function () {
                if (!singleSpy.called) {
                    throw new Error(spyName(singleSpy) + ' was not called at all.');
                }
            },
            wasNotCalled: function () {
                if (singleSpy.called) {
                    throw new Error(spyName(singleSpy) + ' should not have been called, but was called ' + singleSpy.callCount + ' times.');
                }
            },
            wasCalledOnce: function () {
                if (!singleSpy.calledOnce) {
                    throw new Error(spyName(singleSpy) + ' was called ' + singleSpy.callCount + ' times instead of once.');
                }
            },
            wasCalledTwice: function () {
                if (!singleSpy.calledTwice) {
                    throw new Error(spyName(singleSpy) + ' was called ' + singleSpy.callCount + ' times instead of twice.');
                }
            },
            wasCalledExactly: function (times) {
                if (singleSpy.callCount != times) {
                    throw new Error(spyName(singleSpy) + ' was called ' + singleSpy.callCount + ', expected ' + times);
                }
            },
            wasCalledWithNew: function () {
                if (!singleSpy.calledWithNew()) {
                    throw new Error(spyName(singleSpy) + ' was not called with the "new" keyword');
                }
            }
        };
    }

    function createMultiSpyVerifier(multipleSpies) {
        return {
            whereCalledInOrder: function () {
                for (var i = 1; i < multipleSpies.length; i++) {
                    var spyA = multipleSpies[i - 1];
                    var spyB = multipleSpies[i];
                    if (!spyA.calledBefore(spyB)) {
                        throw new Error('Spies where called out of order. Expected ' + spyName(spyA) + ' before ' + spyName(spyB));
                    }
                }
            },
            wasCalledWith: function () {
                throw new Error('Cannot invoke "wasCalledWith" on an array of spies');
            }
        };
    }


    var verify = function (verifierTarget) {
        if (!verifierTarget) {
            throw new Error('Cannot verify an undefined spy (did you reference a property that doesnt exist?)');
        } else if (verifierTarget.methodName !== undefined) {
            return createSingleSpyVerifier(verifierTarget);
        } else if (verifierTarget.length > 0) {
            return createMultiSpyVerifier(verifierTarget);
        } else {
            throw new Error('Attempted to verify a non-named spy. \nPass in either a single spy or an array of spies. Spies must be created with the sinon wrapper spies.create(name).')
        }
    };
    verify.readOnlyProperty = function (object, propName, expectedValue) {
        if (object[propName] !== expectedValue) {
            throw new Error('Expected object to have a property named "' +
                propName + '" with a value of "' +
                expectedValue + '" but got "' + object[propName]);
        }
        try {
            object[propName] = Math.random();
        } catch (e) {
        }
        if (object[propName] !== expectedValue) {
            throw new Error('Objects property "' + propName + '" should be read-only, but was not.');
        }
        if (!object.propertyIsEnumerable(propName)) {
            throw new Error('Objects property "' + propName + '" should be enumerable, but is not.');
        }

    };
    verify.point = function (expectedPoint, actualPoint) {
        if (expectedPoint.x !== actualPoint.x ||
            expectedPoint.y !== actualPoint.y) {
            throw new Error('Points do not match.\n Expected: ' + expectedPoint + '\n Actual:' + actualPoint);
        }
    };
    verify.event = function (expectedEvent, actualEvent) {
        assert.isTrue(actualEvent instanceof GameEvent, actualEvent + ' should use the "GameEvent" prototype');
        assert.equal(expectedEvent.type, actualEvent.type);
        verifyConfigProperties(expectedEvent.data, actualEvent.data, '');
    };
    verify.config = function (expectedConfig, actualConfig) {
        verifyConfigProperties(expectedConfig, actualConfig, '');
    };
    verify.method = function () {
        var obj = arguments[0];
        var methodThatThrows = arguments[1];
        var args = Array.prototype.slice.call(arguments).slice(2, 99);
        return {
            throwsMessage: function (expectedMessage) {
                var threw = false;
                try {
                    obj[methodThatThrows].apply(obj, args);
                } catch (error) {
                    threw = true;
                    if (expectedMessage != error.message) {
                        throw new Error('Expected method "' + methodThatThrows + '" to throw the message:\n"' +
                            expectedMessage + '"\nbut instead it threw:\n"' + error.message + '"');
                    }
                }
                if (threw === false) {
                    throw new Error('Expected method "' + methodThatThrows + '" to throw an error, but it did not throw anything.');
                }
            }
        }
    };
    return verify;
})
();