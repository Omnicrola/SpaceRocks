/**
 * Created by Eric on 4/18/2015.
 */
describe('CollisionManager', function () {


    beforeEach(function (done) {
        SpaceRocks.CollisionManager.removeAllEntities();
        done();
    });

    it('will destroy two entities if they collide', function () {
        var entity1 = createMockEntity();
        var entity2 = createMockEntity();
        entity1.collide.returns(true);
        entity2.collide.returns(false);

        var collisionManager = SpaceRocks.CollisionManager;
        collisionManager.addEntity(entity1, 1);
        collisionManager.addEntity(entity2, 2);

        collisionManager.checkCollisions();

        expect(entity1.collide.calledOnce).to.equal(true);
        expect(entity1.collide.firstCall.args[0]).to.equal(entity2);
        expect(entity2.collide.calledOnce).to.equal(true);
        expect(entity2.collide.firstCall.args[0]).to.equal(entity1);

        expect(entity1.destroy.calledOnce).to.equal(true);
        expect(entity2.destroy.calledOnce).to.equal(true);
    });

    it('will not destroy two entities if they do not collide', function () {
        var entity1 = createMockEntity();
        var entity2 = createMockEntity();
        entity1.collide.returns(false);
        entity2.collide.returns(false);

        var collisionManager = SpaceRocks.CollisionManager;
        collisionManager.addEntity(entity1, 1);
        collisionManager.addEntity(entity2, 2);

        collisionManager.checkCollisions();

        expect(entity1.collide.calledOnce).to.equal(true);
        expect(entity1.collide.firstCall.args[0]).to.equal(entity2);
        expect(entity2.collide.calledOnce).to.equal(true);
        expect(entity2.collide.firstCall.args[0]).to.equal(entity1);

        expect(entity1.destroy.called).to.equal(false);
        expect(entity2.destroy.called).to.equal(false);
    });

    it('will not check collisions for entities in the same group', function () {
        var entity1 = createMockEntity();
        var entity2 = createMockEntity();
        entity1.collide.returns(false);
        entity2.collide.returns(false);

        var collisionManager = SpaceRocks.CollisionManager;
        collisionManager.addEntity(entity1, 3);
        collisionManager.addEntity(entity2, 3);

        collisionManager.checkCollisions();

        expect(entity1.collide.called).to.equal(false);
        expect(entity2.collide.called).to.equal(false);

        expect(entity1.destroy.called).to.equal(false);
        expect(entity2.destroy.called).to.equal(false);
    });

    it('will not collide entities in the FX group', function(){
        var asteroidEntity = createMockEntity();
        var playerEntity = createMockEntity();
        var effectsEntity = createMockEntity();

        var collisionManager = SpaceRocks.CollisionManager;
        collisionManager.addEntity(asteroidEntity, collisionManager.ASTEROIDS_GROUP());
        collisionManager.addEntity(playerEntity, collisionManager.PLAYER_GROUP());
        collisionManager.addEntity(effectsEntity, collisionManager.EFFECTS_GROUP());

        collisionManager.checkCollisions();
        expect(effectsEntity.collide.called).to.equal(false);
        expect(asteroidEntity.collide.calledWith(effectsEntity)).to.equal(false);
        expect(playerEntity.collide.calledWith(effectsEntity)).to.equal(false);
    });

    it('will throw an error if no collision group is specified', function () {
        var mockEntity = createMockEntity();
        var actualError = null;
        var collisionManager = SpaceRocks.CollisionManager;
        try {
            collisionManager.addEntity(mockEntity);
        } catch (error) {
            actualError = error;
        }
        expect(actualError).to.equal('No collision group specified.');
    });

    it('has collision group constants', function () {
        expect(SpaceRocks.CollisionManager.ASTEROIDS_GROUP()).to.equal(1);
        expect(SpaceRocks.CollisionManager.PLAYER_GROUP()).to.equal(2);
        expect(SpaceRocks.CollisionManager.EFFECTS_GROUP()).to.equal(99);
    });

    function createMockEntity() {
        var entity = new SpaceRocks.Entity(0, 0, {});
        sinon.stub(entity, 'collide');
        sinon.stub(entity, 'destroy');
        return entity;
    }
});