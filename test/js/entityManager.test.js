/**
 * Created by Eric on 3/21/2015.
 */
describe('spacerocks entityManager', function () {
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

        expect(renderSpy.calledTwice).to.be(true);
        expect(renderSpy.getCall(0).args[0]).to.be(entity1);
        expect(renderSpy.getCall(1).args[0]).to.be(entity3);
    });

    it('should set a player', function(){
       var expectedPlayer = new SpaceRocks.Entity(1,2,[]);
        SpaceRocks.EntityManager.player(expectedPlayer);
        expect(SpaceRocks.EntityManager.player()).to.be(expectedPlayer);
    });

    it('should run function on the player', function(){
        var spy = sinon.spy();
        var expectedEntity = new SpaceRocks.Entity();
        SpaceRocks.EntityManager.player(expectedEntity);
        SpaceRocks.EntityManager.callEntities(spy);
        expect(spy.called).to.be(true);
        expect(spy.getCall(0).args[0]).to.be(expectedEntity);
    });
});