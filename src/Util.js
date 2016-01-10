/**
 * Created by Eric on 1/4/2016.
 */

module.exports = {
    freeze: function (obj) {
        var frozenObj = {};
        for (var prop in obj) {
            Object.defineProperty(frozenObj, prop, {
                writeable: false,
                enumerable: true,
                value: obj[prop]
            });
        }
        return frozenObj;
    },
    Ajax: {
        get: function (requestUrl) {
            return new AjaxRequest('GET', requestUrl);
        },
        getBuffer: function (requestUrl) {
            var ajaxRequest = new AjaxRequest('GET', requestUrl);
            ajaxRequest.useBuffer(true);
            return ajaxRequest;
        },
        post: function (requestUrl) {
            return new AjaxRequest('POST', requestUrl);
        }
    }
};

/*
 AjaxRequest Class
 */
var AjaxRequest = function (method, requestUrl) {
    this._requestMethod = method;
    this._requestUrl = requestUrl;
    this._failCallback = function () {
    };
    this._successCallback = function () {
    };
};

AjaxRequest.prototype.onSuccess = function (successCallback) {
    this._successCallback = successCallback;
    return this;
};

AjaxRequest.prototype.onFail = function (failCallback) {
    this._failCallback = failCallback;
    return this;
};

AjaxRequest.prototype.json = function () {
    this._json = true;
    return this;
};

AjaxRequest.prototype.useBuffer = function (shouldUse) {
    this._useBuffer = shouldUse;
}

AjaxRequest.prototype.send = function () {
    var xmlHttpRequest = new XMLHttpRequest();
    var self = this;
    if (this._useBuffer) {
        xmlHttpRequest.responseType = 'arraybuffer';
    }
    xmlHttpRequest.onload = function () {
        if (xmlHttpRequest.status === 200 || xmlHttpRequest.status === 302) {
            var responseData = getData.call(self, xmlHttpRequest);
            self._successCallback(responseData);
        } else {
            self._failCallback(xmlHttpRequest.status, xmlHttpRequest.responseText);
        }
    };

    xmlHttpRequest.open(this._requestMethod, this._requestUrl, true);
    xmlHttpRequest.send();
};

function getData(xmlHttpRequest) {
    if (this._useBuffer) {
        return xmlHttpRequest.response;
    } else {
        if (this._json) {
            return JSON.parse(xmlHttpRequest.responseText);
        } else {
            return xmlHttpRequest.responseText;
        }
    }
}