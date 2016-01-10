/**
 * Created by Eric on 12/12/2015.
 */
var Debug = require('../Debug');

var EventHandler = function () {
    this._pendingEvents = [];
    this._subscribers = {};
    this.process = _process.bind(this);
    this.subscribe = _subscribe.bind(this);
    this.unsubscribe = _unsubscribe.bind(this);
    this.addEvent = _addEvent.bind(this);
};

function _addEvent(event) {
    this._pendingEvents.push(event);
}

function _subscribe(eventType, subscriber) {
    if (!this._subscribers[eventType]) {
        this._subscribers[eventType] = [];
    }
    this._subscribers[eventType].push(subscriber);
}

function _unsubscribe(eventType, subscriberToRemove) {
    var subscribers = this._subscribers[eventType];
    var indexOf = subscribers.indexOf(subscriberToRemove);
    if (indexOf !== -1) {
        subscribers.splice(indexOf, 1);
    }
}

function _process() {
    var self = this;
    allEvents = self._pendingEvents;
    self._pendingEvents = [];
    allEvents.forEach(function (event) {
        var subscribers = self._subscribers[event.type];
        if (subscribers) {
            subscribers.forEach(function (subscriber) {
                subscriber(event);
            });
        }
    });
}


module.exports = EventHandler;
