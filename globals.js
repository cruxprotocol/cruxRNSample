// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');
global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
    protocol: 'file:'
}


global.__filename = "lol/test.js"

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


    function getRandomValues (arr) {
        if (!randomBytes) randomBytes = require('react-native-randombytes').randomBytes


        const bytes = randomBytes(arr.length)
        for (var i = 0; i < bytes.length; i++) {
            arr[i] = bytes[i]
        }
    }
    console.log("getRandomValues changed")
}
