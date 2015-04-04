/**
 * Created by Eric on 3/14/2015.
 */

describe('Main', function () {
    describe('start function', function () {
        var canvasElement;
        var tempInput;

        beforeEach(function (done) {
            OMD.test.globalSpy(window, 'Kibo');
            OMD.test.globalSpy(SpaceRocks.InputManager, 'init');
            canvasElement = document.createElement('canvas');
            canvasElement.id = 'testCanvas';
            document.body.appendChild(canvasElement);
            done();
        });

        afterEach(function () {
            document.body.removeChild(canvasElement);
            OMD.test.restoreAll();
        });

        it('will set canvas context on Renderer', function () {
            var setCanvasSpy = SpaceRocks.Renderer.setCanvas = sinon.spy();
            var contextFromTestElement = canvasElement.getContext('2d');

            SpaceRocks.start('testCanvas');
            expect(setCanvasSpy.called).to.equal(true);
            var contextPassedIn = setCanvasSpy.getCall(0).args[0];
            expect(contextPassedIn).to.equal(contextFromTestElement);
        });

        it('will spawn player on EntityManager', function () {
            var entityCreateStub = OMD.test.globalStub(SpaceRocks.Entity, 'build');
            var playerShapeStub = OMD.test.globalStub(SpaceRocks.Shapes, 'player');
            var setPlayerSpy = OMD.test.globalSpy(SpaceRocks.EntityManager, 'player');

            var expectedShape = OMD.test.randomObject();
            var expectedEntity = OMD.test.randomObject();
            playerShapeStub.returns(expectedShape);
            entityCreateStub.withArgs(100,100,expectedShape).returns(expectedEntity);

            SpaceRocks.start('testCanvas');

            expect(setPlayerSpy.calledOnce).to.be.ok;
            expect(setPlayerSpy.getCall(0).args[0]).to.equal(expectedEntity);
        });

        it('will call setInterval with run()', function () {
            var setIntervalSpy = window.setInterval = sinon.spy();

            SpaceRocks.start(canvasElement.id);
            expect(setIntervalSpy.calledOnce).to.equal(true);
            var functionCall = setIntervalSpy.getCall(0);
            expect(functionCall.args[0]).to.equal(SpaceRocks.run);
            expect(functionCall.args[1]).to.equal(1000 / 24);

        });

        it('will initialize InputManager with Kibo', function () {
            var initSpy = SpaceRocks.InputManager.init = sinon.spy();
            SpaceRocks.start(canvasElement.id);
            expect(initSpy.calledOnce).to.equal(true);
        });
    });

    describe('the run() function', function () {
        var updateSpy;
        var drawSpy;
        var deltaStub;
        beforeEach(function (done) {
            updateSpy = OMD.test.globalSpy(SpaceRocks, 'update');
            deltaStub = OMD.test.globalStub(SpaceRocks, 'delta');
            drawSpy = OMD.test.globalSpy(SpaceRocks, 'draw');
            done();
        });

        afterEach(function () {
            OMD.test.restoreAll();
        });

        it('will call update() and draw() in the correct order', function () {
            var tempUpdate = SpaceRocks.update;
            var tempRender = SpaceRocks.draw;

            var updateCalled = false;
            var drawCalled = false;
            SpaceRocks.update = function () {
                updateCalled = true;
            };
            SpaceRocks.draw = function () {
                expect(updateCalled).to.equal(true);
                drawCalled = true;
            };

            SpaceRocks.run();
            expect(updateCalled).to.equal(true);
            expect(drawCalled).to.equal(true);

            SpaceRocks.draw = tempRender;
            SpaceRocks.update = tempUpdate;

        });

        it('will pass delta value to update()', function () {
            var expectedDelta = 5.938;
            deltaStub.onFirstCall().returns(expectedDelta);
            SpaceRocks.run();
            expect(updateSpy.calledOnce).to.equal(true);
            expect(updateSpy.getCall(0).args[0]).to.equal(expectedDelta);

        });
    });
});