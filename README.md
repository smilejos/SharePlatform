# SharePlatform

This practice project to implement Node.js, React, Socket.IO, ES6

### We have to modify below 2 module to make it worakable on server side
1. screenfull (./node_modules/screenfull/dist/screenfull.js)

from
```js
for (; i < l; i++) {
    val = fnMap[i];
    if (val && val[1] in document) {
        for (i = 0, valLength = val.length; i < valLength; i++) {
            ret[fnMap[0][i]] = val[i];
        }
        return ret;
    }
}
```
to
```js
if( typeof document !== 'undefined') {
    for (; i < l; i++) {
        val = fnMap[i];
        if (val && val[1] in document) {
            for (i = 0, valLength = val.length; i < valLength; i++) {
                ret[fnMap[0][i]] = val[i];
            }
            return ret;
        }
    }
}
```

2. socket.io-client (./node_modules/socket.io-client/lib/url.js)
from
```js
if ('/' === uri.charAt(0)) {
    if ('/' === uri.charAt(1)) {
    uri = loc.protocol + uri;
    } else {
    uri = loc.host + uri;
    }
}
```
to
```js
if ('/' === uri.charAt(0)) {
    if ('/' === uri.charAt(1)) {
    uri = loc.protocol + uri;
    } else {
    uri = loc ? ( loc.host + uri ) : uri;
    }
}
```