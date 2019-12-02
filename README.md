## cruxRNSample 

This is sample RN app which uses rn-sdk. 

Apart from showing usage example of rn-sdk, it is also used to [test](#testing-release-branch) release branch rn-sdk version.

We are maintaining separate branch for [unbundled](https://github.com/cruxprotocol/cruxRNSample/tree/unbundled-metro-builds) and [bundled](https://github.com/cruxprotocol/cruxRNSample/tree/bundled) version

### Running app 
1. `yarn install`
2. `NODE_OPTIONS=--max-old-space-size=8192 npm run start --reset-cache --verbose`
3. `./node_modules/.bin/react-native run-android`


### Testing release branch

Testing needs to happen to for both bundled and unbundled branch

#### 1. Sample app from [unbundled version](https://github.com/cruxprotocol/cruxRNSample/tree/unbundled-metro-builds) branch
1. First unlink/remove older `@crxupay/rn-sdk` installed.
2. For safety `rm -rf node_modules/` and `rm -rf package-lock.json`
4. Open package.json (remove @cruxpay/rn-sdk as we are going to install it from branch manually )
5. `yarn install`
6. `yarn add https://github.com/cruxprotocol/rn-sdk#release/0.0.xxx` []
7. On first tab run: `emulator -avd Pixel_3a_XL_API_29`
8. On second tab run: `NODE_OPTIONS=--max-old-space-size=8192 npm run start --reset-cache --verbose`
9. On third tab run: `./node_modules/.bin/react-native run-android`

#### 2. Sample app from [bundled version](https://github.com/cruxprotocol/cruxRNSample/tree/bundled) branch

The steps 1-6 are same for bundled version too. After doing those follow these (which essentially are building the bundled form of the sdk).
1. `cd node_modules/@cruxpay/rn-sdk`
2. `npm install`
3. `NODE_ENV=prod npm run build`
4. `cd ../../../`

Again continue with step 7-9 as above
