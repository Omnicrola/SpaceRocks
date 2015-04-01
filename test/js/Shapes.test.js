/**
 * Created by Eric on 3/31/2015.
 */
describe('SpaceRocks.Shape', function(){
    describe('Player', function(){
        it('should have the correct points', function(){
            var player = SpaceRocks.Shapes.player();
            expect(player.length).to.equal(4);
            checkPoint(player[0], -5, -5);
            checkPoint(player[1], 0, 5);
            checkPoint(player[2], 5, -5);
            checkPoint(player[3], 0, 0);
        });
    });

    describe('Asteroid', function(){
      it('should have the correct points', function(){
          var asteroid = SpaceRocks.Shapes.asteroid();
          expect(asteroid.length).to.equal(5);
          checkPoint(asteroid[0], -10,-8);
          checkPoint(asteroid[1], -3,4);
          checkPoint(asteroid[2], -6,9);
          checkPoint(asteroid[3], 2,8);
          checkPoint(asteroid[4], -6,-8);
      })  ;
    });

    function checkPoint(point, expectedX, expectedY){
        expect(point.x).to.equal(expectedX);
        expect(point.y).to.equal(expectedY);
    }
});