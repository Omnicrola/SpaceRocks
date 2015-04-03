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
        expect(entity.position.x).to.be(x);
        expect(entity.position.y).to.be(y);

    });

    it("should initialize it's velocity", function () {
        var entity = SpaceRocks.Entity.build(5, 2);
        expect(entity.velocity.x).to.be(0);
        expect(entity.velocity.y).to.be(0);
    });

    it('should initialize its rotation', function () {
        var shape = new SpaceRocks.Polygon([]);
        var entity = SpaceRocks.Entity.build(5, 2, shape);
        expect(entity.rotation()).to.be(0);
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

        expect(entity.position.x).to.be(x);
        expect(entity.position.y).to.be(y);

    });

    it('will move based on velocity and delta (case1)', function () {
        var entity = SpaceRocks.Entity.build();
        expect(entity.position.x).to.be(0);
        expect(entity.position.y).to.be(0);
        entity.velocity.x = 50;
        entity.velocity.y = 60;
        entity.update(0.5);

        expect(entity.position.x).to.be(25);
        expect(entity.position.y).to.be(30);
    });

    it('will move based on velocity and delta (case2)', function () {
        var entity = SpaceRocks.Entity.build();
        expect(entity.position.x).to.be(0);
        expect(entity.position.y).to.be(0);
        entity.velocity.x = 200;
        entity.velocity.y = 100;
        entity.update(0.25);

        expect(entity.position.x).to.be(50);
        expect(entity.position.y).to.be(25);
    });

    it("should hold a shape", function () {
        var shape = [3, 4, 43, 4];
        var entity = SpaceRocks.Entity.build(0, 0, shape);
        expect(entity.shape).to.be(shape);
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

});