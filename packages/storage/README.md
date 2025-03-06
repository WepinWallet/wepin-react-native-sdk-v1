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

# @wepin/storage-rn

[![mit licence](https://img.shields.io/dub/l/vibe-d.svg?style=for-the-badge)](https://github.com/WepinWallet/wepin-react-native-sdk-v1/blob/main/LICENSE)

[![npm version](https://img.shields.io/npm/v/@wepin/storage-rn?logo=npm&style=for-the-badge)](https://www.npmjs.org/package/@wepin/storage-rn) [![npm downloads](https://img.shields.io/npm/dt/@wepin/storage-rn.svg?label=downloads&style=for-the-badge)](https://www.npmjs.org/package/@wepin/storage-rn)

[![platform - android](https://img.shields.io/badge/platform-Android-3ddc84.svg?logo=android&style=for-the-badge)](https://www.android.com/) [![platform - ios](https://img.shields.io/badge/platform-iOS-000.svg?logo=apple&style=for-the-badge)](https://developer.apple.com/ios/)

Wepin Storage package from React Native. This package is exclusively available for use in android and ios environments.

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
npm install @wepin/storage-rn
```

or

```sh
yarn add @wepin/storage-rn
```

### peerDependencies

```bash
npm install react-native-encrypted-storage


# for ios
cd ios
pod install
```

or

```bash
yarn add react-native-encrypted-storage

# for ios
cd ios
pod install
```
