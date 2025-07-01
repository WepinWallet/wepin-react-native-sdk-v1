"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WepinLogin = void 0;
var _reactNativeDeviceInfo = require("react-native-device-info");
var _package = _interopRequireDefault(require("../package.json"));
var _NativeModuleWepinLogin = require("./nativeModule/NativeModuleWepinLogin");
var _WepinError = require("./error/WepinError");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
class WepinLogin {
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
    (0, _NativeModuleWepinLogin.createWepinLogin)(appId, appKey);
    console.log(`Wepin React Native LoginLibrary v${this.version} Initialized`);
  }
  toJSON() {
    return '';
  }

  /**
   * Initialize WepinLogin Object. It returns widget instance.
   */
  async init() {
    if (!this.wepinAppId || !this.wepinAppKey) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.InvalidAppKey);
    }
    const result = await (0, _NativeModuleWepinLogin.initialize)();
    this._isInitialized = result;
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
      await (0, _NativeModuleWepinLogin.finalize)();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      this._isInitialized = false;
    }
  }
  async loginWithOauthProvider(params) {
    return await (0, _NativeModuleWepinLogin.loginWithOauthProvider)(params);
  }
  async signUpWithEmailAndPassword(email, password, locale) {
    return await (0, _NativeModuleWepinLogin.signUpWithEmailAndPassword)(email, password, locale);
  }
  async loginWithEmailAndPassword(email, password) {
    return await (0, _NativeModuleWepinLogin.loginWithEmailAndPassword)(email, password);
  }
  async loginWithIdToken(params) {
    return await (0, _NativeModuleWepinLogin.loginWithIdToken)(params);
  }
  async loginWithAccessToken(params) {
    return await (0, _NativeModuleWepinLogin.loginWithAccessToken)(params);
  }
  async getRefreshFirebaseToken(prevToken) {
    return await (0, _NativeModuleWepinLogin.getRefreshFirebaseToken)(prevToken);
  }

  /**
   * Returns the user's login information.
   * This method with the same as `loginWithUI()`, but it doesn't show the widget.
   *
   * This method must be used in conjunction with the `@wepin/login-js` module.
   * Additionally, the parameters for this method should utilize the return values from the `loginWithOauthProvider()`, `loginWithEmailAndPassword()`, `loginWithIdToken()`, and `loginWithAccessToken()` methods within the `@wepin/login-js` module.
   * @param provider 'email'|'apple'|'google'|'discord'|'naver'|'external_token'
   * @param token  `{idToken: string, refreshToken: string}`. this value is response of `@wepin/login-js`
   * @returns {Promise<IWepinUser>}
   * @example
   * ```typescript
   * import { WepinLogin } from '@wepin/login-js'
   * const wepinLogin = WepinLogin({ appId: 'appId', appKey: 'appKey' })
   * const res = await wepinLogin.loginWithOauthProvider({ provider: 'google' })
   * wepinLogin.loginWepin(res).then((userInfo) => {
   * console.log(userInfo)
   * })
   **/
  async loginWepin(param) {
    return await (0, _NativeModuleWepinLogin.loginWepin)(param);
  }
  async getCurrentWepinUser() {
    return await (0, _NativeModuleWepinLogin.getCurrentWepinUser)();
  }
  async logoutWepin() {
    return await (0, _NativeModuleWepinLogin.logout)();
  }
}
exports.WepinLogin = WepinLogin;
//# sourceMappingURL=wepinLogin.js.map