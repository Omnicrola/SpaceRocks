/**
 * Created by Eric on 4/5/2015.
 */
describe('Level Manager', function () {
    var addEntitySpy;
    var stubAsteroidFactory;
    var playerStub;

    beforeEach(function (done) {
        playerStub = OMD.test.globalStub(SpaceRocks.EntityManager, 'player');
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

    it('should define level state enum', function(){
       expect(LevelState.START()).to.equal('START');
       expect(LevelState.END()).to.equal('END');
       expect(LevelState.DEAD()).to.equal('DEAD');
       expect(LevelState.SPAWN()).to.equal('SPAWN');
       expect(LevelState.PLAY()).to.equal('PLAY');
    });

    it('should notify of level state change', function(){

        var levelManager = SpaceRocks.LevelManager;
        var observerSpy1 = sinon.spy();
        var observerSpy2 = sinon.spy();
        levelManager.addObserver(observerSpy1);
        levelManager.addObserver(observerSpy2);

        levelManager.setState(LevelState.START());

        expect(observerSpy1.calledOnce).to.equal(true);
        expect(observerSpy2.calledOnce).to.equal(true);
        expect(observerSpy1.getCall(0).args[0]).to.equal(LevelState.START());
        expect(observerSpy2.getCall(0).args[0]).to.equal(LevelState.START());


    });



});