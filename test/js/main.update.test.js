/**
 * Created by Eric on 3/24/2015.
 */
describe('main update', function () {
    var mockInput;
    var playerStub;
    var entityCallSpy;

    var ACCEL_RATE = 0.25;
    var TURN_RATE = 1;

    beforeEach(function (done) {
        entityCallSpy = OMD.test.globalSpy(SpaceRocks.EntityManager, 'callEntities');
        playerStub = OMD.test.globalStub(SpaceRocks.EntityManager, 'player');
        OMD.test.globalSpy(SpaceRocks, 'InputManager');
        mockInput = SpaceRocks.InputManager = {
            isAccellerating: sinon.stub(),
            isDecellerating: sinon.stub(),
            rotateCounterClockwise: sinon.stub(),
            rotateClockwise: sinon.stub()
        };
        done();
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });

    it('should update entities', function () {
        var entity = {
            update: sinon.spy()
        };

        var delta = Math.random();
        SpaceRocks.update(delta);
        expect(entityCallSpy.calledOnce).to.be.ok();
        var updateFunction = entityCallSpy.getCall(0).args[0];

        updateFunction(entity);
        expect(entity.update.calledOnce);
        expect(entity.update.getCall(0).args[0]).to.equal(delta);
    });

    it('should not change velocity when no keys are pressed', function () {
        var expectedX = Math.random();
        var expectedY = Math.random();
        var player = stubPlayer(expectedX, expectedY);
        playerStub.returns(player);

        mockInput.isAccellerating.returns(false);
        mockInput.isDecellerating.returns(false);
        mockInput.rotateCounterClockwise.returns(false);
        mockInput.rotateClockwise.returns(false);

        SpaceRocks.update(1.0);
        expect(player.velocity.x).to.equal(expectedX);
        expect(player.velocity.y).to.equal(expectedY);
    });

    it('should add velocity based on rotation when up key is pressed ', function () {
        var player = stubPlayer();
        var playerRotation = Math.random() * 200;
        playerStub.returns(player);
        player.rotation.returns (playerRotation);
        mockInput.isAccellerating.returns(true);

        var thrust = new SpaceRocks.Point(0, ACCEL_RATE).rotate(playerRotation);

        SpaceRocks.update(1.0);
        expect(player.velocity.x).to.equal(thrust.x);
        expect(player.velocity.y).to.equal(thrust.y);
    });

    it('should decrease velocity based on rotation when down key is pressed', function () {
        var player = stubPlayer();
        var playerRotation = Math.random() * 400;
        player.rotation.returns(playerRotation);
        playerStub.returns(player);
        mockInput.isDecellerating.returns(true);

        var thrust = new SpaceRocks.Point(0, ACCEL_RATE).rotate(playerRotation);
        SpaceRocks.update(1.0);
        expect(player.velocity.x).to.equal(thrust.x * -1);
        expect(player.velocity.y).to.equal(thrust.y * -1);
    });

    it('should rotate counter-clockwise when left key is pressed', function () {
        var player = stubPlayer();
        playerStub.returns(player);
        var startingRotation = 5.18;
        player.rotation.returns(startingRotation);
        mockInput.rotateCounterClockwise.returns(true);

        var expectedRotation = (TURN_RATE *-1) + startingRotation;
        SpaceRocks.update(1.0);
        expect(player.rotation.calledWith(expectedRotation)).to.be.ok();
    });

    it('should rotate clockwise when left key is pressed', function () {
        var player = stubPlayer();
        playerStub.returns(player);
        var startingRotation = 55.2178;
        player.rotation.returns(startingRotation);
        mockInput.rotateClockwise.returns(true);

        var expectedRotation = TURN_RATE + startingRotation;
        SpaceRocks.update(1.0);
        expect(player.rotation.calledWith(expectedRotation)).to.be.ok();
    });


    function stubPlayer(x, y) {
        x = (x) ? x : 0;
        y = (y) ? y : 0;
        return {
            velocity: {x: x, y: y},
            rotation: sinon.stub()
        };
    }
});