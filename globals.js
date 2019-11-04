import 'node-libs-react-native/globals';
if (typeof btoa === 'undefined') {
    global.btoa = str => new Buffer(str, 'binary').toString('base64'); // eslint-disable-line no-buffer-constructor
}
if (typeof atob === 'undefined') {
    global.atob = b64Encoded => new Buffer(b64Encoded, 'base64').toString('binary'); // eslint-disable-line no-buffer-constructor
}
if (!Error.captureStackTrace) { // captureStackTrace is only available when debugging
    Error.captureStackTrace = () => {};
}

global.__filename = "cruxpay/logger.js"

if (require('./package.json').dependencies['react-native-randombytes']) {
    // important that this comes before require('crypto')

    let crypto
    if (typeof window === 'object') {
        if (!window.crypto) window.crypto = {}
        crypto = window.crypto
    } else {
        crypto = require('crypto')
    }

    if (!crypto.getRandomValues) {
        crypto.getRandomValues = getRandomValues
    }

    let randomBytes

    function getRandomValues(array) {
        if (!randomBytes) randomBytes = require('react-native-randombytes').randomBytes;
        const bytes = randomBytes(array.length);
        for (let i = 0; i < bytes.length; i++) {
            array[i] = bytes[i];
        }
        return array;
    }
}
