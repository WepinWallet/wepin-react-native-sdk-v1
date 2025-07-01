<br/>

<p align="center">
  <a href="https://wepin.io">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://github.com/WepinWallet/wepin-web-sdk-v1/blob/main//assets/wepin_logo_white.png">
        <img bg_color="white" alt="wepin logo" src="https://github.com/WepinWallet/wepin-web-sdk-v1/blob/main//assets/wepin_logo_color.png" width="250" height="auto">
      </picture>
  </a>
</p>

<br>

# @wepin/provider-rn

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/WepinWallet/wepin-react-native-sdk/blob/main/LICENSE)

[![npm version](https://img.shields.io/npm/v/@wepin/provider-rn?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@wepin/provider-rn) [![npm downloads](https://img.shields.io/npm/dt/@wepin/provider-rn.svg?label=downloads&style=for-the-badge)](https://www.npmjs.com/package/@wepin/provider-rn)

[![platform - android](https://img.shields.io/badge/platform-Android-3ddc84.svg?logo=android&style=for-the-badge)](https://www.android.com/) [![platform - ios](https://img.shields.io/badge/platform-iOS-000.svg?logo=apple&style=for-the-badge)](https://developer.apple.com/ios/)

Wepin Provider SDK for React Native. This package is exclusively available for use in React Native environments (Android and iOS).

Wepin supports providers that return JSON-RPC request responses to connect with blockchain networks. With Wepin Provider, you can easily connect to various networks supported by Wepin.

The providers supported by Wepin are as follows:

- EVM compatible Networks
- Klaytn Network (Kaia)

## ⏩ Get App ID and Key

After signing up for [Wepin Workspace](https://workspace.wepin.io/), go to the development tools menu and enter the information for each app platform to receive your App ID and App Key.

## ⏩ Requirements

- Android API version 24 or newer is required.
- iOS version 13 or newer is required.

## ⏩ Install

```sh
npm install @wepin/provider-rn
```

or

```sh
yarn add @wepin/provider-rn
```

### peerDependencies

```bash
npm install react-native-device-info

# for ios
cd ios
pod install
```

or

```bash
yarn add react-native-device-info

# for ios
cd ios
pod install
```

## ⏩ Getting Started

To enable OAuth login functionality, you need to configure the Deep Link Scheme.

Deep Link scheme format : `wepin. + Your Wepin App ID`

### Android

When a custom scheme is used, WepinProvider Library can be easily configured to capture all redirects using this custom scheme through a manifest placeholder in the file `build.gradle(app)`:

```gradle
// For Deep Link => RedirectScheme Format : wepin. + Wepin App ID
android.defaultConfig.manifestPlaceholders = [
  'appAuthRedirectScheme': 'wepin.{{YOUR_WEPIN_APPID}}'
]
```

### iOS

You must add the app's URL scheme to the Info.plist file. This is necessary for redirection back to the app after the authentication process.

The value of the URL scheme should be `'wepin.' + your Wepin app id`.

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>unique name</string>
        <array>
            <string>wepin + your Wepin app id</string>
        </array>
    </dict>
</array>
```

## ⏩ Import SDK

```js
import WepinProvider from '@wepin/provider-rn';
```

## ⏩ Initialize

```js
const wepinProvider = new WepinProvider({
  appId: 'wepinAppId',
  appKey: 'wepinAppKey',
});
```

### init

```js
await wepinProvider.init();
```

#### Parameters

- `attributes` \<IWepinSDKAttributes> **optional**
  - `defaultLanguage`: The language to be displayed on the widget (default: `'en'`)
    Currently, only `ko`, `en`, and `ja` are supported.
  - `defaultCurrency`: The currency to be displayed on the widget (default: `'USD'`)
    Currently, only `'KRW'`,`'USD'` and `'JPY'` are supported.

#### Returns

- Promise\<boolean>

#### Example

```js
await wepinProvider.init({
  defaultLanguage: 'ko',
  defaultCurrency: 'KRW',
});
```

### isInitialized

```js
wepinProvider.isInitialized();
```

The `isInitialized()` method checks if the Wepin Provider SDK is initialized.

#### Returns

- \<boolean>
  - true if Wepin Provider SDK is already initialized.

### changeLanguage

```js
await wepinProvider.changeLanguage({ language, currency });
```

Change the language and currency of the widget.

#### Parameters

- \<object>
  - `language` \<string> - The language to be displayed on the widget. Currently, only `'ko'`, `'en'` and `'ja'` are supported.
  - `currency` \<string> **optional** - The currency to be displayed on the widget. Currently, only `'KRW'`, `'USD'` and `'JPY'` are supported.

#### Returns

- Promise\<void>

#### Example

```javascript
await wepinProvider.changeLanguage({
  language: 'ko',
  currency: 'KRW',
});
```

## ⏩ Method

Methods can be used after initialization of Wepin Provider SDK.

### login

The `login` variable is a Wepin login library that includes various authentication methods, allowing users to log in using different approaches. It supports email and password login, OAuth provider login, login using ID tokens or access tokens, and more.

#### Available Methods

- `loginWithOauthProvider`
- `signUpWithEmailAndPassword`
- `loginWithEmailAndPassword`
- `loginWithIdToken`
- `loginWithAccessToken`
- `getRefreshFirebaseToken`
- `loginWepin`
- `getCurrentWepinUser`
- `logout`
- `getSignForLogin`

These methods support various login scenarios, allowing you to select the appropriate method based on your needs.

#### Example

```javascript
// Login using an OAuth provider
const oauthResult = await wepinProvider.login.loginWithOauthProvider({
  provider: 'google',
  clientId: 'your-client-id',
});

// Sign up and log in using email and password
const signUpResult = await wepinProvider.login.signUpWithEmailAndPassword(
  'example@example.com',
  'password123'
);

// Log in to Wepin
const wepinLoginResult = await wepinProvider.login.loginWepin(signUpResult);

// Get the currently logged-in user
const currentUser = await wepinProvider.login.getCurrentWepinUser();

// Logout
await wepinProvider.login.logout();
```

### getProvider

```javascript
await wepinProvider.getProvider(network);
```

It returns a Provider by given network.

#### Parameters

- `network` \<string> - Available chains Wepin helps provide. It should be lowercase. (e.g., "ethereum", "klaytn", "kaia")

#### Returns

- Promise\<BaseProvider> - A EIP-1193 compatible provider

#### Example

```javascript
const provider = await wepinProvider.getProvider('ethereum');
```

### finalize

```js
await wepinProvider.finalize();
```

The `finalize()` method finalizes the Wepin Provider SDK.

#### Parameters

- void

#### Returns

- Promise\<void>

#### Example

```js
await wepinProvider.finalize();
```

## ⏩ Provider Methods

Once you have obtained a provider using `getProvider()`, you can use the following methods:

### request

The provider implements the EIP-1193 standard, so you can make JSON-RPC requests using the `request` method.

```javascript
await provider.request({ method, params });
```

The `request` method sends JSON-RPC requests to the blockchain network. It handles both Wepin-specific wallet methods (like account requests and transaction signing) and standard blockchain RPC calls.

#### Parameters

- `args` \<RequestArguments>
  - `method` \<string> - RPC method name
  - `params` \<any[]> **optional** - Method parameters

#### Returns

- Promise\<any> - RPC Response

#### Example

```javascript
const provider = await wepinProvider.getProvider('ethereum');

// Get connected accounts
const accounts = await provider.request({
  method: 'eth_requestAccounts',
});
console.log('Connected accounts:', accounts);

// Sign message
const signature = await provider.request({
  method: 'eth_sign',
  params: ['0x...', 'Hello, world!'],
});

// Personal sign
const personalSignature = await provider.request({
  method: 'personal_sign',
  params: ['Hello, World', '0x...'],
});

// Sign typed data v4
const typedDataV4 = {
  types: {
    EIP712Domain: [{ name: 'name', type: 'string' }],
    Mail: [{ name: 'contents', type: 'string' }],
  },
  primaryType: 'Mail',
  domain: { name: 'Ether Mail' },
  message: { contents: 'Hello, Bob!' },
};
const typedSignature = await provider.request({
  method: 'eth_signTypedData_v4',
  params: ['0x...', typedDataV4],
});

// Send transaction
const transaction = {
  from: '0x...',
  to: '0x...',
  value: '0x0',
  data: '0x',
};
const txHash = await provider.request({
  method: 'eth_sendTransaction',
  params: [transaction],
});
```
