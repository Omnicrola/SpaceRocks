/**
 * Created by Eric on 4/19/2015.
 */
describe('SoundManager', function(){

    var LASER_FILENAME = 'audio/atarisquare.wav';

   it('should play a sound', function(){
        var tempAudio = window.Audio;
       var constructorSpy = sinon.spy();
       window.Audio = function(filename){
           constructorSpy(filename);
       };
       var playSpy = window.Audio.prototype.play = sinon.spy();

       SpaceRocks.SoundManager.playLaser();
       expect(constructorSpy.calledOnce).to.equal(true);
       expect(constructorSpy.firstCall.args[0]).to.equal(LASER_FILENAME);
       expect(playSpy.calledOnce);
       expect(playSpy.calledAfter(constructorSpy));



   });
});