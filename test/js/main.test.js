/**
 * Created by Eric on 3/14/2015.
 */

describe('test.main', function () {

    it('has a start function', function () {
        expect(typeof SpaceRocks).to.be('object');
        expect(typeof SpaceRocks.start).to.be('function');
        expect(SpaceRocks.start.length).to.be(1);
    });


    it('start function calls setInterval', function () {
        var setIntervalSpy = sinon.spy(window, "setInterval");

        SpaceRocks.start();
        expect(setIntervalSpy.calledOnce).to.be(true);
        var functionCall = setIntervalSpy.getCall(0);
        expect(functionCall.args[0]).to.be(SpaceRocks.run);
        expect(functionCall.args[1]).to.be(1000 / 24);

        window.setInterval.restore();
    });
    describe('the run() function', function () {
        beforeEach(function (done) {
            SpaceRocks.update = sinon.spy();
            SpaceRocks.draw = sinon.spy();
            SpaceRocks.delta = sinon.stub();
            done();
        });

        it('will call update() and draw() in the correct order', function () {
            var updateCalled = false;
            var drawCalled = false;
            SpaceRocks.update = function () {
                updateCalled = true;
            };
            SpaceRocks.draw = function () {
                expect(updateCalled).to.be(true);
                drawCalled = true;
            };

            SpaceRocks.run();
            expect(updateCalled).to.be(true);
            expect(drawCalled).to.be(true);

        });

        it('will pass delta value to update()', function () {
            var expectedDelta = 5.938;
            SpaceRocks.delta.onFirstCall().returns(expectedDelta);

            SpaceRocks.run();
            expect(SpaceRocks.update.calledOnce).to.be(true);
            expect(SpaceRocks.update.getCall(0).args[0]).to.be(expectedDelta);
        });
    });
});