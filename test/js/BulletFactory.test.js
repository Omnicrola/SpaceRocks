/**
 * Created by Eric on 4/4/2015.
 */
describe('BulletFactory', function () {
    var BULLET_VELOCITY = 5.0;

    it('should create an entity with the appropriate shape', function () {

        var expectedX = Math.random() * 100;
        var expectedY = Math.random() * 100;
        var expectedShape = SpaceRocks.Shapes.bullet();

        var bullet = SpaceRocks.BulletFactory.build(expectedX, expectedY, 0);
        expect(bullet.shape).to.deep.equal(expectedShape);
    });

    it('should create an entity with a set velocity', function () {

        var expectedVelocity = new SpaceRocks.Point(0, BULLET_VELOCITY);

        var bullet = SpaceRocks.BulletFactory.build(1, 1, 0);
        var actualVelocity = bullet.velocity;
        expect(actualVelocity.x).to.equal(expectedVelocity.x);
        expect(actualVelocity.y).to.equal(expectedVelocity.y);
    });

    it('should alter velocity based on rotation', function () {
        var degrees = 27;
        var expectedVelocity = new SpaceRocks.Point(0, BULLET_VELOCITY).rotate(degrees);

        var bullet = SpaceRocks.BulletFactory.build(1, 1, degrees);

        var actualVelocity = bullet.velocity;
        expect(actualVelocity.x).to.equal(expectedVelocity.x);
        expect(actualVelocity.y).to.equal(expectedVelocity.y);
    });

    describe('update behavior', function () {
        beforeEach(function(done){
            var stubWidth = OMD.test.globalStub(SpaceRocks.Renderer, 'width');
            var stubHeight = OMD.test.globalStub(SpaceRocks.Renderer, 'height');
            stubWidth.returns(1000);
            stubHeight.returns(1000);
            done();
        });
        afterEach(function(){
           OMD.test.restoreAll();
        });
        it('should self destruct after 1 second', function () {

            var bullet = SpaceRocks.BulletFactory.build(1, 2, 3);
            expect(bullet.isAlive()).to.equal(true);

            bullet.update(29.0);
            expect(bullet.isAlive()).to.equal(true);

            bullet.update(1.0);
            expect(bullet.isAlive()).to.equal(false);
        });
    });

});