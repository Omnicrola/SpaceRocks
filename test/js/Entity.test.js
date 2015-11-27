/**
 * Created by Eric on 3/21/2015.
 */
describe("Entity", function () {
    var widthStub;
    var heightStub;
    beforeEach(function (done) {
        widthStub = OMD.test.globalStub(SpaceRocks.Renderer, 'width');
        heightStub = OMD.test.globalStub(SpaceRocks.Renderer, 'height');
        widthStub.returns(100);
        heightStub.returns(100);

        done();
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });

    it("should initialize it's position", function () {
        var x = 100;
        var y = 200;
        var entity = SpaceRocks.Entity.build(x, y);
        expect(entity.position.x).to.equal(x);
        expect(entity.position.y).to.equal(y);

    });

    it("is alive by default", function () {
        var entity = SpaceRocks.Entity.build(1, 1);
        expect(entity.isAlive()).to.equal(true);

    });

    it("should initialize it's velocity", function () {
        var entity = SpaceRocks.Entity.build(5, 2);
        expect(entity.velocity.x).to.equal(0);
        expect(entity.velocity.y).to.equal(0);
    });

    it('should initialize its rotation', function () {
        var shape = new SpaceRocks.Polygon([]);
        var entity = SpaceRocks.Entity.build(5, 2, shape);
        expect(entity.rotation()).to.equal(0);
    });

    it('should rotate its shape', function () {
        var expectedAngle = 28.3;
        var shape = new SpaceRocks.Polygon([]);
        var entity = SpaceRocks.Entity.build(5, 2, shape);

        expect(shape.angle).to.equal(0);
        entity.rotation(expectedAngle);
        expect(shape.angle).to.equal(expectedAngle);
    });

    it("should remember it's position", function () {
        var x = 433;
        var y = 283;
        var entity = SpaceRocks.Entity.build();
        entity.position.x = x;
        entity.position.y = y;

        expect(entity.position.x).to.equal(x);
        expect(entity.position.y).to.equal(y);

    });

    it('will move based on velocity and delta (case1)', function () {
        var entity = SpaceRocks.Entity.build();
        expect(entity.position.x).to.equal(0);
        expect(entity.position.y).to.equal(0);
        entity.velocity.x = 50;
        entity.velocity.y = 60;
        entity.update(0.5);

        expect(entity.position.x).to.equal(25);
        expect(entity.position.y).to.equal(30);
    });

    it('will move based on velocity and delta (case2)', function () {
        var entity = SpaceRocks.Entity.build();
        expect(entity.position.x).to.equal(0);
        expect(entity.position.y).to.equal(0);
        entity.velocity.x = 200;
        entity.velocity.y = 100;
        entity.update(0.25);

        expect(entity.position.x).to.equal(50);
        expect(entity.position.y).to.equal(25);
    });

    it("should hold a shape", function () {
        var shape = [3, 4, 43, 4];
        var entity = SpaceRocks.Entity.build(0, 0, shape);
        expect(entity.shape).to.equal(shape);
    });


    it('should wrap to 0 when position is greater than screen size', function () {
        var entity = SpaceRocks.Entity.build();
        entity.position.x = 106;
        entity.position.y = 110;

        entity.update(1.0);
        expect(entity.position.x).to.equal(6);
        expect(entity.position.y).to.equal(10);
    });

    it('should wrap to screen max when position is less than zero', function () {
        var maxX = 545;
        var maxY = 632;
        widthStub.returns(maxX);
        heightStub.returns(maxY);

        var entity = SpaceRocks.Entity.build();
        entity.position.x = -20;
        entity.position.y = -100;

        entity.update(1.0);
        expect(entity.position.x).to.equal(maxX - 20);
        expect(entity.position.y).to.equal(maxY - 100);
    });

    it('should process behaviors', function () {
        var entity = SpaceRocks.Entity.build();
        var behaviorSpy = sinon.spy();

        entity.addBehavior(behaviorSpy);
        expect(behaviorSpy.called).to.equal(false);

        var delta = 4.293;
        entity.update(delta);
        expect(behaviorSpy.calledOnce).to.equal(true);
        var behaviorCall = behaviorSpy.getCall(0);
        expect(behaviorCall.args[0]).to.equal(entity);
        expect(behaviorCall.args[1]).to.equal(delta);
    });

    it('should process behavior on death', function () {
        var entity = SpaceRocks.Entity.build();
        var deathSpy1 = sinon.spy();
        var deathSpy2 = sinon.spy();

        entity.addDeathBehavior(deathSpy1);
        entity.addDeathBehavior(deathSpy2);

        expect(entity.isAlive()).to.equal(true);
        expect(deathSpy1.called).to.equal(false);
        expect(deathSpy2.called).to.equal(false);

        entity.destroy();
        expect(entity.isAlive()).to.equal(false);
        expect(deathSpy1.calledOnce).to.equal(true);
        expect(deathSpy1.firstCall.args[0]).to.equal(entity);
        expect(deathSpy2.calledOnce).to.equal(true);
        expect(deathSpy2.firstCall.args[0]).to.equal(entity);
    });

    describe('collisions', function () {

        it('should report collisions from shape', function () {
            var intersectStub = sinon.stub();
            var shape2 = OMD.test.randomObject();
            intersectStub.returns(true);


            var x1 = Math.random();
            var y1 = Math.random();
            var x2 = Math.random();
            var y2 = Math.random();
            var expectedX = x1 - x2;
            var expectedY = y1 - y2;
            var entity1 = SpaceRocks.Entity.build(x1, y1, {intersects: intersectStub});
            var entity2 = SpaceRocks.Entity.build(x2, y2, shape2);

            var result = entity1.collide(entity2);
            expect(result).to.equal(true);
            expect(intersectStub.calledOnce);
            expect(intersectStub.firstCall.args[0]).to.equal(shape2);
            expect(intersectStub.firstCall.args[1]).to.equal(expectedX);
            expect(intersectStub.firstCall.args[2]).to.equal(expectedY);

        });

    });

});