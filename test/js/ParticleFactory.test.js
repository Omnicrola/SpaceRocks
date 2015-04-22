/**
 * Created by Eric on 4/18/2015.
 */
describe('ParticleFactory', function () {
    beforeEach(function (done) {
        OMD.test.globalStub(SpaceRocks.Renderer, 'width');
        OMD.test.globalStub(SpaceRocks.Renderer, 'height');
        done();
    });
    afterEach(function () {
        OMD.test.restoreAll();
    });

    it('should create an entity at the target position', function () {
        var expectedX = Math.random();
        var expectedY = Math.random();
        var expectedVelX = Math.random();
        var expectedVelY = Math.random();

        var expectedShape = new SpaceRocks.Polygon([
            new SpaceRocks.Point(0, 0),
            new SpaceRocks.Point(1, 0)
        ]);

        var expectedEntity = new SpaceRocks.Entity(expectedX, expectedY, expectedShape);
        expectedEntity.velocity.x = expectedVelX;
        expectedEntity.velocity.y = expectedVelY;

        var particle = SpaceRocks.ParticleFactory.build(expectedX, expectedY, expectedVelX, expectedVelY);
        expect(particle.position).to.deep.equal(expectedEntity.position);
        expect(particle.velocity).to.deep.equal(expectedEntity.velocity);
        expect(particle.shape).to.deep.equal(expectedEntity.shape);
    });

    it('should self destruct after the specified time', function () {
        var life = 100;
        var particle = SpaceRocks.ParticleFactory.build(0, 0, 0, 0, life);

        expect(particle.isAlive()).to.equal(true);
        particle.update(10);
        expect(particle.isAlive()).to.equal(true);
        particle.update(10);
        expect(particle.isAlive()).to.equal(true);
        particle.update(10);
        expect(particle.isAlive()).to.equal(true);
        particle.update(71);
        expect(particle.isAlive()).to.equal(false);
    });

});