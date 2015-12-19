/**
 * Created by Eric on 12/12/2015.
 */
var spies = require('../TestSpies');
var GameInput = require('../../src/engine/GameInput');
var GameAudio = require('../../src/engine/GameAudio');

module.exports = {
    create: function () {
        return {
            delta: 1.0,
            input: spies.createStub(new GameInput(), 'GameInput'),
            audio: spies.createStubInstance(GameAudio, 'GameAudio'),
            events: {
                emit: spies.create('emit'),
                subscribe: spies.create('subscribe')
            }
        }
    }
};