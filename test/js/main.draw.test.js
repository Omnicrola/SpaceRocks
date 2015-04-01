/**
 * Created by Eric on 3/22/2015.
 */
describe('main.draw', function () {
    var lineSpy;
    var rectangleSpy;
    var widthStub;
    var heightStub;
    var callEntitySpy;

    beforeEach(function (done) {
        lineSpy = OMD.test.globalSpy(SpaceRocks.Renderer, 'drawLine');
        rectangleSpy = OMD.test.globalSpy(SpaceRocks.Renderer, 'fillRectangle');
        widthStub = OMD.test.globalStub(SpaceRocks.Renderer, 'width');
        heightStub = OMD.test.globalStub(SpaceRocks.Renderer, 'height');
        callEntitySpy = OMD.test.globalSpy(SpaceRocks.EntityManager, 'callEntities');
        done();
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });


    it('fills canvas with blackness', function () {

        var expectedWidth = Math.random();
        var expectedHeight = Math.random();
        widthStub.onFirstCall().returns(expectedWidth);
        heightStub.onFirstCall().returns(expectedHeight);

        SpaceRocks.draw();
        expect(rectangleSpy.calledOnce).to.be(true);
        var methodCall = rectangleSpy.getCall(0);
        expect(methodCall.args[0]).to.be('#000000');
        expect(methodCall.args[1]).to.be(0);
        expect(methodCall.args[2]).to.be(0);
        expect(methodCall.args[3]).to.be(expectedWidth);
        expect(methodCall.args[4]).to.be(expectedHeight);
    });

    it('should pass a draw function to EntityManager', function () {
        SpaceRocks.draw();
        expect(callEntitySpy.calledOnce).to.be(true);
        expect(typeof callEntitySpy.getCall(0).args[0]).to.be('function');

    });

    it('should draw entities', function () {
        var point1 = new SpaceRocks.Point(3, 4);
        var point2 = new SpaceRocks.Point(6, 3);
        var point3 = new SpaceRocks.Point(2, 4);
        var shape = new SpaceRocks.Polygon([
            point1,
            point2,
            point3
        ]);
        var offX = 5;
        var offY = 5;
        var entity = new SpaceRocks.Entity(offX, offY, shape);

        SpaceRocks.draw();
        var drawFunction = callEntitySpy.getCall(0).args[0];
        drawFunction(entity);
        checkLineDrawn(offX, offY, point1, point2);
        checkLineDrawn(offX, offY, point2, point3);
        checkLineDrawn(offX, offY, point3, point1);


    });
    function checkLineDrawn(offX, offY, p1, p2) {
        expect(lineSpy.calledWith(p1.x + offX, p1.y + offY, p2.x + offX, p2.y + offY)).to.be(true);
    }
});