/**
 * Created by Eric on 4/7/2015.
 */
describe('Logic', function () {
    var addObserverSpy;
    beforeEach(function (done) {
        addObserverSpy = OMD.test.globalSpy(SpaceRocks.LevelManager, 'addObserver');
        done();
    });

    afterEach(function () {
        OMD.test.restoreAll();
    });


    it('should add observer to spawn player on level START', function () {
        var spawnPlayerStub = OMD.test.globalStub(SpaceRocks.Logic, 'spawnPlayer');

        var startObserver = logicInitAndGetObserver(0);
        expect(startObserver).to.equal(spawnPlayerStub);
    });

    it('should spawn a player', function () {
        var setPlayerSpy = OMD.test.globalSpy(SpaceRocks.EntityManager, 'player');
        var stubWidth = OMD.test.globalStub(SpaceRocks.Renderer, 'width');
        var stubHeight = OMD.test.globalStub(SpaceRocks.Renderer, 'height');
        var stubEntityBuild = OMD.test.globalStub(SpaceRocks.Entity, 'build');

        var expectedEntity = OMD.test.randomObject();
        stubEntityBuild.returns(expectedEntity);

        var expectedShape = SpaceRocks.Shapes.player();
        var width = 3922;
        var height = 922;
        stubWidth.returns(width);
        stubHeight.returns(height);

        var startObserver = SpaceRocks.Logic.spawnPlayer();

        expect(setPlayerSpy.calledOnce).to.equal(true);
        var actualPlayer = setPlayerSpy.getCall(0).args[0];

        expect(actualPlayer).to.equal(expectedEntity);
        expect(stubEntityBuild.firstCall.args[0]).to.equal(width / 2);
        expect(stubEntityBuild.firstCall.args[1]).to.equal(height / 2);
        expect(stubEntityBuild.firstCall.args[2]).to.deep.equal(expectedShape);
    });

    it('should execute a function on a timer', sinon.test(function () {
        var timeoutStub = this.stub(window, 'setTimeout');
        var eventSpy = this.spy();
        var expectedDelay = Math.random() * 1000;

        SpaceRocks.Logic.registerEvent({
            delay: expectedDelay,
            event: eventSpy
        });

        expect(timeoutStub.calledWith(eventSpy, expectedDelay)).to.equal(true, 'timeout was called');
    }));

    it('should add observer to spawn asteroids on level start', function () {
        var stubAsteroidFactory = OMD.test.globalStub(SpaceRocks.AsteroidFactory, 'buildLarge');
        var addEntitySpy = OMD.test.globalSpy(SpaceRocks.EntityManager, 'addEntity');

        var expectedCollisionGroup = SpaceRocks.CollisionManager.ASTEROIDS_GROUP();
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

        var asteroidSpawner = logicInitAndGetObserver(1);
        asteroidSpawner(LevelState.START());

        expect(addEntitySpy.called).to.equal(true);
        expect(addEntitySpy.getCalls().length).to.equal(5);
        expect(addEntitySpy.calledWith(expectedAsteroid1, expectedCollisionGroup)).to.equal(true);
        expect(addEntitySpy.calledWith(expectedAsteroid2, expectedCollisionGroup)).to.equal(true);
        expect(addEntitySpy.calledWith(expectedAsteroid3, expectedCollisionGroup)).to.equal(true);
        expect(addEntitySpy.calledWith(expectedAsteroid4, expectedCollisionGroup)).to.equal(true);
        expect(addEntitySpy.calledWith(expectedAsteroid5, expectedCollisionGroup)).to.equal(true);
    });

    function logicInitAndGetObserver(observerIndex) {
        SpaceRocks.Logic.init();

        expect(addObserverSpy.getCalls().length).to.equal(2);
        var observer = addObserverSpy.getCall(observerIndex).args[0];

        return observer;
    }

});