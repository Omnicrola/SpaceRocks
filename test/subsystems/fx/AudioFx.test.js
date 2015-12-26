/**
 * Created by omnic on 12/25/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

var AudioFx = require('../../../src/subsystems/fx/AudioFx');

describe('AudioFx', function () {
    it('has the correct constants', function () {
        verify.readOnlyProperty(AudioFx, 'WEAPON_FIRE', 'atarisquare');
        verify.readOnlyProperty(AudioFx, 'EXPLOSION', 'cannon-boom4');
    });
});