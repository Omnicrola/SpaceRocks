/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {

    function spyName(spy) {
        return '"' + (spy.methodName || 'Anonymous') + '"';
    }

    function checkArgumentCount(actualCall, expectedArguments, sinonSpy) {
        var actualCount = actualCall.args.length;
        var expectedCount = expectedArguments.length;
        if (actualCount != expectedCount) {
            throw new Error(spyName(sinonSpy) + ' was called with incorrect number of arguments. Expected ' + expectedCount + ' but received ' + actualCall.length);
        }
    }

    function runVerification(sinonSpy, expectedArguments) {
        if (!sinonSpy.called) {
            throw new Error(spyName(sinonSpy) + ' was not called at all.');
        }
        var actualCall = sinonSpy.firstCall;
        checkArgumentCount(actualCall, expectedArguments, sinonSpy);
        for (var i = 0; i < expectedArguments.length; i++) {
            if (actualCall.args[i] !== expectedArguments[i]) {
                var expectedArgs = '(' + expectedArguments.join(',') + ')';
                var actualArgs = '(' + actualCall.args.join(',') + ')';
                throw new Error(spyName(sinonSpy) + ' was not called with expected arguments.\n' +
                    'Expected : ' + expectedArgs + '\n' +
                    'But was  :' + actualArgs);
            }
        }
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
            wasCalled: function () {
                if (!singleSpy.called) {
                    throw new Error(spyName(singleSpy) + ' was not called at all.');
                }
            },
            wasCalledExactly: function (times) {
                if (singleSpy.timesCalled != times) {
                    throw new Error(spyName(singleSpy) + ' was called ' + singleSpy.timesCalled + ', expected ' + times);
                }
            },
            calledWithNew: function () {
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
            }
        };
    }

    return function (verifierTarget) {
        if (!verifierTarget) {
            throw new Error('Cannot verify an undefined spy (did you reference a property that doesnt exist?)');
        } else if (verifierTarget.methodName) {
            return createSingleSpyVerifier(verifierTarget);
        } else if (verifierTarget.length) {
            return createMultiSpyVerifier(verifierTarget);
        } else {
            throw new Error('Attempted to verify a non-named spy. \nPass in either a single spy or an array of spies. Spies must be created with the sinon wrapper spies.create(name).')
        }
    };
})();