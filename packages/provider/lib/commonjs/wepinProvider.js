"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WepinProvider = void 0;
var _reactNativeDeviceInfo = require("react-native-device-info");
var _package = _interopRequireDefault(require("../package.json"));
var _NativeModuleWepinProvider = require("./nativeModule/NativeModuleWepinProvider");
var _WepinError = require("./error/WepinError");
var _wepinLogin = require("./login/wepinLogin");
var _common = require("@wepin/common");
var _UniversalProvider = require("./provider/UniversalProvider");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import type {
//   LoginOauthResult,
//   LoginResult,
//   ILoginAccessTokenParams,
//   ILoginIdTokenParams,
//   ILoginOauth2Params,
// } from './types';

// import { ProviderFactory } from './provider/ProviderFactory';

// import type { IWepinUser, providerType } from '@wepin/common';

/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
class WepinProvider {
  constructor({
    appId,
    appKey
  }) {
    this._isInitialized = false;
    this.wepinAppId = appId;
    this.wepinAppKey = appKey;
    this.wepinDomain = (0, _reactNativeDeviceInfo.getBundleId)();
    this.version = _package.default.version;
    this.appEmailVerified = true;
    (0, _NativeModuleWepinProvider.createWepinProvider)(appId, appKey);
    console.log(`Wepin React Native Provider SDK v${this.version} Initialized`);
  }
  toJSON() {
    return '';
  }

  /**
   * Initialize WepinLogin Object. It returns widget instance.
   */
  async init(attributes = {
    type: 'hide',
    defaultLanguage: _common.WEPIN_DEFAULT_LANG,
    defaultCurrency: _common.WEPIN_DEFAULT_CURRENCY
  }) {
    if (!this.wepinAppId || !this.wepinAppKey) {
      throw new _WepinError.WepinProviderError(_WepinError.WepinProviderErrorCode.InvalidAppKey);
    }
    const result = await (0, _NativeModuleWepinProvider.initialize)(attributes.defaultLanguage ?? _common.WEPIN_DEFAULT_LANG, attributes.defaultCurrency ?? _common.WEPIN_DEFAULT_CURRENCY);
    if (result) {
      this.login = new _wepinLogin.WepinLogin();
      this._isInitialized = true;
    }
    return this._isInitialized;
  }

  /**
   * Check if wepin is initialized.
   *
   * @returns
   */
  isInitialized() {
    return this._isInitialized;
  }
  async changeLanguage({
    language,
    currency
  }) {
    await (0, _NativeModuleWepinProvider.changeLanguage)(language, currency);
  }
  async getProvider(network) {
    if (!this._isInitialized) {
      throw new _WepinError.WepinProviderError(_WepinError.WepinProviderErrorCode.NotInitialized);
    }
    try {
      // UniversalProvider 생성 및 초기화
      const provider = new _UniversalProvider.UniversalProvider(network);
      await provider.initialize(); // 내부에서 ProviderRn.getProvider 호출

      return provider;
    } catch (error) {
      console.error(`WepinProvider.getProvider error:`, error);
      throw error;
    }
  }

  /**
   * Finalize Wepin Object.
   */
  async finalize() {
    await (0, _NativeModuleWepinProvider.finalize)();
    this._isInitialized = false;
  }
}
exports.WepinProvider = WepinProvider;
//# sourceMappingURL=wepinProvider.js.map