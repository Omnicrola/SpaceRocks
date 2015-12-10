/**
 * Created by Eric on 12/8/2015.
 */

var GameEvent = require('../../src/engine/GameEvent');

describe('GameEvent', function () {

    it('should record a type and data', function () {
        var expectedData = {foo:'bar234'};
        var eventName = 'my-event-name';

        var gameEvent = new GameEvent(eventName, expectedData);
        assert.equal(expectedData, gameEvent.data);
        assert.equal(eventName, gameEvent.type);

    });
    it('should make type and data read only', function () {
        var expectedData = {foo:'bar2324'};
        var eventName = 'my-other-event-name';

        var gameEvent = new GameEvent(eventName, expectedData);
        gameEvent.type = 'nothing';
        gameEvent.data = {arg:'barg'};

        assert.equal(expectedData, gameEvent.data);
        assert.equal(eventName, gameEvent.type);

    });

});