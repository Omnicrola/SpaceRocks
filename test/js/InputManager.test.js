/**
 * Created by Eric on 3/24/2015.
 */
describe('InputManager', function () {
    var downSpy;
    var upSpy;
    var mockKibo;
    beforeEach(function (done) {
        downSpy = sinon.spy();
        upSpy = sinon.spy();
        mockKibo = {
            down: downSpy,
            up: upSpy
        };
        done();
    });

    it('should initialize keybindings to Kibo', function () {
        SpaceRocks.InputManager.init(mockKibo);
        expect(downSpy.called).to.equal(true);
        expect(downSpy.getCall(0).args[0]).to.equal('up');
        expect(downSpy.getCall(1).args[0]).to.equal('down');
        expect(downSpy.getCall(2).args[0]).to.equal('left');
        expect(downSpy.getCall(3).args[0]).to.equal('right');
        expect(downSpy.getCall(4).args[0]).to.equal('space');

        expect(upSpy.called).to.equal(true);
        expect(upSpy.getCall(0).args[0]).to.equal('up');
        expect(upSpy.getCall(1).args[0]).to.equal('down');
        expect(upSpy.getCall(2).args[0]).to.equal('left');
        expect(upSpy.getCall(3).args[0]).to.equal('right');
        expect(upSpy.getCall(4).args[0]).to.equal('space');

    });

    it('should should set Accelleration when Up key is pressed', function () {
        SpaceRocks.InputManager.init(mockKibo);
        var setDown = downSpy.getCall(0).args[1];
        var setUp = upSpy.getCall(0).args[1];
        checkKeyToggle(SpaceRocks.InputManager.isAccellerating, setDown, setUp);
    });

    it('should should set Decelleration when Down key is pressed', function () {
        SpaceRocks.InputManager.init(mockKibo);
        var setDown = downSpy.getCall(1).args[1];
        var setUp = upSpy.getCall(1).args[1];
        checkKeyToggle(SpaceRocks.InputManager.isDecellerating, setDown, setUp);
    });

    it('should should set rotateCounterClockwise when left key is pressed', function () {
        SpaceRocks.InputManager.init(mockKibo);
        var setDown = downSpy.getCall(2).args[1];
        var setUp = upSpy.getCall(2).args[1];
        checkKeyToggle(SpaceRocks.InputManager.rotateCounterClockwise, setDown, setUp);
    });

    it('should should set rotateClockwise when right key is pressed', function () {
        SpaceRocks.InputManager.init(mockKibo);
        var setDown = downSpy.getCall(3).args[1];
        var setUp = upSpy.getCall(3).args[1];
        checkKeyToggle(SpaceRocks.InputManager.rotateClockwise, setDown, setUp);
    });

    it('should should set fireWeapon when spacebar key is pressed', function () {
        SpaceRocks.InputManager.init(mockKibo);
        var setDown = downSpy.getCall(4).args[1];
        var setUp = upSpy.getCall(4).args[1];
        checkKeyToggle(SpaceRocks.InputManager.fireWeapon, setDown, setUp);
    });

    function checkKeyToggle(getState, setDown, setUp) {
        expect(getState()).to.equal(false);
        setDown();
        expect(getState()).to.equal(true);
        setDown();
        expect(getState()).to.equal(true);
        setUp();
        expect(getState()).to.equal(false);

    }
});