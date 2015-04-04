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
        expect(rectangleSpy.calledOnce).to.equal(true);
        var methodCall = rectangleSpy.getCall(0);
        expect(methodCall.args[0]).to.equal('#000000');
        expect(methodCall.args[1]).to.equal(0);
        expect(methodCall.args[2]).to.equal(0);
        expect(methodCall.args[3]).to.equal(expectedWidth);
        expect(methodCall.args[4]).to.equal(expectedHeight);
    });

    it('should pass a draw function to EntityManager', function () {
        SpaceRocks.draw();
        expect(callEntitySpy.calledOnce).to.equal(true);
        expect(typeof callEntitySpy.getCall(0).args[0]).to.equal('function');

    });

    it('should draw entities', function () {
        var offX = 5;
        var offY = 5;
        var stubShape = {
            getPoints:sinon.stub()
        };
        var point1 = new SpaceRocks.Point(4,5);
        var point2 = new SpaceRocks.Point(2.34,5.22);
        var point3 = new SpaceRocks.Point(4.455,-23.533);
        stubShape.getPoints.returns([point1,point2,point3]);

        var entity = new SpaceRocks.Entity(offX, offY, stubShape);

        SpaceRocks.draw();
        var drawFunction = callEntitySpy.getCall(0).args[0];
        drawFunction(entity);
        checkLineDrawn(offX, offY, point1, point2);
        checkLineDrawn(offX, offY, point2, point3);
        checkLineDrawn(offX, offY, point3, point1);


    });
    function checkLineDrawn(offX, offY, p1, p2) {
        expect(lineSpy.calledWith(p1.x + offX, p1.y + offY, p2.x + offX, p2.y + offY)).to.equal(true);
    }
});