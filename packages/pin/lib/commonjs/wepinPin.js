"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WepinPin = void 0;
var _reactNativeDeviceInfo = require("react-native-device-info");
var _package = _interopRequireDefault(require("../package.json"));
var _NativeModuleWepinPin = require("./nativeModule/NativeModuleWepinPin");
var _WepinError = require("./error/WepinError");
var _wepinLogin = require("./login/wepinLogin");
var _common = require("@wepin/common");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import type { IWepinUser, providerType } from '@wepin/common';

/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
class WepinPin {
  constructor({
    appId,
    appKey
  }) {
    this._isInitialized = false;
    this.wepinAppId = appId;
    this.wepinAppKey = appKey;
    this.wepinDomain = (0, _reactNativeDeviceInfo.getBundleId)();
    this.version = _package.default.version;
    (0, _NativeModuleWepinPin.createWepinPin)(appId, appKey);
    console.log(`Wepin React Native Widget Pin v${this.version} Initialized`);
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
      throw new _WepinError.WepinPinError(_WepinError.WepinPinErrorCode.InvalidAppKey);
    }
    const result = await (0, _NativeModuleWepinPin.initialize)(attributes.defaultLanguage ?? _common.WEPIN_DEFAULT_LANG, attributes.defaultCurrency ?? _common.WEPIN_DEFAULT_CURRENCY);
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
    await (0, _NativeModuleWepinPin.finalize)();
    this._isInitialized = false;
  }
  async generateRegistrationPINBlock() {
    return await (0, _NativeModuleWepinPin.generateRegistrationPINBlock)();
  }
  async generateAuthPINBlock(count) {
    return await (0, _NativeModuleWepinPin.generateAuthPINBlock)(count);
  }
  async generateChangePINBlock() {
    return await (0, _NativeModuleWepinPin.generateChangePINBlock)();
  }
  async generateAuthOTPCode() {
    return await (0, _NativeModuleWepinPin.generateAuthOTPCode)();
  }
  async changeLanguage({
    language
  }) {
    await (0, _NativeModuleWepinPin.changeLanguage)(language);
  }
}
exports.WepinPin = WepinPin;
//# sourceMappingURL=wepinPin.js.map