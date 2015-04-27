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

        var life = Math.random() * 100;
        var entityBuildStub = OMD.test.globalStub(SpaceRocks.Entity, 'build');
        var expectedEntity = sinon.stub(new SpaceRocks.Entity());
        entityBuildStub.returns(expectedEntity);


        var expectedShape = new SpaceRocks.Polygon([
            new SpaceRocks.Point(0, 0),
            new SpaceRocks.Point(1, 0)
        ]);

        var actualParticle = SpaceRocks.ParticleFactory.build(expectedX, expectedY, expectedVelX, expectedVelY);
        expect(entityBuildStub.calledOnce).to.equal(true);
        expect(actualParticle).to.equal(expectedEntity);

        expect(actualParticle.position).to.deep.equal(expectedEntity.position);
        expect(actualParticle.velocity).to.deep.equal(expectedEntity.velocity);
        expect(actualParticle.shape).to.deep.equal(expectedEntity.shape);
    });

    it('should add self destruct behavior', function () {
        var life = Math.random() * 100;
        var entityBuildStub = OMD.test.globalStub(SpaceRocks.Entity, 'build');
        var stubEntity = sinon.stub(new SpaceRocks.Entity());
        entityBuildStub.returns(stubEntity);

        var selfDestructStub = OMD.test.globalStub(SpaceRocks.BehaviorFactory, 'buildSelfDestruct');
        var expectedSelfDestruct = OMD.test.randomObject();
        selfDestructStub.returns(expectedSelfDestruct);

        var particle = SpaceRocks.ParticleFactory.build(0, 0, 0, 0, life);

        expect(entityBuildStub.calledOnce).to.equal(true);
        expect(selfDestructStub.calledOnce).to.equal(true);
        expect(stubEntity.addBehavior.calledWith(expectedSelfDestruct)).to.equal(true);

    });

});