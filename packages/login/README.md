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

# @wepin/login-rn

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/WepinWallet/wepin-react-native-sdk/blob/main/LICENSE)

[![npm version](https://img.shields.io/npm/v/@wepin/login-rn?logo=npm&style=for-the-badge)](https://www.npmjs.org/package/@wepin/login-rn) [![npm downloads](https://img.shields.io/npm/dt/@wepin/login-rn.svg?label=downloads&style=for-the-badge)](https://www.npmjs.org/package/@wepin/login-rn)

[![platform - android](https://img.shields.io/badge/platform-Android-3ddc84.svg?logo=android&style=for-the-badge)](https://www.android.com/) [![platform - ios](https://img.shields.io/badge/platform-iOS-000.svg?logo=apple&style=for-the-badge)](https://developer.apple.com/ios/)

Wepin Login Library from React Native. This package is exclusively available for use in android and ios environments.

## ⏩ Get App ID and Key

After signing up for [Wepin Workspace](https://workspace.wepin.io/), go to the development tools menu and enter the information for each app platform to receive your App ID and App Key.

## ⏩ Requirements

- Android API version 24 or newer is required.
- iOS version 13 or newer is required.

## ⏩ Install

> ⚠️ Important Notice for v1.0.0 Update
>
> 🚨 Breaking Changes & Migration Guide 🚨
>
> This update includes major changes that may impact your app. Please read the following carefully before updating.
>
> 🔄 Storage Migration
> • In rare cases, stored data may become inaccessible due to key changes.
> • Starting from v1.0.0, if the key is invalid, stored data will be cleared, and a new key will be generated automatically.
> • Existing data will remain accessible unless a key issue is detected, in which case a reset will occur.
> • ⚠️ Downgrading to an older version after updating to v1.0.0 may prevent access to previously stored data.
> • Recommended: Backup your data before updating to avoid any potential issues.

> 🔧 How to Disable Backup (Android)
>
> Modify your AndroidManifest.xml file:
>
> ```xml
> <application
>     android:allowBackup="false"
>     android:fullBackupContent="false">
> ```
>
> 🔹 If android:allowBackup is true, the migration process may not work correctly, leading to potential data loss or storage issues.

```sh
npm install @wepin/login-rn
```

or

```sh
yarn add @wepin/login-rn
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

To enable OAuth login functionality (loginWithOauthProvider), you need to configure the Deep Link Scheme.

Deep Link scheme format : `wepin. + Your Wepin App ID`

### Android

When a custom scheme is used, WepinLogin Library can be easily configured to capture all redirects using this custom scheme through a manifest placeholder in the file `build.gralde(app)`:

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
import { WepinLogin } from '@wepin/login-rn';
```

## ⏩ Initialize

```js
const wepinLogin = new WepinLogin({
  appId: 'wepinAppId',
  appKey: 'wepinAppKey',
});
```

### init

```js
await wepinLogin.init();
```

#### Parameters

- void

#### Example

```js
await wepinLogin.init();
```

### isInitialized

```js
wepinLogin.isInitialized();
```

The `isInitialized()` method checks Wepin Login Library is initialized.

#### Returns

- \<boolean>
  - true if Wepin Login Library is already initialized.

## ⏩ Method

Methods can be used after initialization of Wepin Login Library.

### loginWithOauthProvider

```javascript
await wepinLogin.loginWithOauthProvider(params);
```

An inappbrowser will open and proceed to log in to OAuth provider. Returns OAuth login info upon successful login.

#### Parameters

- `params` \<object>
  - `provider` \<'google'|'naver'|'discord'|'apple'> - OAuth Login Provider
  - `clientId` \<string> - client id of OAuth Login Provider

#### Returns

- Promise\<LoginOauthResult>
  - `provider` \<'google'|'apple'|'discord'|'naver'>
  - `token` \<string> - OAuth Provider token
  - `type` \<'id_token'|'access_token'>

#### Exception

- [WepinLoginException](#WepinLoginException)

#### Example

```javascript
const user = await wepinLogin.loginWithOauthProvider({
  provider: 'google',
  clientId: 'google client id',
});
```

- response

```json
{
  "provider": "google",
  "token": "abcdefgh....adQssw5c",
  "type": "id_token"
}
```

### signUpWithEmailAndPassword

```javascript
await wepinLogin.signUpWithEmailAndPassword(email, password, locale?)
```

It signs up on the wepin firebase with your email and password. Returns firebase login info upon successful login.

#### Parameters

- `email` \<string> - User email
- `password` \<string> - User password
- `locale` \<string> - **optional** Language for the verification email (default value: "en")

#### Returns

- Promise\<LoginResult>
  - `provider` \<'email'>
  - `token` \<object>
    - `idToken` \<string> - wepin firebase idToken
    - `refreshToken` ``<string>` - wepin firebase refreshToken

#### Exception

- [WepinLoginException](#WepinLoginException)

#### Example

```javascript
const user = await wepinLogin.signUpWithEmailAndPassword(
  'abc@defg.com',
  'abcdef123&'
);
```

- response

```json
{
  "provider": "email",
  "token": {
    "idToken": "ab2231df....ad0f3291",
    "refreshToken": "eyJHGciO....adQssw5c"
  }
}
```

### loginWithEmailAndPassword

```javascript
await wepinLogin.loginWithEmailAndPassword(email, password);
```

It logs in to the Wepin firebase with your email and password. Returns firebase login info upon successful login.

#### Parameters

- `email` \<string> - User email
- `password` \<string> - User password

#### Returns

- Promise\<LoginResult>
  - `provider` \<'email'>
  - `token` \<object>
    - `idToken` \<string> - wepin firebase idToken
    - `refreshToken` ``<string>` - wepin firebase refreshToken

#### Exception

- [WepinLoginException](#WepinLoginException)

#### Example

```javascript
const user = await wepinLogin.loginWithEmailAndPassword(
  'abc@defg.com',
  'abcdef123&'
);
```

- response

```json
{
  "provider": "email",
  "token": {
    "idToken": "ab2231df....ad0f3291",
    "refreshToken": "eyJHGciO....adQssw5c"
  }
}
```

### loginWithIdToken

```javascript
await wepinLogin.loginWithIdToken(params);
```

It logs in to the Wepin firebase with external id token. Returns firebase login info upon successful login.

#### Parameters

- `params` \<object>
  - `token` \<string> - id token value to be used for login
  - `sign` \<string> - signature value for the token provided as the first parameter.([Signature Generation Methods](./SignatureGenerationMethods.md))

#### Returns

- Promise\<LoginResult>
  - `provider` \<'external_token'>
  - `token` \<object>
    - `idToken` \<string> - wepin firebase idToken
    - `refreshToken` ``<string>` - wepin firebase refreshToken

#### Exception

- [WepinLoginException](#WepinLoginException)

#### Example

```javascript
const user = await wepinLogin.loginWithIdToken({
  token: 'eyJHGciO....adQssw5c',
  sign: '9753d4dc...c63466b9',
});
```

- response

```json
{
  "provider": "external_token",
  "token": {
    "idToken": "ab2231df....ad0f3291",
    "refreshToken": "eyJHGciO....adQssw5c"
  }
}
```

### loginWithAccessToken

```javascript
await wepinLogin.loginWithAccessToken(params);
```

It logs in to the Wepin firebase with external access token. Returns firebase login info upon successful login.

#### Parameters

- `params` \<object>
  - `provider` \<'naver'|'discord'> - provider that issued the access token
  - `token` \<string> - access token value to be used for login
  - `sign` \<string> - signature value for the token provided as the first parameter.([Signature Generation Methods](./SignatureGenerationMethods.md))

#### Returns

- Promise\<LoginResult>
  - `provider` \<'external_token'>
  - `token` \<object>
    - `idToken` \<string> - wepin firebase idToken
    - `refreshToken` ``<string>` - wepin firebase refreshToken

#### Exception

- [WepinLoginException](#WepinLoginException)

#### Example

```javascript
const user = await wepinLogin.loginWithAccessToken({
  provider: 'naver',
  token: 'eyJHGciO....adQssw5c',
  sign: '9753d4dc...c63466b9',
});
```

- response

```json
{
  "provider": "external_token",
  "token": {
    "idToken": "ab2231df....ad0f3291",
    "refreshToken": "eyJHGciO....adQssw5c"
  }
}
```

### getSignForLogin

Generates signatures to verify the issuer. It is mainly used to generate signatures for login-related information such as ID Tokens and Access Tokens.

```js
import { getSignForLogin } from '@wepin/login-js';
const result = getSignForLogin(privKey, message);
```

#### Parameters

- `privKey` \<string> - The authentication key used for signature generation.
- `message` \<string> - The message or payload to be signed.

#### Returns

- string - The generated signature.

> ‼️ Caution ‼️
>
> The authentication key (`privKey`) must be stored securely and must not be exposed to the outside. It is recommended to execute the `getSignForLogin()` method on the backend rather than the frontend for enhanced security and protection of sensitive information.[How to Implement Direct Signature Generation Functions](https://github.com/WepinWallet/wepin-web-sdk-v1/blob/main/packages/login/SignatureGenerationMethods.md#using-secp256k1-and-crypto-modules)

#### Example

```js
const privKey =
  '0400112233445566778899001122334455667788990011223344556677889900';
const idToken = 'idtokenabcdef';
const sign = getSignForLogin(privKey, idToken);

const res = await wepinLogin.loginWithIdToken({
  token: idToken,
  sign,
});
```

### getRefreshFirebaseToken

```javascript
await wepinLogin.getRefreshFirebaseToken();
```

This method retrieves the current firebase token's information from the Wepin.

#### Parameters

- void

#### Returns

- Promise\<LoginResult>
  - `provider` \<'external_token'>
  - `token` \<object>
    - `idToken` \<string> - wepin firebase idToken
    - `refreshToken` `<string> - wepin firebase refreshToken

#### Example

```javascript
const user = await wepinLogin.getRefreshFirebaseToken();
```

- response

```json
{
  "provider": "external_token",
  "token": {
    "idToken": "ab2231df....ad0f3291",
    "refreshToken": "eyJHGciO....adQssw5c"
  }
}
```

### loginWepin

```javascript
await wepinLogin.loginWepin({ provider, token });
```

This method logs the user into the Wepin application using the specified provider and token.

#### Parameters

The parameters should utilize the return values from the `loginWithOauthProvider()`, `loginWithEmailAndPassword()`, `loginWithIdToken()`, and `loginWithAccessToken()` methods within the this module.

- `provider` \<'google'|'apple'|'naver'|'discord'|'external_token'|'email'> - The login provider.
- `token` \<{idToken: string; refreshToken: string}> - The login tokens.

#### Returns

- Promise\<IWepinUser> - A promise that resolves to an object containing the user's login status and information. The object includes:
  - status \<'success'|'fail'> - The login status.
  - userInfo \<object> **optional** - The user's information, including:
    - userId \<string> - The user's ID.
    - email \<string> - The user's email.
    - provider \<'google'|'apple'|'naver'|'discord'|'email'|'external_token'> - The login provider.
    - use2FA \<boolean> - Whether the user uses two-factor authentication.
  - walletId \<string> = The user's wallet ID.
  - userStatus: \<object> - The user's status of wepin login. including:
    - loginStats: \<'complete' | 'pinRequired' | 'registerRequired'> - If the user's loginStatus value is not complete, it must be registered in the wepin.
    - pinRequired?: `<boolean>`
  - token: \<object> - The user's token of wepin.
    - accessToken: \<string>
    - refreshToken \<string>

#### Exception

- [WepinLoginException](#WepinLoginException)

#### Example

```javascript
const wepinLogin = WepinLogin({ appId: 'appId', appKey: 'appKey' });
const res = await wepinLogin.loginWithOauthProvider({ provider: 'google' });

const userInfo = await wepinLogin.loginWepin(res);
const userStatus = userInfo.userStatus;
if (
  userStatus.loginStatus === 'pinRequired' ||
  userStatus.loginStatus === 'registerRequired'
) {
  // wepin register
}
```

- response

```json
{
  "status": "success",
  "userInfo": {
    "userId": "120349034824234234",
    "email": "abc@gmail.com",
    "provider": "google",
    "use2FA": true
  },
  "userStatus": {
    "loginRequired": "completed",
    "pinRequired": false
  },
  "token": {
    "accessToken": "",
    "refreshToken": ""
  }
}
```

### getCurrentWepinUser

```javascript
await wepinLogin.getCurrentWepinUser();
```

This method retrieves the current logged-in user's information from the Wepin.

#### Parameters

- void

#### Returns

- Promise\<IWepinUser> - A promise that resolves to an object containing the user's login status and information. The object includes:
  - status \<'success'|'fail'> - The login status.
  - userInfo \<object> **optional** - The user's information, including:
    - userId \<string> - The user's ID.
    - email \<string> - The user's email.
    - provider \<'google'|'apple'|'naver'|'discord'|'email'|'external_token'> - The login provider.
    - use2FA \<boolean> - Whether the user uses two-factor authentication.
  - walletId \<string> = The user's wallet ID.
  - userStatus: \<object> - The user's status of wepin login. including:
    - loginStatus: \<'complete' | 'pinRequired' | 'registerRequired'> - If the user's loginStatus value is not complete, it must be registered in the wepin.
    - pinRequired?: <boolean>
  - token: \<object> - The user's token of wepin.
    - accessToken: \<string>
    - refreshToken \<string>

#### Example

```javascript
const userInfo = await wepinLogin.getCurrentWepinUser();
const userStatus = userInfo.userStatus;
if (
  userStatus.loginStatus === 'pinRequired' ||
  userStatus.loginStatus === 'registerRequired'
) {
  // wepin register
}
```

- response

```json
{
  "status": "success",
  "userInfo": {
    "userId": "120349034824234234",
    "email": "abc@gmail.com",
    "provider": "google",
    "use2FA": true
  },
  "walletId": "abcdsfsf123",
  "userStatus": {
    "loginRequired": "completed",
    "pinRequired": false
  },
  "token": {
    "accessToken": "",
    "refreshToken": ""
  }
}
```

### logout

```js
await wepinLogin.logout();
```

The `logout()` method logs out the user logged into Wepin.

#### Parameters

- void
-

#### Returns

- Promise\<boolean>
  - true if success

#### Exception

- [WepinLoginException](#WepinLoginException)

#### Example

```js
const result = await wepinLogin.logout();
```

### finalize

```js
await wepinLogin.finalize();
```

The `finalize()` method finalizes the Wepin Login Library.

#### Parameters

- void

#### Returns

- Promise\<void>

#### Example

```js
await wepinLogin.finalize();
```

### WepinLoginException

| Error Code                  | Error Message                     | Error Description                                                                                                                                                                                    |
| --------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INVALID_APP_KEY`           | "Invalid app key"                 | The Wepin app key is invalid.                                                                                                                                                                        |
| `INVALID_PARAMETER` `       | "Invalid parameter"               | One or more parameters provided are invalid or missing.                                                                                                                                              |
| `INVALID_LOGIN_PROVIDER`    | "Invalid login provider"          | The login provider specified is not supported or is invalid.                                                                                                                                         |
| `INVALID_TOKEN`             | "Token does not exist"            | The token does not exist.                                                                                                                                                                            |
| `INVALID_LOGIN_SESSION`     | "Invalid Login Session"           | The login session information does not exist.                                                                                                                                                        |
| `NOT_INITIALIZED_ERROR`     | "Not initialized error"           | The WepinLoginLibrary has not been properly initialized.                                                                                                                                             |
| `ALREADY_INITIALIZED_ERROR` | "Already initialized"             | The WepinLoginLibrary is already initialized, so the logout operation cannot be performed again.                                                                                                     |
| `NOT_ACTIVITY`              | "Context is not activity"         | The Context is not an activity                                                                                                                                                                       |
| `USER_CANCELLED`            | "User cancelled"                  | The user has cancelled the operation.                                                                                                                                                                |
| `UNKNOWN_ERROR`             | "An unknown error occurred"       | An unknown error has occurred, and the cause is not identified.                                                                                                                                      |
| `NOT_CONNECTED_INTERNET`    | "No internet connection"          | The system is unable to detect an active internet connection.                                                                                                                                        |
| `FAILED_LOGIN`              | "Failed to Oauth log in"          | The login attempt has failed due to incorrect credentials or other issues.                                                                                                                           |
| `ALREADY_LOGOUT`            | "Already Logout"                  | The user is already logged out, so the logout operation cannot be performed again.                                                                                                                   |
| `INVALID_EMAIL_DOMAIN`      | "Invalid email domain"            | The provided email address's domain is not allowed or recognized by the system.                                                                                                                      |
| `FAILED_SEND_EMAIL`         | "Failed to send email"            | The system encountered an error while sending an email. This is because the email address is invalid or we sent verification emails too often. Please change your email or try again after 1 minute. |
| `REQUIRED_EMAIL_VERIFIED`   | "Email verification required"     | Email verification is required to proceed with the requested operation.                                                                                                                              |
| `INCORRECT_EMAIL_FORM`      | "Incorrect email format"          | The provided email address does not match the expected format.                                                                                                                                       |
| `INCORRECT_PASSWORD_FORM`   | "Incorrect password format"       | The provided password does not meet the required format or criteria.                                                                                                                                 |
| `NOT_INITIALIZED_NETWORK`   | "Network Manager not initialized" | The network or connection required for the operation has not been properly initialized.                                                                                                              |
| `REQUIRED_SIGNUP_EMAIL`     | "Email sign-up required."         | The user needs to sign up with an email address to proceed.                                                                                                                                          |
| `FAILED_EMAIL_VERIFIED`     | "Failed to verify email."         | The WepinLoginLibrary encountered an issue while attempting to verify the provided email address.                                                                                                    |
| `FAILED_PASSWORD_SETTING`   | "Failed to set password."         | The WepinLoginLibrary failed to set the password.                                                                                                                                                    |
| `EXISTED_EMAIL`             | "Email already exists."           | The provided email address is already registered in Wepin.                                                                                                                                           |
