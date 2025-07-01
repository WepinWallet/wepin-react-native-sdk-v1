"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WepinWidgetSDK = void 0;
var _reactNativeDeviceInfo = require("react-native-device-info");
var _package = _interopRequireDefault(require("../package.json"));
var _NativeModuleWepinSDK = require("./nativeModule/NativeModuleWepinSDK");
var _WepinError = require("./error/WepinError");
var _wepinLogin = require("./login/wepinLogin");
var _common = require("@wepin/common");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import type { IWepinUser, providerType } from '@wepin/common';

/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
class WepinWidgetSDK {
  constructor({
    appId,
    appKey
  }) {
    this._isInitialized = false;
    this.wepinAppId = appId;
    this.wepinAppKey = appKey;
    this.wepinDomain = (0, _reactNativeDeviceInfo.getBundleId)();
    this.version = _package.default.version;
    (0, _NativeModuleWepinSDK.createWepinWidget)(appId, appKey);
    console.log(`Wepin React Native Widget SDK v${this.version} Initialized`);
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
      throw new _WepinError.WepinSdkError(_WepinError.WepinSdkErrorCode.InvalidAppKey);
    }
    const result = await (0, _NativeModuleWepinSDK.initialize)(attributes.defaultLanguage ?? _common.WEPIN_DEFAULT_LANG, attributes.defaultCurrency ?? _common.WEPIN_DEFAULT_CURRENCY);
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

  /**
   * Finalize Wepin Object.
   */
  async finalize() {
    try {
      await (0, _NativeModuleWepinSDK.finalize)();
    } catch (error) {
      console.log('finalize error', error);
    } finally {
      this._isInitialized = false;
    }
  }
  async loginWithUI(providers, email) {
    return await (0, _NativeModuleWepinSDK.loginWithUI)(providers, email);
  }
  async changeLanguage({
    language,
    currency
  }) {
    await (0, _NativeModuleWepinSDK.changeLanguage)(language, currency);
  }
  async openWidget() {
    return await (0, _NativeModuleWepinSDK.openWidget)();
  }
  async closeWidget() {
    return await (0, _NativeModuleWepinSDK.closeWidget)();
  }
  async register() {
    return await (0, _NativeModuleWepinSDK.register)();
  }
  async getAccounts(options) {
    const accounts = await (0, _NativeModuleWepinSDK.getAccounts)(options === null || options === void 0 ? void 0 : options.networks, options === null || options === void 0 ? void 0 : options.withEoa);
    return accounts;
  }
  async getBalance(accounts) {
    return await (0, _NativeModuleWepinSDK.getBalance)(accounts);
  }
  async getNFTs(options) {
    return await (0, _NativeModuleWepinSDK.getNFTs)((options === null || options === void 0 ? void 0 : options.refresh) ?? false, options === null || options === void 0 ? void 0 : options.networks);
  }
  async send({
    account,
    txData
  }) {
    return await (0, _NativeModuleWepinSDK.send)(account, txData);
  }
  async receive(account) {
    return await (0, _NativeModuleWepinSDK.receive)(account);
  }
  async getStatus() {
    return await (0, _NativeModuleWepinSDK.getStatus)();
  }
}
exports.WepinWidgetSDK = WepinWidgetSDK;
//# sourceMappingURL=wepinSDK.js.map