/**
 * Created by Eric on 4/5/2015.
 */
describe('Level Manager', function () {
    var addEntitySpy;
    var stubAsteroidFactory;

    beforeEach(function (done) {
        addEntitySpy = OMD.test.globalSpy(SpaceRocks.EntityManager, 'addEntity');
        stubAsteroidFactory = OMD.test.globalStub(SpaceRocks.AsteroidFactory, 'build');
        done();
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });

    it('should track the level', function () {
        var levelManager = SpaceRocks.LevelManager;

        expect(levelManager.currentLevel()).to.equal(0);
        levelManager.startNextLevel();
        expect(levelManager.currentLevel()).to.equal(1);
        levelManager.startNextLevel();
        expect(levelManager.currentLevel()).to.equal(2);

    });

    it('should spawn 5 asteroids on level start', function () {
        var expectedAsteroid1 = OMD.test.randomObject();
        var expectedAsteroid2 = OMD.test.randomObject();
        var expectedAsteroid3 = OMD.test.randomObject();
        var expectedAsteroid4 = OMD.test.randomObject();
        var expectedAsteroid5 = OMD.test.randomObject();

        stubAsteroidFactory.onCall(0).returns(expectedAsteroid1);
        stubAsteroidFactory.onCall(1).returns(expectedAsteroid2);
        stubAsteroidFactory.onCall(2).returns(expectedAsteroid3);
        stubAsteroidFactory.onCall(3).returns(expectedAsteroid4);
        stubAsteroidFactory.onCall(4).returns(expectedAsteroid5);

        var levelManager = SpaceRocks.LevelManager;
        levelManager.startNextLevel();

        expect(addEntitySpy.called).to.equal(true);
        expect(addEntitySpy.getCalls().length).to.equal(5);
        expect(addEntitySpy.calledWith(expectedAsteroid1)).to.equal(true);
        expect(addEntitySpy.calledWith(expectedAsteroid2)).to.equal(true);
        expect(addEntitySpy.calledWith(expectedAsteroid3)).to.equal(true);
        expect(addEntitySpy.calledWith(expectedAsteroid4)).to.equal(true);
        expect(addEntitySpy.calledWith(expectedAsteroid5)).to.equal(true);
    });

});