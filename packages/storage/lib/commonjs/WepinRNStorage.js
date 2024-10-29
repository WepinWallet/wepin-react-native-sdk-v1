"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _NativeModuleWepinStorage = require("./nativeModule/NativeModuleWepinStorage");
var _reactNative = require("react-native");
/* eslint-disable dot-notation */

class WepinRNStorage {
  static #COOKIE_NAME = 'wepin:auth:';
  static #ALL_APP_IDS_KEY = 'wepin:allAppIds';
  constructor() {
    this.platform = _reactNative.Platform.OS === 'ios' ? 'ios' : 'android';
  }
  getLocalStorageEnabled() {
    throw new Error('Method not implemented.');
  }

  /// @name addAppId
  /// @description add app id
  async addAppId(appId) {
    const appIds = await this.getAllAppIds();
    if (!appIds.includes(appId)) {
      appIds.push(appId);
      await (0, _NativeModuleWepinStorage.setItem)(WepinRNStorage.#ALL_APP_IDS_KEY, JSON.stringify(appIds));
    }
  }

  /// @name getAllAppIds
  /// @description get all app ids
  async getAllAppIds() {
    const appIds = await (0, _NativeModuleWepinStorage.getItem)(WepinRNStorage.#ALL_APP_IDS_KEY);
    return appIds ? JSON.parse(appIds) : [];
  }

  /// @name getAllData
  /// @description get all appId data
  async getAllData() {
    const appIds = await this.getAllAppIds();
    const allData = {};
    for (const appId of appIds) {
      const data = await this.getAllLocalStorage(appId);
      if (data) {
        allData[appId] = data;
      }
    }
    return allData;
  }

  /// @name clearAllAppIds
  /// @description clear all app ids
  async clearAllAppIds() {
    await (0, _NativeModuleWepinStorage.removeItem)(WepinRNStorage.#ALL_APP_IDS_KEY);
  }
  async setAllLocalStorage(appId, value) {
    const data = JSON.stringify(value);
    await this.addAppId(appId);
    await (0, _NativeModuleWepinStorage.setItem)(WepinRNStorage.#COOKIE_NAME + appId, data);
  }
  async setLocalStorage(appId, name, value) {
    await this.addAppId(appId);
    const localData = await this.getAllLocalStorage(appId);
    if (localData) {
      localData[name] = value;
      await this.setAllLocalStorage(appId, localData);
      return;
    }
    const newData = {
      [name]: value
    };
    await (0, _NativeModuleWepinStorage.setItem)(WepinRNStorage.#COOKIE_NAME + appId, JSON.stringify(newData));
  }
  async getLocalStorage(appId, name) {
    const localData = await this.getAllLocalStorage(appId);
    try {
      if (localData) {
        return JSON.parse(localData[name]);
      }
    } catch (e) {
      if (localData) {
        return localData[name];
      }
    }
    return;
  }
  async getAllLocalStorage(appId) {
    const storage = await (0, _NativeModuleWepinStorage.getItem)(WepinRNStorage.#COOKIE_NAME + appId);
    const data = storage ? JSON.parse(storage) : undefined;
    return data;
  }
  async clearLocalStorage(appId, name) {
    const data = await this.getLocalStorage(appId, name);
    if (data) {
      const localData = await this.getAllLocalStorage(appId);
      if (!localData) return;
      delete localData[name];
      await this.setAllLocalStorage(appId, localData);
    }
  }
  async clearAllLocalStorage(appId) {
    await (0, _NativeModuleWepinStorage.removeItem)(WepinRNStorage.#COOKIE_NAME + appId);
    const appIds = await this.getAllAppIds();
    const index = appIds.indexOf(appId);
    if (index !== -1) {
      appIds.splice(index, 1);
      await (0, _NativeModuleWepinStorage.setItem)(WepinRNStorage.#ALL_APP_IDS_KEY, JSON.stringify(appIds));
    }
  }
  async clearAllAppIdsData() {
    const appIds = await this.getAllAppIds();
    for (const id of appIds) {
      await (0, _NativeModuleWepinStorage.removeItem)(WepinRNStorage.#COOKIE_NAME + id);
    }
    await this.clearAllAppIds();
  }
  async setLoginUserLocalStorage(appId, request, response) {
    await this.addAppId(appId);
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