/**
 * Created by omnic on 11/29/2015.
 */
module.exports = (function () {
    var config = function (options) {
        options = options || {};
        setValue.call(this, options, 'fps', 24);
    };

    function setValue(options, attribute, value) {
        if (options[attribute] === undefined) {
            this[attribute] = value;
        } else {
            this[attribute] = options[attribute];
        }
    }

    return config;
})();