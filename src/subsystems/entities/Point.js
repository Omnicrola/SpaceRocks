/**
 * Created by Eric on 12/5/2015.
 */
module.exports = (function () {


    var point = function (x, y) {
        Object.defineProperties(this, {
            'x': {
                value: x,
                writeable: false
            },
            'y': {
                value: y,
                writeable: false
            }
        });
    };

    return point;
})();