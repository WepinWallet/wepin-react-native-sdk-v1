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

# @wepin/sdk-rn

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/WepinWallet/wepin-react-native-sdk-v1/blob/main/LICENSE)

[![npm version](https://img.shields.io/npm/v/@wepin/sdk-rn?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/@wepin/sdk-rn) [![npm downloads](https://img.shields.io/npm/dt/@wepin/sdk-rn.svg?label=downloads&style=for-the-badge)](https://www.npmjs.com/package/@wepin/sdk-rn)

[![platform - android](https://img.shields.io/badge/platform-Android-3ddc84.svg?logo=android&style=for-the-badge)](https://www.android.com/) [![platform - ios](https://img.shields.io/badge/platform-iOS-000.svg?logo=apple&style=for-the-badge)](https://developer.apple.com/ios/)

Wepin Widget SDK for React Native. This package is exclusively available for use in React Native environments (Android and iOS).

## ⏩ Get App ID and Key

After signing up for [Wepin Workspace](https://workspace.wepin.io/), go to the development tools menu and enter the information for each app platform to receive your App ID and App Key.

## ⏩ Requirements

- Android API version 24 or newer is required.
- iOS version 13 or newer is required.

## ⏩ Install

```sh
npm install @wepin/sdk-rn
```

or

```sh
yarn add @wepin/sdk-rn
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
import WepinWidgetSDK from '@wepin/sdk-rn';
```

## ⏩ Initialize

```js
const wepinWidget = new WepinWidgetSDK({
  appId: 'wepinAppId',
  appKey: 'wepinAppKey',
});
```

### init

```js
await wepinWidget.init();
```

#### Parameters

- `attributes` \<IWepinSDKAttributes> **optional**
  - `defaultLanguage`: - `defaultLanguage`: The language to be displayed on the widget (default: `'en'`)
    Currently, only `ko`, `en`, and `ja` are supported.
  - `defaultCurrency`: The currency to be displayed on the widget (default: `'USD'`)
    Currently, only `'KRW'`,`'USD'` and `'JPY'` are supported.

#### Example

```js
await wepinWidget.init();
```

### isInitialized

```js
wepinWidget.isInitialized();
```

The `isInitialized()` method checks if the Wepin Widget SDK is initialized.

#### Returns

- \<boolean>
  - true if Wepin Widget SDK is already initialized.

### changeLanguage

```js
await wepinWidget.changeLanguage({ language, currency });
```

Change widget language, currency

#### Parameters

- \<object>
  - `language`: The language to be displayed on the widget (default: `'en'`)
    Currently, only `ko`, `en`, and `ja` are supported.
  - `currency`: The currency to be displayed on the widget (default: `'USD'`)
    Currently, only `'KRW'`,`'USD'` and `'JPY'` are supported.

## ⏩ Method

Methods can be used after initialization of Wepin Widget SDK.

### getStatus

```js
await wepinWidget.getStatus();
```

Returns lifecycle of wepin.

#### Parameters

- void

#### Returns

- Promise\<WepinLifeCycle>
  - The lifecycle of the wepin is defined as follows.
    - `'not_initialized'`: if wepin is not initialized
    - `'initializing'`: if wepin is initializing
    - `'initialized'`: if wepin is initialized
    - `'before_login'`: if wepin is initialized but the user is not logged in
    - `'login'`: if the user is logged in
    - `'login_before_register'`: if the user is logged in but the user is NOT registered in wepin

#### Example

```javascript
const status = await wepinWidget.getStatus();
```

### openWidget

```javascript
await wepinWidget.openWidget();
```

The `openWidget()` method displays the Wepin widget. If a user is not logged in, the widget will not open. Therefore, you must log in to Wepin before using this method. To log in to Wepin, use the `loginWithUI` method or the login methods from the `login` variable.

#### Parameters

- void

#### Returns

- Promise \<boolean>

#### Example

```javascript
await wepinWidget.openWidget();
```

### closeWidget

```javascript
await wepinWidget.closeWidget();
```

The `closeWidget()` method closes Wepin widget.

#### Parameters

- void

#### Returns

- Promise \<boolean>

#### Example

```javascript
await wepinWidget.closeWidget();
```

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
const oauthResult = await wepinWidget.login.loginWithOauthProvider({
  provider: 'google',
  clientId: 'your-client-id',
});

// Sign up and log in using email and password
const signUpResult = await wepinWidget.login.signUpWithEmailAndPassword(
  'example@example.com',
  'password123'
);

// Log in using an ID token
const idTokenResult = await wepinWidget.login.loginWithIdToken({
  token: 'your-id-token',
  sign: 'your-sign',
});

// Log in to Wepin
const wepinLoginResult = await wepinWidget.login.loginWepin(idTokenResult);

// Get the currently logged-in user
const currentUser = await wepinWidget.login.getCurrentWepinUser();

// Logout
await wepinWidget.login.logout();
```

### loginWithUI

```javascript
await wepinWidget.loginWithUI(loginProviders, email?)
```

The `loginWithUI()` method provides the functionality to log in using a widget and returns the information of the logged-in user. If a user is already logged in, the widget will not be displayed, and the method will directly return the logged-in user's information.

> [!CAUTION]
> This method can only be used after the authentication key has been deleted from the [Wepin Workspace](https://workspace.wepin.io/).
> (Wepin Workspace > Development Tools menu > Login tab > Auth Key > Delete)
>
> > - The Auth Key menu is visible only if an authentication key was previously generated.

#### Parameters

- `providers` \<{provider: string, clientId: string}[]> - An array of login providers to configure the widget. If an empty array is provided, only the email login function is available.
  - `provider` \<string> - The OAuth login provider (e.g., 'google', 'naver', 'discord', 'apple').
  - `clientId` \<string> - The client ID of the OAuth login provider.
- `email` \<string> **optional** - The email parameter allows users to log in using the specified email address when logging in through the widget.

#### Returns

- Promise\<WepinUser>
  - `status` \<'success'|'fail'>
  - `userInfo` \<object> **optional**
    - `userId` \<string> - Wepin User ID
    - `email` \<string> - Wepin User Email Address
    - `provider` \<'google'|'apple'|'naver'|'discord'|'email'|'external_token'>
    - `use2FA` \<boolean>
  - `userStatus`: \<object> - The user's status of wepin login. including:
    - `loginStatus`: \<'complete' | 'pinRequired' | 'registerRequired'> - If the user's loginStatus value is not complete, it must be registered in the wepin.
    - `pinRequired`?: <boolean>
  - `walletId` \<string> **optional**
  - `token`: \<object> - The user's token of wepin. including:
    - `accessToken`: \<string> - The access token.
    - `refreshToken`: \<string> - The refresh token.

#### Exception

- [WepinError](#WepinError)

#### Example

```javascript
// google, apple, discord, naver login
const loginProviders = [
  { provider: 'google', clientId: 'google-client-id' },
  { provider: 'apple', clientId: 'apple-client-id' },
  { provider: 'discord', clientId: 'discord-client-id' },
  { provider: 'naver', clientId: 'naver-client-id' },
];

const userInfo = await wepinWidget.loginWithUI(loginProviders);

// only email login
const userInfo = await wepinWidget.loginWithUI([]);

// with specified email address
const userInfo = await wepinWidget.loginWithUI([], 'abc@abc.com');
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
    "loginStatus": "complete",
    "pinRequired": false
  },
  "walletId": "abcdsfsf123",
  "token": {
    "accessToken": "",
    "refreshToken": ""
  }
}
```

### register

```javascript
await wepinWidget.register();
```

Register the user with Wepin. After joining and logging in, the Register page of the Wepin widget opens and registers (wipe and account creation) the Wepin service. Available only if the life cycle of the WepinSDK is `login_before_register`. After calling the `loginWepin()` method in the `login` variable, if the loginStatus value in the userStatus is not 'complete', this method must be called.

#### Parameters

- void

#### Returns

- Promise\<WepinUser>
  - `status` \<'success'|'fail'>
  - `userInfo` \<object> **optional**
    - `userId` \<string> - Wepin User ID
    - `email` \<string> - Wepin User Email Address
    - `provider` \<'google'|'apple'|'naver'|'discord'|'email'|'external_token'>
    - `use2FA` \<boolean>
  - `userStatus`: \<object> - The user's status of wepin login. including:
    - `loginStatus`: \<'complete' | 'pinRequired' | 'registerRequired'> - If the user's loginStatus value is not complete, it must be registered in the wepin.
    - `pinRequired`?: <boolean>
  - `walletId` \<string> **optional**
  - `token`: \<object> - The user's token of wepin. including:
    - `accessToken`: \<string> - The access token.
    - `refreshToken`: \<string> - The refresh token.

#### Example

```javascript
const userInfo = await wepinWidget.register();
```

### getAccounts

```javascript
await wepinWidget.getAccounts(options?)
```

The `getAccounts()` method returns user accounts. It is recommended to use `getAccounts()` method without argument to get all user accounts. It can be only usable after widget login.

#### Parameters

- `options` \<object>
  - `networks`: \<string[]> **optional** A list of network names to filter the accounts.
  - `withEoa`: \<boolean> **optional** If AA accounts are included, whether to include EOA accounts

#### Returns

- Promise \<WepinAccount[]> - A promise that resolves to an array of the user's accounts.
  - `address` \<string>
  - `network` \<string>
  - `contract` \<string> **optional** token contract address.
  - `isAA` \<boolean> **optional** Whether it is aa account or not

#### Example

```javascript
const result = await wepinWidget.getAccounts({
  networks: ['ETHEREUM'],
  withEoa: true,
});
```

- response

```json
[
  {
    "address": "0x0000001111112222223333334444445555556666",
    "network": "ETHEREUM"
  },
  {
    "address": "0x0000001111112222223333334444445555556666",
    "network": "ETHEREUM",
    "contract": "0x777777888888999999000000111111222222333333"
  },
  {
    "address": "0x4444445555556666000000111111222222333333",
    "network": "ETHEREUM",
    "isAA": true
  }
]
```

### getBalance

```javascript
await wepinWidget.getBalance(accounts?)
```

It returns the account's balance information. It can be only usable after widget login. It use `getBalance()` method without argument to get all user accounts.

#### Parameters

- `accounts` \<WepinAccount[]> **optional**
  - `network` \<string>
  - `address` \<string>
  - `contract` \<string> **optional** token contract address.
  - `isAA` \<boolean> **optional** Whether it is aa account or not

#### Returns

- Promise \<WepinAccountBalanceInfo[]>
  - `network` \<string>
  - `address` \<string>
  - `symbol` \<string> - symbol of account
  - `balance` \<string> - balance of account
  - `tokens` \<WepinTokenBalanceInfo[]> - token balance information for account
    - `symbol` \<string> - token symbol
    - `balance` \<string> - token balance
    - `contract` \<string> - token contract address

#### Example

```javascript
const result = await wepinWidget.getBalance([
  {
    address: '0x0000001111112222223333334444445555556666',
    network: 'Ethereum',
  },
]);
```

- response

```json
[
  {
    "network": "Ethereum",
    "address": "0x0000001111112222223333334444445555556666",
    "symbol": "ETH",
    "balance": "1.1",
    "tokens": [
      {
        "contract": "0x123...213",
        "symbol": "TEST",
        "balance": "10"
      }
    ]
  }
]
```

### getNFTs

```javascript
await wepinWidget.getNFTs({refresh, networks?})
```

The `getNFTs()` method returns user NFTs. It is recommended to use this method without the networks argument to get all user NFTs. This method can only be used after the widget is logged in.

#### Parameters

- `options` \<object>
  - `refresh` \<boolean> - A required parameter to indicate whether to refresh the NFT data.
  - `networks` \<string[]> **optional** - A list of network names to filter the NFTs.

#### Returns

- Promise \<WepinNFT[]> - A promise that resolves to an array of the user's NFTs.
  - `account` \<WepinAccount>
    - `address` \<string> - The address of the account associated with the NFT.
    - `network` \<string> - The network associated with the NFT.
    - `contract` \<string> **optional** The token contract address.
    - `isAA` \<boolean> **optional** Indicates whether the account is an AA (Account Abstraction) account.
  - `contract` \<WepinNFTContract>
    - `name` \<string> - The name of the NFT contract.
    - `address` \<string> - The contract address of the NFT.
    - `scheme` \<string> - The scheme of the NFT.
    - `description` \<string> **optional** - A description of the NFT contract.
    - `network` \<string> - The network associated with the NFT contract.
    - `externalLink` \<string> **optional** - An external link associated with the NFT contract.
    - `imageUrl` \<string> **optional** - An image URL associated with the NFT contract.
  - `name` \<string> - The name of the NFT.
  - `description` \<string> - A description of the NFT.
  - `externalLink` \<string> - An external link associated with the NFT.
  - `imageUrl` \<string> - An image URL associated with the NFT.
  - `contentUrl` \<string> **optional** - A URL pointing to the content associated with the NFT.
  - `quantity` \<number> - The quantity of the NFT.
  - `contentType` \<string> - The content type of the NFT.
  - `state` \<number> - The state of the NFT.

#### Example

```javascript
const result = await wepinWidget.getNFTs({ refresh: false });
```

- response

```json
[
  {
    "account": {
      "address": "0x0000001111112222223333334444445555556666",
      "network": "Ethereum",
      "contract": "0x777777888888999999000000111111222222333333",
      "isAA": true
    },
    "contract": {
      "name": "NFT Collection",
      "address": "0x777777888888999999000000111111222222333333",
      "scheme": "ERC721",
      "description": "An example NFT collection",
      "network": "Ethereum",
      "externalLink": "https://example.com",
      "imageUrl": "https://example.com/image.png"
    },
    "name": "Sample NFT",
    "description": "A sample NFT description",
    "externalLink": "https://example.com/nft",
    "imageUrl": "https://example.com/nft-image.png",
    "contentUrl": "https://example.com/nft-content.png",
    "quantity": 1,
    "contentType": "image/png",
    "state": 0
  }
]
```

### send

```javascript
await wepinWidget.send({account, txData?})
```

It returns the sent transaction id information. It can be only usable after widget login.

#### Parameters

- `account` \<Account>
  - `network` \<string>
  - `address` \<string>
  - `contract` \<string> **optional** token contract address.
- `txData` \<object> **optional**
  - `toAddress` \<string>
  - `amount` \<string>

#### Returns

- Promise \<object>
  - `txId` \<string>

#### Example

```javascript
const result = await wepinWidget.send({
  account: {
    address: '0x0000001111112222223333334444445555556666',
    network: 'Ethereum',
  },
  txData: {
    toAddress: '0x9999991111112222223333334444445555556666',
    amount: '0.1',
  },
});
```

- response

```json
{
  "txId": "0x76bafd4b700ed959999d08ab76f95d7b6ab2249c0446921c62a6336a70b84f32"
}
```

### receive

```javascript
await wepinWidget.receive(account);
```

The `receive` method opens the account information page associated with the specified account. This method can only be used after logging into Wepin.

#### Parameters

- `account` \<WepinAccount> - Provides the account information for the page that will be opened.
  - `network` \<string> - The network associated with the account.
  - `address` \<string> - The address of the account.
  - `contract` \<string> **optional** The contract address of the token.

#### Returns

- Promise \<object> - A promise that resolves to a `WepinReceiveResponse` object containing the information about the opened account.
  - `account` \<WepinAccount> - The account information of the page that was opened.
    - `network` \<string> - The network associated with the account.
    - `address` \<string> - The address of the account.
    - `contract` \<string> **optional** The contract address of the token.

#### Example

```javascript
// Opening an account page
const result = await wepinWidget.receive({
  address: '0x0000001111112222223333334444445555556666',
  network: 'Ethereum',
});

// Opening a token page
const result = await wepinWidget.receive({
  address: '0x0000001111112222223333334444445555556666',
  network: 'Ethereum',
  contract: '0x9999991111112222223333334444445555556666',
});
```

- response

```json
{
  "account": {
    "address": "0x0000001111112222223333334444445555556666",
    "network": "Ethereum",
    "contract": "0x9999991111112222223333334444445555556666"
  }
}
```

### finalize

```javascript
await wepinWidget.finalize();
```

The `finalize()` method finalizes the Wepin SDK.

#### Parameters

- void

#### Returns

- Promise\<void>

#### Example

```javascript
await wepinWidget.finalize();
```

### WepinError

This section provides descriptions of various error codes that may be encountered while using the Wepin SDK functionalities. Each error code corresponds to a specific issue, and understanding these can help in debugging and handling errors effectively.

| Error Code                   | Description                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `ApiRequestError`            | There was an error while making the API request.                                          |
| `InvalidParameters`          | One or more parameters provided are invalid or missing.                                   |
| `NotInitialized`             | The Wepin SDK has not been properly initialized.                                          |
| `InvalidAppKey`              | The Wepin app key is invalid.                                                             |
| `InvalidLoginProvider`       | The login provider specified is not supported or is invalid.                              |
| `InvalidToken`               | The token does not exist.                                                                 |
| `InvalidLoginSession`        | The login session information does not exist.                                             |
| `UserCancelled`              | The user has cancelled the operation.                                                     |
| `UnknownError`               | An unknown error has occurred, and the cause is not identified.                           |
| `NotConnectedInternet`       | The system is unable to detect an active internet connection.                             |
| `FailedLogin`                | The login attempt has failed due to incorrect credentials or other issues.                |
| `AlreadyLogout`              | The user is already logged out, so the logout operation cannot be performed again.        |
| `AlreadyInitialized`         | The Wepin SDK is already initialized.                                                     |
| `InvalidEmailDomain`         | The provided email address's domain is not allowed or recognized by the system.           |
| `FailedSendEmail`            | The system encountered an error while sending an email.                                   |
| `RequiredEmailVerified`      | Email verification is required to proceed with the requested operation.                   |
| `IncorrectEmailForm`         | The provided email address does not match the expected format.                            |
| `IncorrectPasswordForm`      | The provided password does not meet the required format or criteria.                      |
| `NotInitializedNetwork`      | The network or connection required for the operation has not been properly initialized.   |
| `RequiredSignupEmail`        | The user needs to sign up with an email address to proceed.                               |
| `FailedEmailVerified`        | The Wepin SDK encountered an issue while attempting to verify the provided email address. |
| `FailedPasswordStateSetting` | Failed to set the password state.                                                         |
| `FailedPasswordSetting`      | The Wepin SDK failed to set the password.                                                 |
| `ExistedEmail`               | The provided email address is already registered in Wepin.                                |
| `NotActivity`                | The Context is not an activity.                                                           |
