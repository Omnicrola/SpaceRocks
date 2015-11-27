/**
 * Created by Eric on 4/21/2015.
 */
describe('BehaviorFactory', function () {
    afterEach(function () {
        OMD.test.restoreAll();
    });

    describe('spawnParticleBehavior', function () {
        it('should spawn four particles using particle factory', function () {
            var expectedX = Math.random();
            var expectedY = Math.random();

            var particle1 = OMD.test.randomObject();
            var particle2 = OMD.test.randomObject();
            var particle3 = OMD.test.randomObject();
            var particle4 = OMD.test.randomObject();

            var entity = new SpaceRocks.Entity(expectedX, expectedY, {});
            var buildParticleStub = OMD.test.globalStub(SpaceRocks.ParticleFactory, 'build');
            var addEntitySpy = OMD.test.globalSpy(SpaceRocks.EntityManager, 'addEntity');
            var expectedLife = 10;
            buildParticleStub.withArgs(expectedX, expectedY, 5, 5, expectedLife).returns(particle1);
            buildParticleStub.withArgs(expectedX, expectedY, 5, -5, expectedLife).returns(particle2);
            buildParticleStub.withArgs(expectedX, expectedY, -5, 5, expectedLife).returns(particle3);
            buildParticleStub.withArgs(expectedX, expectedY, -5, -5, expectedLife).returns(particle4);

            var expectedCollisionGroup = SpaceRocks.CollisionManager.EFFECTS_GROUP();

            var behaviorFactory = SpaceRocks.BehaviorFactory;
            var particleBehavior = behaviorFactory.buildParticleSpawnBehavior();

            particleBehavior(entity);
            expect(addEntitySpy.getCalls().length).to.equal(4);
            expect(addEntitySpy.calledWith(particle1, expectedCollisionGroup)).to.equal(true);
            expect(addEntitySpy.calledWith(particle2, expectedCollisionGroup)).to.equal(true);
            expect(addEntitySpy.calledWith(particle3, expectedCollisionGroup)).to.equal(true);
            expect(addEntitySpy.calledWith(particle4, expectedCollisionGroup)).to.equal(true);


        });
    });

    describe('buildSpawnMediumAsteroids', function () {
        it('should build two medium asteroids at location', function () {
            var expectedX = Math.random();
            var expectedY = Math.random();
            var expectedPosition = {x: expectedX, y: expectedY};

            var asteroid1 = OMD.test.randomObject();
            var asteroid2 = OMD.test.randomObject();

            var entity = new SpaceRocks.Entity(expectedX, expectedY, {});
            var buildAsteroidStub = OMD.test.globalStub(SpaceRocks.AsteroidFactory, 'buildMedium');
            var addEntitySpy = OMD.test.globalSpy(SpaceRocks.EntityManager, 'addEntity');

            buildAsteroidStub.onFirstCall().returns(asteroid1);
            buildAsteroidStub.onSecondCall().returns(asteroid2);

            var behaviorFactory = SpaceRocks.BehaviorFactory;
            var spawnMediumAsteroids = behaviorFactory.buildSpawnMediumAsteroids();
            spawnMediumAsteroids(entity);

            expect(buildAsteroidStub.getCalls().length).to.equal(2);
            expect(buildAsteroidStub.firstCall.args[0]).to.deep.equal(expectedPosition);
            expect(buildAsteroidStub.secondCall.args[0]).to.deep.equal(expectedPosition);

            var expectedGroup = SpaceRocks.CollisionManager.ASTEROIDS_GROUP();
            expect(addEntitySpy.getCalls().length).to.equal(2);
            expect(addEntitySpy.calledWith(asteroid1, expectedGroup)).to.equal(true);
            expect(addEntitySpy.calledWith(asteroid2, expectedGroup)).to.equal(true);

        });
    });
    describe('buildSpawnSmallAsteroids', function () {
        it('should build two small asteroids at location', function () {
            var expectedX = Math.random();
            var expectedY = Math.random();
            var expectedPosition = {x: expectedX, y: expectedY};


            var asteroid1 = OMD.test.randomObject();
            var asteroid2 = OMD.test.randomObject();

            var entity = new SpaceRocks.Entity(expectedX, expectedY, {});
            var buildAsteroidStub = OMD.test.globalStub(SpaceRocks.AsteroidFactory, 'buildSmall');
            var addEntitySpy = OMD.test.globalSpy(SpaceRocks.EntityManager, 'addEntity');

            buildAsteroidStub.onFirstCall().returns(asteroid1);
            buildAsteroidStub.onSecondCall().returns(asteroid2);

            var behaviorFactory = SpaceRocks.BehaviorFactory;
            var spawnSmallAsteroids = behaviorFactory.buildSpawnSmallAsteroids();
            spawnSmallAsteroids(entity);

            expect(buildAsteroidStub.getCalls().length).to.equal(2);
            expect(buildAsteroidStub.firstCall.args[0]).to.deep.equal(expectedPosition);
            expect(buildAsteroidStub.secondCall.args[0]).to.deep.equal(expectedPosition);

            var expectedGroup = SpaceRocks.CollisionManager.ASTEROIDS_GROUP();
            expect(addEntitySpy.getCalls().length).to.equal(2);
            expect(addEntitySpy.calledWith(asteroid1, expectedGroup)).to.equal(true);
            expect(addEntitySpy.calledWith(asteroid2, expectedGroup)).to.equal(true);

        });
    });

    describe('increment score behavior', function () {
        it('should increment score by given amount', function () {
            var scoreSpy = OMD.test.globalSpy(SpaceRocks.Gui, 'incrementScore');
            var scoreAmount = Math.random() * 100;

            var behaviorFactory = SpaceRocks.BehaviorFactory;
            var behavior = behaviorFactory.buildIncrementScore(scoreAmount);

            expect(scoreSpy.called).to.equal(false);
            behavior();
            expect(scoreSpy.calledWith(scoreAmount)).to.equal(true);
        });
        it('should allow behaviors with different amounts', function () {
            var scoreSpy = OMD.test.globalSpy(SpaceRocks.Gui, 'incrementScore');
            var scoreAmount1 = Math.random() * 100;
            var scoreAmount2 = Math.random() * 100;
            var scoreAmount3 = Math.random() * 100;

            var behaviorFactory = SpaceRocks.BehaviorFactory;
            var behavior1 = behaviorFactory.buildIncrementScore(scoreAmount1);
            var behavior2 = behaviorFactory.buildIncrementScore(scoreAmount2);
            var behavior3 = behaviorFactory.buildIncrementScore(scoreAmount3);

            expect(scoreSpy.called).to.equal(false);
            behavior1();
            expect(scoreSpy.calledOnce).to.equal(true);
            expect(scoreSpy.calledWith(scoreAmount1)).to.equal(true);

            behavior3();
            expect(scoreSpy.calledTwice).to.equal(true);
            expect(scoreSpy.calledWith(scoreAmount3)).to.equal(true);

            behavior2();
            expect(scoreSpy.calledThrice).to.equal(true);
            expect(scoreSpy.calledWith(scoreAmount2)).to.equal(true);
        });
    });

    describe('self destruct behavior', function () {
        it('should destroy entity after a specified time has passed', function () {
            var timeTillDeath = 23.3;
            var fakeEntity = {
                destroy: sinon.spy()
            };

            var behaviorFactory = SpaceRocks.BehaviorFactory;
            var behavior = behaviorFactory.buildSelfDestruct(timeTillDeath);

            behavior(fakeEntity, 0);
            expect(fakeEntity.destroy.called).to.equal(false);

            behavior(fakeEntity, 1.0);
            expect(fakeEntity.destroy.called).to.equal(false);

            behavior(fakeEntity, 22.0);
            expect(fakeEntity.destroy.called).to.equal(false);

            behavior(fakeEntity, 0.4);
            expect(fakeEntity.destroy.calledOnce).to.equal(true);


        });
        it('two different destruct behaviors should not interact', function () {
            var timeTillDeath = 10.0;
            var fakeEntity1 = {
                destroy: sinon.spy()
            };
            var fakeEntity2 = {
                destroy: sinon.spy()
            };

            var behaviorFactory = SpaceRocks.BehaviorFactory;
            var behavior1 = behaviorFactory.buildSelfDestruct(timeTillDeath);
            var behavior2 = behaviorFactory.buildSelfDestruct(timeTillDeath);

            behavior1(fakeEntity1, 8);
            behavior2(fakeEntity2, 8);
            expect(fakeEntity1.destroy.called).to.equal(false);
            expect(fakeEntity2.destroy.called).to.equal(false);

            behavior1(fakeEntity1, 2);
            behavior2(fakeEntity2, 1);
            expect(fakeEntity1.destroy.calledOnce).to.equal(true);
            expect(fakeEntity2.destroy.called).to.equal(false);


        });
    });


    describe('spin behavior', function () {
        it('should rotate the entity according to delta', function () {
            var fakeEntity = {
                rotation: sinon.spy()
            };
            var spinRate = 4.0;

            var behaviorFactory = SpaceRocks.BehaviorFactory;
            var behavior = behaviorFactory.buildSpin(spinRate);

            behavior(fakeEntity, 1.0);
            expect(fakeEntity.rotation.calledOnce).to.equal(true);
            expect(fakeEntity.rotation.calledWith(4.0)).to.equal(true);

            behavior(fakeEntity, 0.5);
            expect(fakeEntity.rotation.calledTwice).to.equal(true);
            expect(fakeEntity.rotation.calledWith(2.0)).to.equal(true);


        });
    });
});