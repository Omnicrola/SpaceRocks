/**
 * Created by Eric on 4/5/2015.
 */
var SpaceRocks = (function (spaceRocks) {
    var currentLevelNumber = 0;

    function _currentLevel() {
        return currentLevelNumber;
    }


    function _startNextLevel() {
        currentLevelNumber++;
        var random = new Random(currentLevelNumber);
        for (var i = 0; i < 5; i++) {
            var asteroid = spaceRocks.AsteroidFactory.build();
            spaceRocks.EntityManager.addEntity(asteroid);
        }
    }


    spaceRocks.LevelManager = {
        currentLevel: _currentLevel,
        startNextLevel: _startNextLevel
    };
    return spaceRocks;
})
(SpaceRocks || {});