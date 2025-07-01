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

# @wepin/pin-rn

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/WepinWallet/wepin-react-native-sdk-v1/blob/main/LICENSE)

[![npm version](https://img.shields.io/npm/v/@wepin/pin-rn?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@wepin/pin-rn) [![npm downloads](https://img.shields.io/npm/dt/@wepin/pin-rn.svg?label=downloads&style=for-the-badge)](https://www.npmjs.com/package/@wepin/pin-rn)

[![platform - android](https://img.shields.io/badge/platform-Android-3ddc84.svg?logo=android&style=for-the-badge)](https://www.android.com/) [![platform - ios](https://img.shields.io/badge/platform-iOS-000.svg?logo=apple&style=for-the-badge)](https://developer.apple.com/ios/)

Wepin PIN Pad SDK for React Native. This package is exclusively available for use in React Native environments (Android and iOS).

## ⏩ Get App ID and Key

After signing up for [Wepin Workspace](https://workspace.wepin.io/), go to the development tools menu and enter the information for each app platform to receive your App ID and App Key.

## ⏩ Requirements

- Android API version 24 or newer is required.
- iOS version 13 or newer is required.

## ⏩ Install

```sh
npm install @wepin/pin-rn
```

or

```sh
yarn add @wepin/pin-rn
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

When a custom scheme is used, WepinLogin Library can be easily configured to capture all redirects using this custom scheme through a manifest placeholder in the file `build.gradle(app)`:

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
import WepinPin from '@wepin/pin-rn';
```

## ⏩ Initialize

```js
const wepinPin = new WepinPin({
  appId: 'wepinAppId',
  appKey: 'wepinAppKey',
});
```

### init

```js
await wepinPin.init(attributes);
```

#### Parameters

- `attributes` \<IWepinSDKAttributes> **optional**
  - `defaultLanguage`: The language to be displayed on the PIN pad (default: `'en'`)
    Currently, only `ko`, `en`, and `ja` are supported.
  - `defaultCurrency`: The currency to be displayed on the PIN pad (default: `'USD'`)
    Currently, only `'KRW'`,`'USD'` and `'JPY'` are supported.

#### Returns

- Promise\<boolean>

#### Example

```js
await wepinPin.init({
  defaultLanguage: 'ko',
  defaultCurrency: 'KRW',
});
```

### isInitialized

```js
wepinPin.isInitialized();
```

The `isInitialized()` method checks if the Wepin PIN Pad SDK is initialized.

#### Returns

- \<boolean>
  - true if Wepin PIN Pad SDK is already initialized.

### changeLanguage

```js
await wepinPin.changeLanguage({ language });
```

Changes the language displayed on the PIN pad screen.

#### Parameters

- \<object>
  - `language` \<string> - The language to be displayed on the PIN pad screen.
    Currently, only `'ko'`, `'en'` and `'ja'` are supported.

#### Returns

- Promise\<void>

#### Example

```javascript
await wepinPin.changeLanguage({ language: 'ko' });
```

## ⏩ Method

Methods can be used after initialization of Wepin PIN Pad SDK.

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
const oauthResult = await wepinPin.login.loginWithOauthProvider({
  provider: 'google',
  clientId: 'your-client-id',
});

// Sign up and log in using email and password
const signUpResult = await wepinPin.login.signUpWithEmailAndPassword(
  'example@example.com',
  'password123'
);

// Log in to Wepin
const wepinLoginResult = await wepinPin.login.loginWepin(signUpResult);

// Get the currently logged-in user
const currentUser = await wepinPin.login.getCurrentWepinUser();

// Logout
await wepinPin.login.logout();
```

### generateRegistrationPINBlock

```javascript
await wepinPin.generateRegistrationPINBlock();
```

Generates a pin block for registration. This method should only be used when the loginStatus is pinRequired.

#### Parameters

- void

#### Returns

- Promise\<RegistrationPinBlock>
  - `uvd` \<EncUVD> - Encrypted PIN
    - `b64Data` \<string> - Data encrypted with the original key in b64SKey
    - `b64SKey` \<string> - A key that encrypts data encrypted with the Wepin's public key.
    - `seqNum` \<number> **optional** - Values to check for when using PIN numbers to ensure they are used in order.
  - `hint` \<EncPinHint> - Hints in the encrypted PIN.
    - `data` \<string> - Encrypted hint data.
    - `length` \<string> - The length of the hint
    - `version` \<number> - The version of the hint

#### Example

```js
const pinBlock = await wepinPin.generateRegistrationPINBlock();

// You need to make a Wepin RESTful API request using the received data.
fetch('https://sdk.wepin.io/v1/app/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Add authentication headers
  },
  body: JSON.stringify({
    // Add other required fields
    UVD: pinBlock.uvd,
    hint: pinBlock.hint,
  }),
});
```

### generateAuthPINBlock

```javascript
await wepinPin.generateAuthPINBlock(count?);
```

Generates a pin block for authentication.

#### Parameters

- `count` \<number> **optional** - If multiple PIN blocks are needed, please enter the number to generate. If the count value is not provided, it will default to 1.

#### Returns

- Promise\<AuthPinBlock>
  - `uvdList` \<EncUVD[]> - Encrypted pin list
    - `b64Data` \<string> - Data encrypted with the original key in b64SKey
    - `b64SKey` \<string> - A key that encrypts data encrypted with the wepin's public key.
    - `seqNum` \<number> **optional** - Values to check for when using PIN numbers to ensure they are used in order
  - `otp` \<string> **optional** - If OTP authentication is required, include the OTP.

#### Example

```javascript
const pinBlock = await wepinPin.generateAuthPINBlock(3);

// Sort seqNum of uvd in ascending order from 1 because you need to write it in order starting from 1
pinBlock.uvdList.sort((a, b) => (a.seqNum ?? 0) - (b.seqNum ?? 0));

const resArray = [];
for (const encUVD of pinBlock.uvdList) {
  const response = await fetch('https://sdk.wepin.io/v1/tx/sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers
    },
    body: JSON.stringify({
      userId: await getUserId(),
      walletId: await getWalletId(),
      accountId: (await getEthereumAccount()).accountId,
      type: 'msg_sign',
      txData: {
        data: '0x0',
      },
      pin: encUVD,
      otpCode: {
        code: pinBlock.otp,
      },
    }),
  });
  resArray.push(response);
}
```

### generateChangePINBlock

```javascript
await wepinPin.generateChangePINBlock();
```

Generate pin block for changing the PIN.

#### Parameters

- void

#### Returns

- Promise\<ChangePinBlock>
  - `uvd` \<EncUVD> - The user's existing encrypted PIN
    - `b64Data` \<string> - Data encrypted with the original key in b64SKey
    - `b64SKey` \<string> - A key that encrypts data encrypted with the wepin's public key.
    - `seqNum` \<number> **optional** - Values to check for when using PIN numbers to ensure they are used in order
  - `newUVD` \<EncUVD> - The user's new encrypted PIN
    - `b64Data` \<string> - Data encrypted with the original key in b64SKey
    - `b64SKey` \<string> - A key that encrypts data encrypted with the wepin's public key.
    - `seqNum` \<number> **optional** - Values to check for when using PIN numbers to ensure they are used in order
  - `hint` \<EncPinHint> - Hints in the encrypted PIN
    - `data` \<string> - Encrypted hint data
    - `length` \<string> - The length of the hint
    - `version` \<number> - The version of the hint
  - `otp` \<string> **optional** - If OTP authentication is required, include the OTP.

#### Example

```javascript
const pinBlock = await wepinPin.generateChangePINBlock();

const response = await fetch('https://sdk.wepin.io/v1/wallet/pin/change', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Add authentication headers
  },
  body: JSON.stringify({
    userId: await getUserId(),
    walletId: await getWalletId(),
    UVD: pinBlock.uvd,
    newUVD: pinBlock.newUVD,
    hint: pinBlock.hint,
    otpCode: {
      code: pinBlock.otp,
    },
  }),
});
```

### generateAuthOTPCode

```javascript
await wepinPin.generateAuthOTPCode();
```

Generate OTP for failed verify OTP.

#### Parameters

- void

#### Returns

- Promise\<AuthOTP>
  - `code` \<string> - The OTP entered by the user.

#### Example

```javascript
let res = await getWepinSignMessage(pinBlocks.uvdList, pinBlock.otp);
if (res.body[0].message === 'OTP_MISMATCH_WRONG_CODE') {
  const otp = await wepinPin.generateAuthOTPCode();
  res = await getWepinSignMessage(pinBlocks.uvdList, otp.code);
}
```

### finalize

```javascript
await wepinPin.finalize();
```

The `finalize()` method finalizes the Wepin PIN Pad SDK.

#### Parameters

- void

#### Returns

- Promise\<void>

#### Example

```javascript
await wepinPin.finalize();
```

### WepinPinError

This section provides descriptions of various error codes that may be encountered while using the Wepin PIN Pad SDK functionalities. Each error code corresponds to a specific issue, and understanding these can help in debugging and handling errors effectively.

| Error Code                   | Description                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| `ApiRequestError`            | There was an error while making the API request.                                                  |
| `InvalidParameters`          | One or more parameters provided are invalid or missing.                                           |
| `NotInitialized`             | The Wepin PIN Pad SDK has not been properly initialized.                                          |
| `InvalidAppKey`              | The Wepin app key is invalid.                                                                     |
| `InvalidLoginProvider`       | The login provider specified is not supported or is invalid.                                      |
| `InvalidToken`               | The token does not exist.                                                                         |
| `InvalidLoginSession`        | The login session information does not exist.                                                     |
| `UserCancelled`              | The user has cancelled the operation.                                                             |
| `UnknownError`               | An unknown error has occurred, and the cause is not identified.                                   |
| `NotConnectedInternet`       | The system is unable to detect an active internet connection.                                     |
| `FailedLogin`                | The login attempt has failed due to incorrect credentials or other issues.                        |
| `AlreadyLogout`              | The user is already logged out, so the logout operation cannot be performed again.                |
| `AlreadyInitialized`         | The Wepin PIN Pad SDK is already initialized.                                                     |
| `InvalidEmailDomain`         | The provided email address's domain is not allowed or recognized by the system.                   |
| `FailedSendEmail`            | The system encountered an error while sending an email.                                           |
| `RequiredEmailVerified`      | Email verification is required to proceed with the requested operation.                           |
| `IncorrectEmailForm`         | The provided email address does not match the expected format.                                    |
| `IncorrectPasswordForm`      | The provided password does not meet the required format or criteria.                              |
| `NotInitializedNetwork`      | The network or connection required for the operation has not been properly initialized.           |
| `RequiredSignupEmail`        | The user needs to sign up with an email address to proceed.                                       |
| `FailedEmailVerified`        | The Wepin PIN Pad SDK encountered an issue while attempting to verify the provided email address. |
| `FailedPasswordStateSetting` | Failed to set the password state.                                                                 |
| `FailedPasswordSetting`      | The Wepin PIN Pad SDK failed to set the password.                                                 |
| `ExistedEmail`               | The provided email address is already registered in Wepin.                                        |
| `NotActivity`                | The Context is not an activity.                                                                   |
