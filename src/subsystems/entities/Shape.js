/**
 * Created by Eric on 12/5/2015.
 */
module.exports = (function () {

    var shape = function (points) {
        this._points = points;
        this.color = '#ffffff';
    };

    shape.prototype.render = function (renderer, offset) {
        renderer.setColor(this.color);
        var totalPoints = this._points.length;
        var p1, p2;
        for (var i = 0; i < totalPoints - 1; i++) {
            p1 = this._points[i];
            p2 = this._points[i + 1];
            renderer.drawLine(
                p1.x + offset.x,
                p1.y + offset.y,
                p2.x + offset.x,
                p2.y + offset.y);
        }
        p1 = this._points[totalPoints - 1];
        p2 = this._points[0];
        renderer.drawLine(
            p1.x + offset.x,
            p1.y + offset.y,
            p2.x + offset.x,
            p2.y + offset.y);
    };

    return shape;
})();