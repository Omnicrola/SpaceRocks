/**
 * Created by Eric on 3/31/2015.
 */
var OMD = (function () {
    var shims = [];

    function makeShim(targetObj, propertyName, originalProperty) {
        return {
            restore: function () {
                targetObj[propertyName] = originalProperty;
            }
        };
    }

    function swapProperty(targetObj, propertyName, replacement) {
        var originalProperty = targetObj[propertyName];
        var shim = makeShim(targetObj, propertyName, originalProperty);
        shims.push(shim);
        targetObj[propertyName] = replacement;
    }

    var omd = {
        test: {
            globalSpy: function (targetObj, propertyName) {
                var spy = sinon.spy();
                swapProperty(targetObj, propertyName, spy);
                return spy;
            },
            globalStub: function (targetObj, propertyName) {
                var stub = sinon.stub();
                swapProperty(targetObj, propertyName, stub);
                return stub;
            },
            restoreAll: function () {
                shims.forEach(function (singleShim) {
                    singleShim.restore();
                })
                shims = [];
            }
        }
    };

    return omd;
})();