/**
 * Created by Eric on 1/10/2016.
 */

var proxy = require('proxyquireify')(require);
var verify = require('../TestVerification');
var spies = require('../TestSpies');

var AudioBufferLoader = require('../../src/engine/AudioBufferLoader');

describe('BufferLoader', function () {
    var stubContext;
    var stubCallback;
    var mockAjax;
    beforeEach(function () {
        stubContext = spies.createStub(new AudioContext());
        stubCallback = spies.create('done callback');
        mockAjax = createMockAjax();
        AudioBufferLoader = proxy('../../src/engine/AudioBufferLoader', {
            '../Util': {Ajax: mockAjax}
        });
    });

    afterEach(function () {
    });

    function createMockAjax() {
        return {
            calls: [],
            sendWasCalled: 0,
            responseType: 'default',
            get: function (url) {
                this.method = 'GET';
                this.url = url;
                return this;
            },
            post: function (url) {
                this.method = 'POST';
                this.url = url;
                return this;
            },
            getBuffer: function (url) {
                this.method = 'GET';
                this.url = url;
                this.responseType = 'arraybuffer';
                return this;
            },
            send: function () {
                this.sendWasCalled++;
                this.calls.push({
                    method: this.method,
                    url: this.url,
                    success: this.successCallback,
                    fail: this.failCallback,
                    responseType: this.responseType
                });
            },
            onSuccess: function (successCallback) {
                this.successCallback = successCallback;
                return this;
            },
            onFail: function (failCallback) {
                this.failCallback = failCallback;
                return this;
            }
        };
    }

    it('should make an async server request', function () {

        var file1 = 'kaboom.mp3';
        var file2 = 'earth-shattering.wav';
        var expectedData1 = '39ufh32j';
        var expectedData2 = 'h4klj53oi';
        var expectedBuffer1 = [0, 1, 1, 01, 0, 1, 01, 01, 0, 1];
        var expectedBuffer2 = [0, 1, 0, 1, 1, 110, 0, 11, 1, 0];

        var config = {
            context: stubContext,
            files: [file1, file2],
            complete: stubCallback
        };

        AudioBufferLoader.load(config);

        verifyAjax(0, 'GET', file1);
        verifyAjax(1, 'GET', file2);

        mockAjax.calls[1].success(expectedData2);
        mockAjax.calls[0].success(expectedData1);

        respondToContextDecode(1, expectedData1, expectedBuffer1);
        verify(stubCallback).wasNotCalled();
        respondToContextDecode(0, expectedData2, expectedBuffer2);

        verify(stubCallback).wasCalledOnce();
        verify(stubCallback).wasCalledWithConfig(0, [expectedBuffer1, expectedBuffer2]);
    });

    function respondToContextDecode(callIndex, expectedData, bufferToReturn) {
        var decodeCall = stubContext.decodeAudioData.getCall(callIndex);
        expect(decodeCall.args[0]).to.equal(expectedData);
        decodeCall.args[1](bufferToReturn);
    }

    function verifyAjax(callIndex, method, url) {
        var ajaxCall = mockAjax.calls[callIndex];
        if (!ajaxCall) {
            throw new Error('No ajax call is present for index ' + callIndex);
        }
        assert.equal('arraybuffer', ajaxCall.responseType);
        assert.equal(method, ajaxCall.method);
        assert.equal(url, ajaxCall.url);
    }
});