/**
 * Created by Eric on 12/12/2015.
 */
var Debug = require('../Debug');

module.exports = (function () {
    var eventhandler = function () {
        this._pendingEvents = [];
        this._subscribers = {};
        this.process = _process.bind(this);
        this.subscribe = _subscribe.bind(this);
        this.addEvent = _addEvent.bind(this);
    };

    function _addEvent(event) {
        Debug.log('Added event to queue: ' + event.type);
        this._pendingEvents.push(event);
    };

    function _subscribe(eventType, subscriber) {
        Debug.log('Added subscriber for event type: ' + eventType);
        if (!this._subscribers[eventType]) {
            this._subscribers[eventType] = [];
        }
        this._subscribers[eventType].push(subscriber);
    };

    function _process() {
        var self = this;
        allEvents = self._pendingEvents;
        self._pendingEvents = [];
        if(allEvents.length){Debug.log('Processing ' + allEvents.length + ' events');}
        allEvents.forEach(function (event) {
            var subscribers = self._subscribers[event.type];
            if (subscribers) {
                Debug.log('Sending event "' + event.type + '" to ' + subscribers.length + ' subscribers');
                subscribers.forEach(function (subscriber) {
                    subscriber(event);
                });
            }
        });
    };

    return eventhandler;
})();