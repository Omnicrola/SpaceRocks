/**
 * Created by Eric on 4/5/2015.
 */
var Random = (function () {
    function _random(seedToUse) {
        if (!seedToUse) {
            this.seed = generateSeed();
        } else {
            this.seed = seedToUse;
        }
    }

    function generateSeed() {
        return new Date().getUTCMilliseconds() + Math.random() * 100;
    }

    function _nextInteger(max) {
        if (!max) {
            max = Number.MAX_VALUE;
        }
        var v = Math.sin(this.seed++) * max;
        return Math.abs(Math.floor(v));
    }

    function _next() {
        var v = Math.sin(this.seed++) * 10000;
        return Math.abs(v - Math.floor(v));
    }

    _random.prototype.next = _next;
    _random.prototype.nextInteger = _nextInteger;
    return _random;
})();