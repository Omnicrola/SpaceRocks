/**
 * Created by Eric on 3/24/2015.
 */
describe('main update', function () {
    var tempInput;
    var mockInput;
    var playerSpy;
    var ACCEL_RATE = 0.1;
    beforeEach(function (done) {

        tempInput = SpaceRocks.InputManager;
        mockInput = SpaceRocks.InputManager = {
            isAccellerating: sinon.stub(),
            isDecellerating: sinon.stub(),
            rotateCounterClockwise: sinon.stub(),
            rotateClockwise: sinon.stub()
        };


        playerSpy = SpaceRocks.EntityManager.player = sinon.stub();
        playerSpy = SpaceRocks.EntityManager.player = sinon.stub();
        done();
    });

    afterEach(function () {
        SpaceRocks.InputManager = tempInput;
    });

    it('should update entities position based on velocity', function () {

    });

    it('should not change velocity when no keys are pressed', function () {
        var expectedX = Math.random();
        var expectedY = Math.random();
        var player = {
            velocity: {x: expectedX, y: expectedY}
        };
        playerSpy.returns(player);
        mockInput.isAccellerating.returns(false);
        mockInput.isDecellerating.returns(false);
        mockInput.rotateCounterClockwise.returns(false);
        mockInput.rotateClockwise.returns(false);

        SpaceRocks.update(1.0);
        expect(player.velocity.x).to.equal(expectedX);
        expect(player.velocity.y).to.equal(expectedY);
    });

    it('should add velocity when up key is pressed', function () {
        var player = {
            velocity: {x: 0.0, y: 0.0}
        };
        playerSpy.returns(player);
        mockInput.isAccellerating.returns(true);

        SpaceRocks.update(1.0);
        expect(player.velocity.x).to.equal(0);
        expect(player.velocity.y).to.equal(ACCEL_RATE);
    });

    it('should decrease velocity when down key is pressed', function () {
        var player = {
            velocity: {x: 0.0, y: 0.0}
        };
        playerSpy.returns(player);
        mockInput.isDecellerating.returns(true);

        SpaceRocks.update(1.0);
        expect(player.velocity.x).to.equal(0);
        expect(player.velocity.y).to.equal(-ACCEL_RATE);
    });
});