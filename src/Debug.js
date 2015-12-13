/**
 * Created by Eric on 12/13/2015.
 */
module.exports = {
    isDebugging: true,
    log: function (message) {
        if (this.isDebugging) {
            console.log(message);
        }
    }
};