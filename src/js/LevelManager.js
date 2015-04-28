/**
 * Created by Eric on 4/5/2015.
 */
var LevelState = (function () {
    return {
        START: function () {
            return 'START'
        },
        END: function () {
            return 'END'
        },
        DEAD: function () {
            return 'DEAD'
        },
        SPAWN: function () {
            return 'SPAWN'
        },
        PLAY: function () {
            return 'PLAY'
        }
    }
})();

var SpaceRocks = (function (spaceRocks) {

    var currentLevelNumber = 0;
    var levelState = LevelState.END();
    var _observers = [];

    function _currentLevel() {
        return currentLevelNumber;
    }

    function _addObserver(observer) {
        _observers.push(observer);
    }


    function _startNextLevel() {
        currentLevelNumber++;
    }

    function _spawnPlayer() {
        var playerShape = spaceRocks.Shapes.player();
        var newPlayer = spaceRocks.Entity.buildLarge(100, 100, playerShape);
        spaceRocks.EntityManager.player(newPlayer);
    }

    function notifyObserversOfState(){
        _observers.forEach(function(singleObserver){
           singleObserver(levelState);
        });
    }

    function _setState(newState){
        levelState = newState;
        notifyObserversOfState();
    }

    spaceRocks.LevelManager = {
        currentLevel: _currentLevel,
        startNextLevel: _startNextLevel,
        addObserver: _addObserver,
        setState : _setState
    };
    return spaceRocks;
})
(SpaceRocks || {});
