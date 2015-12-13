/**
 * Created by Eric on 12/12/2015.
 */
module.exports = (function () {
    var eventhandler = function () {
        this._pendingEvents = [];
        this._subscribers = {};
        this.process = _process.bind(this);
        this.subscribe = _subscribe.bind(this);
        this.addEvent = _addEvent.bind(this);
    };

    function _addEvent(event) {
        this._pendingEvents.push(event);
    };

    function _subscribe(eventType, subscriber) {
        if (!this._subscribers[eventType]) {
            this._subscribers[eventType] = [];
        }
        this._subscribers[eventType].push(subscriber);
    };

    function _process() {
        var self = this;
        self._pendingEvents.forEach(function (event) {
            var subscribers = self._subscribers[event.type];
            if (subscribers) {
                subscribers.forEach(function (subscriber) {
                    subscriber(event);
                });
            }
        });
        self._pendingEvents = [];
    };

    return eventhandler;
})();