/**
 * Created by Eric on 1/4/2016.
 */

module.exports = {
    freeze: function (obj) {
        var frozenObj = {};
        for (var prop in obj) {
            Object.defineProperty(frozenObj, prop, {
                writeable: false,
                enumerable: true,
                value: obj[prop]
            });
        }
        return frozenObj;
    }
};