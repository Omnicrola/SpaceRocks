/**
 * Created by Eric on 12/13/2015.
 */
module.exports = {
    isDebugging: false,
    log: function (message) {
        if (this.isDebugging) {
            console.log(message);
        }
    },
    display: {},
    render: function (renderer) {
        if (this.isDebugging) {
            var y = 40;
            for (var prop in this.display) {
                var val = this.display[prop];
                renderer.drawText(20, y, prop + ': ' + val);
                y += 20;
            }
        }
    }
};