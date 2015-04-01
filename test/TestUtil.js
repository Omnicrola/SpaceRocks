/**
 * Created by Eric on 3/31/2015.
 */
(function (globals) {
    var shims = [];

    function makeShim(targetObj, propertyName, originalProperty) {
        return {
            restore: function () {
                targetObj[propertyName] = originalProperty;
            }
        };
    }

    globals.test = {
        globalSpy: function (targetObj, propertyName) {
            var originalProperty = targetObj[propertyName];
            var shim = makeShim(targetObj, propertyName, originalProperty);
            shims.push(shim);
            var spy = targetObj[propertyName] = sinon.spy();
            return spy;
        },
        restoreAll : function(){

        }
    };


})(window);