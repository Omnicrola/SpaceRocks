/**
 * Created by Eric on 3/21/2015.
 */
describe('spacerocks entityManager', function () {

    beforeEach(function (done) {
        SpaceRocks.EntityManager.removeAllEntities();
        OMD.test.globalSpy(SpaceRocks.CollisionManager, 'addEntity');
        done();
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });

    it('should pass entities to function', function () {
        var renderSpy = sinon.spy();

        var entity2 = new SpaceRocks.Entity(2, 20, []);
        var entity3 = new SpaceRocks.Entity(3, 30, {});
        var entity1 = new SpaceRocks.Entity(1, 10, {});

        SpaceRocks.EntityManager.addEntity(entity1);
        SpaceRocks.EntityManager.addEntity(entity2);
        SpaceRocks.EntityManager.addEntity(entity3);
        SpaceRocks.EntityManager.removeEntity(entity2);

        SpaceRocks.EntityManager.callEntities(renderSpy);

        expect(renderSpy.calledTwice).to.equal(true);
        expect(renderSpy.getCall(0).args[0]).to.equal(entity1);
        expect(renderSpy.getCall(1).args[0]).to.equal(entity3);
    });

    it('should set a player', function () {
        var addEntitySpy = OMD.test.globalSpy(SpaceRocks.CollisionManager, 'addEntity');

        var expectedPlayer = new SpaceRocks.Entity(1, 2, []);
        var expectedCollisionGroup = SpaceRocks.CollisionManager.PLAYER_GROUP();

        SpaceRocks.EntityManager.player(expectedPlayer);

        expect(SpaceRocks.EntityManager.player()).to.equal(expectedPlayer);
        expect(addEntitySpy.calledOnce).to.equal(true);
        expect(addEntitySpy.firstCall.args[0]).to.equal(expectedPlayer);
        expect(addEntitySpy.firstCall.args[1]).to.equal(expectedCollisionGroup);
    });

    it('should run function on the player', function () {
        var spy = sinon.spy();
        var expectedEntity = new SpaceRocks.Entity();
        SpaceRocks.EntityManager.player(expectedEntity);
        SpaceRocks.EntityManager.callEntities(spy);
        expect(spy.called).to.equal(true);
        expect(spy.getCall(0).args[0]).to.equal(expectedEntity);
    });

    it('should clean dead entities', function () {
        var spy1 = sinon.spy();
        var spy2 = sinon.spy();
        var expectedEntity = new SpaceRocks.Entity();

        var entityManager = SpaceRocks.EntityManager;
        entityManager.addEntity(expectedEntity);
        expectedEntity.destroy();

        entityManager.callEntities(spy1);

        expect(spy1.calledWith(expectedEntity)).to.equal(true);
        entityManager.cleanDeadEntities();

        entityManager.callEntities(spy2);
        expect(spy2.calledWith(expectedEntity)).to.equal(false);
    });


    it('should add and remove entities to CollisionManager', function () {
        var addSpy = OMD.test.globalSpy(SpaceRocks.CollisionManager, 'addEntity');
        var removeSpy = OMD.test.globalSpy(SpaceRocks.CollisionManager, 'removeEntity');

        var expectedCollisionGroup = 4;
        var expectedEntity = new SpaceRocks.Entity();

        var entityManager = SpaceRocks.EntityManager;
        entityManager.addEntity(expectedEntity, expectedCollisionGroup);

        expect(addSpy.calledOnce).to.equal(true);
        expect(addSpy.firstCall.args[0]).to.equal(expectedEntity);
        expect(addSpy.firstCall.args[1]).to.equal(expectedCollisionGroup);
        expect(removeSpy.called).to.equal(false);

        entityManager.removeEntity(expectedEntity);
        expect(removeSpy.calledOnce).to.equal(true);
        expect(removeSpy.firstCall.args[0]).to.equal(expectedEntity);
    });

});