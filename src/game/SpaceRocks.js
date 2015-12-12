/**
 * Created by Eric on 12/10/2015.
 */

var SpaceEngine = require('../engine/SpaceEngine');
module.exports = (function () {
    var spacerocks = function (canvasId) {
        new SpaceEngine({
            audioPath: '',
            canvas: canvasId
        }).start();
    };
    return spacerocks;
})();