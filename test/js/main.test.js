/**
 * Created by Eric on 3/14/2015.
 */


describe('test.main', function () {
    it('should have a main function', function () {
        expect(SpaceRocks.main).to.be.a('function');
    });

    it('should build new engine and start interval', function () {
        var buildSpy = sinon.spy();
        SpaceRocks.engine = buildSpy;
        var loopSpy = sinon.spy();
        SpaceRocks.mainLoop = loopSpy;

        expect(loopSpy.called).not.to.be(true);
        SpaceRocks.main();
        expect(loopSpy.called).to.be(true);
        expect(loopSpy.getCall().args[0]).to.be(buildSpy);

    });
});