/**
 * Created by Eric on 12/19/2015.
 */
var proxy = require('proxyquireify')(require);
var verify = require('../../TestVerification');
var spies = require('../../TestSpies');

var Shape = require('../../../src/subsystems/entities/Shape');
var Entity = require('../../../src/subsystems/entities/Entity');
var CollisionManager = require('../../../src/subsystems/entities/CollisionManager');

describe('CollisionManager', function () {
    var collisionManager;
    var stubShape1;
    var stubEntity1;
    var stubShape2;
    var stubEntity2;
    beforeEach(function () {
        stubShape1 = spies.createStub(new Shape());
        stubShape2 = spies.createStub(new Shape());
        stubEntity1 = new Entity(stubShape1);
        stubEntity2 = new Entity(stubShape2);
        stubEntity1.isAlive = true;
        stubEntity2.isAlive = true;

        collisionManager = new CollisionManager();
        collisionManager.add(stubEntity1);
        collisionManager.add(stubEntity2);
    });

    it('should not change alive flag if entities do not intersect', function () {
        stubShape1.intersects.returns(false);
        stubShape2.intersects.returns(false);

        collisionManager.update();
        expect(stubEntity1.isAlive).to.be.true;
        expect(stubEntity2.isAlive).to.be.true;
    });

    it('should not collide an entity with itself', function(){
        collisionManager = new CollisionManager();
        collisionManager.add(stubEntity1);
        stubShape1.intersects.returns(true);

        collisionManager.update();
        verify(stubShape1.intersects).wasNotCalled();
        expect(stubEntity1.isAlive).to.be.true;
    });

    it('should destroy both entities if they intersect', function () {
        stubShape1.intersects.returns(true);

        collisionManager.update();
        expect(stubEntity1.isAlive).to.be.false;
        expect(stubEntity2.isAlive).to.be.false;
    });

    it('will not destroy entities if one is already destroyed', function () {
        stubShape1.intersects.returns(true);
        stubShape2.intersects.returns(true);
        stubEntity1.isAlive = false;

        collisionManager.update();
        expect(stubEntity1.isAlive).to.be.false;
        expect(stubEntity2.isAlive).to.be.true;
    });

    it('will remove entities that are destroyed', function () {
        stubEntity1.isAlive = false;
        stubEntity2.isAlive = false;

        collisionManager.update();
        verify(stubShape1.intersects).wasNotCalled();
        verify(stubShape2.intersects).wasNotCalled();
    });

});