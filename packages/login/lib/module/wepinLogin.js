import { getBundleId } from 'react-native-device-info';
import PackageJson from '../package.json';
import { createWepinLogin, initialize, getCurrentWepinUser, getRefreshFirebaseToken, loginWithOauthProvider, loginWithIdToken, loginWithAccessToken, loginWithEmailAndPassword, loginWepin, signUpWithEmailAndPassword, logout as logoutWepin, finalize } from './nativeModule/NativeModuleWepinLogin';
import { WepinLoginError, WepinLoginErrorCode } from './error/WepinError';
/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
export class WepinLogin {
  constructor({
    appId,
    appKey
  }) {
    this._isInitialized = false;
    this.wepinAppId = appId;
    this.wepinAppKey = appKey;
    this.wepinDomain = getBundleId();
    this.version = PackageJson.version;
    this.appEmailVerified = true;
    createWepinLogin(appId, appKey);
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
      throw new WepinLoginError(WepinLoginErrorCode.InvalidAppKey);
    }
    const result = await initialize();
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
      await finalize();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      this._isInitialized = false;
    }
  }
  async loginWithOauthProvider(params) {
    return await loginWithOauthProvider(params);
  }
  async signUpWithEmailAndPassword(email, password, locale) {
    return await signUpWithEmailAndPassword(email, password, locale);
  }
  async loginWithEmailAndPassword(email, password) {
    return await loginWithEmailAndPassword(email, password);
  }
  async loginWithIdToken(params) {
    return await loginWithIdToken(params);
  }
  async loginWithAccessToken(params) {
    return await loginWithAccessToken(params);
  }
  async getRefreshFirebaseToken(prevToken) {
    return await getRefreshFirebaseToken(prevToken);
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
    return await loginWepin(param);
  }
  async getCurrentWepinUser() {
    return await getCurrentWepinUser();
  }
  async logoutWepin() {
    return await logoutWepin();
  }
}
//# sourceMappingURL=wepinLogin.js.map