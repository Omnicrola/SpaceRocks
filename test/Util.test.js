/**
 * Created by Eric on 1/10/2016.
 */
var verify = require('./TestVerification');
var spies = require('./TestSpies');

var Util = require('../src/Util');

describe('Util', function () {

    describe('freezing an object', function () {
        it('should make properties read-only - case 1', function () {
            var expectedSubObj = {baz: 'fuzz'};
            var origional = {
                foo: 'bar',
                nummy: 12345,
                myObj: expectedSubObj
            };
            var frozenObject = Util.freeze(origional);
            verify.readOnlyProperty(frozenObject, 'foo', 'bar');
            verify.readOnlyProperty(frozenObject, 'nummy', 12345);
            verify.readOnlyProperty(frozenObject, 'myObj', expectedSubObj);
        });
        it('should make properties read-only - case 2', function () {
            var expectedSubObj = {bazzy: 'fuzzy'};
            var origional = {
                'my bar': 'bar',
                '122': 6647,
                '$my-obj': expectedSubObj
            };
            var frozenObject = Util.freeze(origional);
            verify.readOnlyProperty(frozenObject, 'my bar', 'bar');
            verify.readOnlyProperty(frozenObject, '122', 6647);
            verify.readOnlyProperty(frozenObject, '$my-obj', expectedSubObj);
        });
    });
    describe('Ajax', function () {
        var ajaxServer;
        var ajaxRequests;
        var expectedUrl = '/my/fav/url';
        var expectedData = 'my favorite data';
        var successSpy;
        var failedSpy;
        beforeEach(function () {
            ajaxServer = sinon.useFakeXMLHttpRequest();
            ajaxServer.onCreate = function (request) {
                ajaxRequests.push(request);
            }
            ajaxRequests = [];
            successSpy = spies.create('success');
            failedSpy = spies.create('fail');
        });

        afterEach(function () {
            ajaxServer.restore();
        });

        it('should not make request until send is called', function () {
            var ajaxUtil = Util.Ajax
                .get(expectedUrl);
            expect(ajaxRequests.length).to.equal(0);
            ajaxUtil.send();
            expect(ajaxRequests.length).to.equal(1);
        });

        it('should call success when response is 200 - GET', function () {
            checkSuccessfulGetResponse(200, 'hurray!');
        });

        it('should call success when response is 200 - POST', function () {
            checkSuccessfulPostResponse(200, 'hurray!');
        });

        it('should call success when response is 302 - GET', function () {
            checkSuccessfulGetResponse(302, 'zomgerd redirect');
        });
        it('should call success when response is 302 - POST', function () {
            checkSuccessfulPostResponse(302, 'zomgerd redirect');
        });

        it('should parse JSON data when requested', function () {
            var expectedObject = {
                foo: Math.random(),
                data: {
                    dat: Math.random(),
                    mar: ['asdf', 1234, 'ffoofoo']
                }
            };
            var json = JSON.stringify(expectedObject);
            Util.Ajax
                .get(expectedUrl)
                .onSuccess(successSpy)
                .json()
                .send();
            sendGetResponse(0, 200, json);

            verify(successSpy).wasCalledOnce();
            var actualData = successSpy.firstCall.args[0];
            verify.config(expectedObject, actualData);

        });

        it('should call fail when response is 404 - GET', function () {
            checkFailingGetResponse(404, 'omgerd fail');
        });

        it('should call fail when response is 404 - POST', function () {
            checkFailingPostResponse(404, 'omgerd fail');
        });

        it('should call fail when response is 403 - GET', function () {
            checkFailingGetResponse(403, 'omgerd fail');
        });

        it('should call fail when response is 403 - POST', function () {
            checkFailingPostResponse(403, 'omgerd fail');
        });

        it('should call fail when response is  500 - GET', function () {
            checkFailingGetResponse(500, 'omgerd fail');
        });

        it('should call fail when response is  500 - POST', function () {
            checkFailingPostResponse(500, 'omgerd fail');
        });

        it('should call fail when response is not 505 - GET', function () {
            checkFailingGetResponse(505, 'omgerd fail');
        });

        it('should call fail when response is not 505 - POST', function () {
            checkFailingPostResponse(505, 'omgerd fail');
        });

        function checkFailingGetResponse(expectedStatus, expectedMessage) {
            Util.Ajax
                .get(expectedUrl)
                .onSuccess(successSpy)
                .onFail(failedSpy)
                .send();
            verify(failedSpy).wasNotCalled();
            sendGetResponse(0, expectedStatus, expectedMessage);

            verify(failedSpy).wasCalledOnce();
            verify(failedSpy).wasCalledWith(expectedStatus, expectedMessage);
            verify(successSpy).wasNotCalled();
        }

        function checkFailingPostResponse(expectedStatus, expectedMessage) {
            Util.Ajax
                .post(expectedUrl)
                .onSuccess(successSpy)
                .onFail(failedSpy)
                .send();
            verify(failedSpy).wasNotCalled();
            sendPostResponse(0, expectedStatus, expectedMessage);

            verify(failedSpy).wasCalledOnce();
            verify(failedSpy).wasCalledWith(expectedStatus, expectedMessage);
            verify(successSpy).wasNotCalled();
        }

        function checkSuccessfulGetResponse(expectedStatus, expectedMessage) {
            Util.Ajax
                .get(expectedUrl)
                .onSuccess(successSpy)
                .onFail(failedSpy)
                .send();
            verify(successSpy).wasNotCalled();
            sendGetResponse(0, expectedStatus, expectedMessage);

            verify(successSpy).wasCalledOnce();
            verify(successSpy).wasCalledWith(expectedMessage);
            verify(failedSpy).wasNotCalled();
        }

        function checkSuccessfulPostResponse(expectedStatus, expectedMessage) {
            Util.Ajax
                .post(expectedUrl)
                .onSuccess(successSpy)
                .onFail(failedSpy)
                .send();
            verify(successSpy).wasNotCalled();
            sendPostResponse(0, expectedStatus, expectedMessage);

            verify(successSpy).wasCalledOnce();
            verify(successSpy).wasCalledWith(expectedMessage);
            verify(failedSpy).wasNotCalled();
        }

        function sendGetResponse(responseIndex, status, data) {
            var ajaxRequest = ajaxRequests[responseIndex];
            assert.isTrue(ajaxRequest.async);
            assert.equal('GET', ajaxRequest.method);
            assert.equal(expectedUrl, ajaxRequest.url);
            ajaxRequest.respond(status, [], data);
        }

        function sendPostResponse(responseIndex, status, data) {
            var ajaxRequest = ajaxRequests[responseIndex];
            assert.isTrue(ajaxRequest.async);
            assert.equal('POST', ajaxRequest.method);
            assert.equal(expectedUrl, ajaxRequest.url);
            ajaxRequest.respond(status, [], data);
        }
    });

});