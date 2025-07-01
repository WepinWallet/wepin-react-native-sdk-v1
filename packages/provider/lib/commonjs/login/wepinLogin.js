"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WepinLogin = void 0;
var _NativeModuleWepinProvider = require("../nativeModule/NativeModuleWepinProvider");
class WepinLogin {
  constructor() {}
  async loginWithOauthProvider(params) {
    return await (0, _NativeModuleWepinProvider.loginWithOauthProvider)(params);
  }
  async signUpWithEmailAndPassword(email, password, locale) {
    return await (0, _NativeModuleWepinProvider.signUpWithEmailAndPassword)(email, password, locale);
  }
  async loginWithEmailAndPassword(email, password) {
    return await (0, _NativeModuleWepinProvider.loginWithEmailAndPassword)(email, password);
  }
  async loginWithIdToken(params) {
    return await (0, _NativeModuleWepinProvider.loginWithIdToken)(params);
  }
  async loginWithAccessToken(params) {
    return await (0, _NativeModuleWepinProvider.loginWithAccessToken)(params);
  }
  async getRefreshFirebaseToken(prevToken) {
    return await (0, _NativeModuleWepinProvider.getRefreshFirebaseToken)(prevToken);
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
    return await (0, _NativeModuleWepinProvider.loginWepin)(param);
  }
  async getCurrentWepinUser() {
    return await (0, _NativeModuleWepinProvider.getCurrentWepinUser)();
  }
  async logoutWepin() {
    return await (0, _NativeModuleWepinProvider.logout)();
  }
}
exports.WepinLogin = WepinLogin;
//# sourceMappingURL=wepinLogin.js.map