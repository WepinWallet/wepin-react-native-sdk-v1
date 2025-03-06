"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NativeModuleWepinStorage = require("./nativeModule/NativeModuleWepinStorage");
var _reactNative = require("react-native");
/* eslint-disable dot-notation */

class WepinRNStorage {
  // static #COOKIE_NAME = 'wepin:auth:';
  // static #ALL_APP_IDS_KEY = 'wepin:allAppIds';

  constructor(appId) {
    this.platform = _reactNative.Platform.OS === 'ios' ? 'ios' : 'android';
    (0, _NativeModuleWepinStorage.initializeStorage)(appId);
  }
  getLocalStorageEnabled() {
    throw new Error('Method not implemented.');
  }

  /// @name addAppId
  /// @description add app id
  // private async addAppId(appId: string): Promise<void> {
  //   const appIds = await this.getAllAppIds();
  //   if (!appIds.includes(appId)) {
  //     appIds.push(appId);
  //     await setItem(WepinRNStorage.#ALL_APP_IDS_KEY, JSON.stringify(appIds));
  //   }
  // }

  /// @name getAllAppIds
  /// @description get all app ids
  // private async getAllAppIds(): Promise<string[]> {
  //   const appIds = await getItem(WepinRNStorage.#ALL_APP_IDS_KEY);
  //   return appIds ? JSON.parse(appIds) : [];
  // }

  /// @name getAllData
  /// @description get all appId data
  // public async getAllData(): Promise<Record<string, LocalStorageType>> {
  // const appIds = await this.getAllAppIds();
  // const allData: Record<string, LocalStorageType> = {};
  // for (const appId of appIds) {
  //   const data = await this.getAllLocalStorage(appId);
  //   if (data) {
  //     allData[appId] = data;
  //   }
  // }
  // return allData;
  //   return getAllItems();
  // }

  /// @name clearAllAppIds
  /// @description clear all app ids
  // public async clearAllAppIds(): Promise<void> {
  //   await removeItem(WepinRNStorage.#ALL_APP_IDS_KEY);
  // }
  async setAllLocalStorage(appId, data) {
    const saveData = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, JSON.stringify(value)]));
    await (0, _NativeModuleWepinStorage.setAllItems)(appId, saveData);
  }
  async setLocalStorage(appId, name, value) {
    const localData = await this.getAllLocalStorage(appId);
    if (localData) {
      localData[name] = value;
      await this.setAllLocalStorage(appId, localData);
      return;
    }
    // const newData = { [name]: value };
    await (0, _NativeModuleWepinStorage.setItem)(appId, name, JSON.stringify(value));
  }
  async getLocalStorage(appId, name) {
    const localData = await (0, _NativeModuleWepinStorage.getItem)(appId, name);
    try {
      if (localData) {
        return JSON.parse(localData);
      }
    } catch (e) {
      return localData;
    }
    return;
  }
  async getAllLocalStorage(appId) {
    const storage = await (0, _NativeModuleWepinStorage.getAllItems)(appId);
    try {
      return Object.fromEntries(Object.entries(storage).map(([key, value]) => {
        try {
          return [key, JSON.parse(value)];
        } catch (e) {
          return [key, value];
        }
      }));
    } catch (e) {
      return;
    }
  }
  async clearLocalStorage(appId, name) {
    await (0, _NativeModuleWepinStorage.removeItem)(appId, name);
  }
  async clearAllLocalStorage(appId) {
    await (0, _NativeModuleWepinStorage.clear)(appId);
  }

  // public async clearAllAppIdsData(): Promise<void> {
  //   const appIds = await this.getAllAppIds();
  //   for (const id of appIds) {
  //     await removeItem(WepinRNStorage.#COOKIE_NAME + id);
  //   }
  //   await this.clearAllAppIds();
  // }

  async setLoginUserLocalStorage(appId, request, response) {
    // await this.addAppId(appId);
    const localData = {};
    localData['firebase:wepin'] = Object.assign({
      provider: request === null || request === void 0 ? void 0 : request.provider
    }, request === null || request === void 0 ? void 0 : request.token);
    localData['wepin:connectUser'] = {
      accessToken: response.token.access,
      refreshToken: response.token.refresh
    };
    localData['user_id'] = response.userInfo.userId;
    localData['user_info'] = {
      status: 'success',
      userInfo: {
        userId: response.userInfo.userId,
        email: response.userInfo.email,
        provider: request.provider,
        use2FA: response.userInfo.use2FA >= 2
      }
    };
    localData['user_status'] = {
      loginStatus: response.loginStatus,
      pinRequired: response.loginStatus === 'registerRequired' ? response.pinRequired : false
    };
    if (response.loginStatus !== 'pinRequired' && response.walletId) {
      localData['wallet_id'] = response.walletId;
      localData['user_info'].walletId = response.walletId;
    }
    localData['oauth_provider_pending'] = request.provider;
    this.setAllLocalStorage(appId, localData);
    return {
      userInfo: localData['user_info'],
      connectUser: localData['wepin:connectUser']
    };
  }
}
exports.default = WepinRNStorage;
//# sourceMappingURL=WepinRNStorage.js.map