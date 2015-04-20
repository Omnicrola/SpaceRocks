/**
 * Created by Eric on 4/19/2015.
 */
var SpaceRocks = (function(spaceRocks){

    function _playLaser(){
        var audio = new Audio('audio/atarisquare.wav');
        audio.play();
    }

    spaceRocks.SoundManager = {
        playLaser : _playLaser
    };
    return spaceRocks;
})(SpaceRocks||{});