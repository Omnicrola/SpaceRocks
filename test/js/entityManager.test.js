/**
 * Created by Eric on 3/21/2015.
 */
describe('spacerocks entityManager', function () {

    var entityManager;
    var Entity;
    beforeEach(function () {
        Entity = SpaceRocks.Entity;
        entityManager = SpaceRocks.EntityManager;
        entityManager.removeAllEntities();
        entityManager.player(null);
        OMD.test.globalSpy(SpaceRocks.CollisionManager, 'addEntity');
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });

    it('should pass entities to function', function () {
        var renderSpy = sinon.spy();

        var entity1 = sinon.spy();
        var entity2 = sinon.spy();

        entityManager.addEntity(entity1);
        entityManager.addEntity(entity2);

        entityManager.callEntities(renderSpy);

        expect(renderSpy.calledWith(entity1)).to.equal(true, 'entity1 was rendered');
        expect(renderSpy.calledWith(entity2)).to.equal(true, 'entity2 was rendered');
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
        var expectedEntity = new SpaceRocks.Entity();

        var entityManager = SpaceRocks.EntityManager;
        entityManager.addEntity(expectedEntity);

        expectedEntity.destroy();
        entityManager.cleanDeadEntities();

        entityManager.callEntities(spy1);
        expect(spy1.calledWith(expectedEntity)).to.equal(false, 'spy was called with entity');
    });


    it('should add and remove entities to CollisionManager', function () {
        var addSpy = OMD.test.globalSpy(SpaceRocks.CollisionManager, 'addEntity');
        var removeSpy = OMD.test.globalSpy(SpaceRocks.CollisionManager, 'removeEntity');

        var expectedCollisionGroup = 4;
        var expectedEntity = new SpaceRocks.Entity();

        entityManager.addEntity(expectedEntity, expectedCollisionGroup);

        expect(addSpy.calledWith(expectedEntity, expectedCollisionGroup)).to.equal(true, 'entity not added');
        expect(removeSpy.called).to.equal(false, 'remove not called');

        entityManager.removeEntity(expectedEntity);
        expect(removeSpy.calledWith(expectedEntity)).to.equal(true, 'remove was called');
    });

});