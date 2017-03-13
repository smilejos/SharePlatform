const endpoints = {
    facebook_login: '/auth/facebook'
};

function _makeRequest(method, uri, body, headers, callback) {
    var request = new XMLHttpRequest();
    request.open(method.toUpperCase(), uri, true);

    if (headers) {
        for (var name in headers) {
            // Skip the Content-Type header.
            // This will be set later if we provided a body.
            if (name === 'Content-Type') {
                continue;
            }

            var value = headers[name];
            request.setRequestHeader(name, value);
        }
    }

    // // If the URI is different than the URI of the domain we're on,
    // // then set withCredentials to true so that we enable CORS.
    // if (!utils.isRelativeUri(uri) && !utils.isSameHost(uri, window.location.href)) {
    //     request.withCredentials = true;
    // }

    request.onreadystatechange = function () {
        // 4 = Request finished and response is ready.
        // Ignore everything else.
        if (request.readyState !== 4) {
            return;
        }

        let result = {
            status: request.status,
            responseJSON: null
        };

        let caughtError = null;

        try {
            if (request.responseText) {
                result.responseJSON = JSON.parse(request.responseText);
            }
        } catch (e) {
            caughtError = e;
        }

        if (caughtError) {
            callback(caughtError);
        } else {
            callback(null, result);
        }

        callback(null, result);
    };

    if (body && typeof body === 'object') {
        var contentEncoder = getContentEncoder(headers['Content-Type']);
        request.setRequestHeader('Content-Type', contentEncoder.contentType);
        request.send(contentEncoder.encode(body));
    } else {
        request.send();
    }
}
    
export function facebook_login(callback) {
    _makeRequest('get', endpoints.facebook_login, null, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    }, callback);
};
