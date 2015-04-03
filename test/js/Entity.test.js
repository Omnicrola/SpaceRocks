/**
 * Created by Eric on 3/21/2015.
 */
describe("Entity", function () {

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
        entity.velocity.x = -200;
        entity.velocity.y = 500;
        entity.update(0.25);

        expect(entity.position.x).to.be(-50);
        expect(entity.position.y).to.be(125);
    });

    it("should hold a shape", function () {
        var shape = [3, 4, 43, 4];
        var entity = SpaceRocks.Entity.build(0, 0, shape);
        expect(entity.shape).to.be(shape);
    });
});