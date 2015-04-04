/**
 * Created by Eric on 4/4/2015.
 */
describe('BulletFactory', function () {
    it('should create an entity with the appropriate shape', function () {

        var expectedX = Math.random() * 100;
        var expectedY = Math.random() * 100;
        var expectedShape = SpaceRocks.Shapes.bullet();

        var bullet = SpaceRocks.BulletFactory.build(expectedX, expectedY,0);
        expect(bullet.shape).to.deep.equal(expectedShape);
    });

    it('should create an entity with a set velocity', function () {

        var shape = SpaceRocks.Shapes.bullet();
        var expectedVelocity = new SpaceRocks.Point(0,5);

        var bullet = SpaceRocks.BulletFactory.build(1, 1, 0);
        var actualVelocity = bullet.velocity;
        expect(actualVelocity).to.deep.equal(expectedVelocity);
    });

});