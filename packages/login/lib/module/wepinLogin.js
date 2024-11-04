import { getBundleId } from 'react-native-device-info';
import PackageJson from '../package.json';
import { Platform } from 'react-native';
import { WepinFetch, WepinPlatformType, isErrorResponse, isFirebaseErrorResponse } from '@wepin/fetch-js';
import { emailRegExp, passwordRegExp } from './const/regExp';
import { WEPIN_OAUTH_TOKEN_TYPE } from './const/config';
import { AppAuthConst } from './const/appAuthConst';
import { authorize } from './nativeModule/NativeModuleAppAuth';
import { checkAndVerifyEmail, signUpEmail } from './login/singupEmail';
import { checkExistFirebaseLoginSession, checkExistWepinLoginSession, getLoginUserStorage } from './login/loginWepin';
import { WepinStorageManager } from './storage/WepinStorageManager';
import { WepinLoginError, WepinLoginErrorCode } from './error/WepinError';
import { getModeByAppKey, getUrlsByMode } from '@wepin/common';
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
    this.storageManager = new WepinStorageManager(Platform.OS, appId);
    this._wepinFetch = new WepinFetch({
      appId: this.wepinAppId,
      appKey: this.wepinAppKey,
      domain: this.wepinDomain,
      sdk: {
        version: this.version,
        type: `react-login`
      },
      storage: this.storageManager.wepinStorage
    });
    this.appEmailVerified = true;
    console.log(`Wepin React Native LoginLibrary v${this.version} Initialized`);
  }
  toJSON() {
    return '';
  }

  /**
   * Initialize WepinLogin Object. It returns widget instance.
   */
  async init() {
    if (this._isInitialized) {
      throw new WepinLoginError(WepinLoginErrorCode.AlraadyInitialized);
    }
    this._isInitialized = false;
    await this._wepinFetch.init();
    const appInfo = await this._wepinFetch.wepinApi.app.getAppInfo({
      platform: WepinPlatformType[this.storageManager.platform],
      withNetwork: false
    });
    if (isErrorResponse(appInfo)) {
      throw new WepinLoginError(WepinLoginErrorCode.InvalidAppKey, appInfo.message);
    }
    this.appEmailVerified = appInfo.appInfo.property.emailVerify;
    this.wepinAppId = this._wepinFetch.appId = this.storageManager.appId = appInfo.appInfo.id;
    this._isInitialized = true;
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
    this._isInitialized = false;
    this.storageManager.clearAllLocalStorage(false);
  }
  async initCookieData(withClear) {
    const localData = await this.storageManager.getAllLocalStorage();
    if (withClear && localData) {
      await this.storageManager.clearAllLocalStorage(true);
    }
    return localData;
  }
  async loginWithOauthProvider(params) {
    if (!this._isInitialized) throw new WepinLoginError(WepinLoginErrorCode.NotInitialized);
    await this.initCookieData(true);
    // const state = uuidv4(); // 랜덤한 state 값 생성
    const authEndpoint = AppAuthConst.getAuthorizationEndpoint(params.provider);
    const tokenEndpoint = AppAuthConst.getTokenEndpoint(params.provider);
    const additionalParameters = {
      prompt: 'select_account'
      // state,
    };
    if (params.provider === 'apple') {
      additionalParameters.response_mode = 'form_post';
    }
    const url = getUrlsByMode(getModeByAppKey(this.wepinAppKey)).sdkBackend;
    const config = {
      serviceConfiguration: {
        authorizationEndpoint: authEndpoint,
        tokenEndpoint: tokenEndpoint
      },
      clientId: params.clientId,
      redirectUrl: `${url}/user/oauth/callback?uri=${encodeURIComponent(`wepin.${this.wepinAppId}:/oauth2redirect`)}`,
      scopes: params.provider === 'discord' ? ['identify', 'email'] : ['email'],
      additionalParameters,
      // usePKCE: true,
      // clientAuthMethod: params.provider === 'apple' ? 'post' : 'basic',
      skipCodeExchange: params.provider !== 'discord',
      iosPrefersEphemeralSession: true,
      wepinAppId: this.wepinAppId
    };
    const result = await authorize(config);
    result.authorizationCode;
    if (params.provider === 'discord') {
      const response = {
        provider: params.provider,
        token: result.accessToken,
        type: WEPIN_OAUTH_TOKEN_TYPE[1]
      };
      return response;
    }
    const tokenRes = await this._wepinFetch.wepinApi.user.OAuthTokenRequest({
      provider: params.provider
    }, {
      code: result.authorizationCode,
      state: result.state,
      codeVerifier: result.codeVerifier,
      redirectUri: config.redirectUrl,
      clientId: params.clientId
    });
    if (isErrorResponse(tokenRes)) {
      throw new WepinLoginError(WepinLoginErrorCode.ApiRequestError, tokenRes.message);
    }
    const response = {
      provider: params.provider,
      token: params.provider === 'naver' ? tokenRes.access_token : tokenRes.id_token,
      type: params.provider === 'naver' ? WEPIN_OAUTH_TOKEN_TYPE[1] : WEPIN_OAUTH_TOKEN_TYPE[0]
    };
    return response;
  }
  async signUpWithEmailAndPassword(email, password, locale) {
    if (!this._isInitialized) throw new WepinLoginError(WepinLoginErrorCode.NotInitialized);
    if (email) {
      if (!emailRegExp.test(email)) {
        throw new WepinLoginError(WepinLoginErrorCode.IncorrectEmailForm);
      }
    }
    await this.initCookieData(true);
    const {
      oobReset,
      oobVerify
    } = await checkAndVerifyEmail({
      email: email.trim(),
      locale: locale,
      isRequireVerified: this.appEmailVerified,
      wepinFetch: this._wepinFetch
    });
    if (password) {
      if (!passwordRegExp.test(password)) {
        throw new WepinLoginError(WepinLoginErrorCode.IncorrectPasswordForm);
      }
    }
    await signUpEmail({
      oobReset: oobReset,
      oobVerify: oobVerify,
      email: email.trim(),
      password,
      wepinFetch: this._wepinFetch
    });
    return await this.loginWithEmailAndResetPasswordState(email, password);
  }
  async changePassword(email, password, token) {
    let isPasswordResetRequired;
    const resPwState = await this._wepinFetch.wepinApi.user.getUserPasswordState({
      email: email.trim()
    });
    if (isErrorResponse(resPwState)) {
      if (resPwState.statusCode !== 400 || !resPwState.message.includes('not exist')) {
        throw new WepinLoginError(WepinLoginErrorCode.FailedPasswordSetting, resPwState.message);
      }
      isPasswordResetRequired = true;
    } else isPasswordResetRequired = resPwState.isPasswordResetRequired;
    if (!isPasswordResetRequired) return token;
    const res = await this._wepinFetch.wepinApi.user.login({
      idToken: token.idToken
    });
    if (isErrorResponse(res)) {
      throw new WepinLoginError(WepinLoginErrorCode.FailedLogin, res.message);
    }
    const resUpdatePW = await this._wepinFetch.wepinFirebaseApi.updatePassword(token.idToken, password);
    if (isFirebaseErrorResponse(resUpdatePW)) {
      var _resUpdatePW$error;
      throw new WepinLoginError(WepinLoginErrorCode.FailedPasswordSetting, (_resUpdatePW$error = resUpdatePW.error) === null || _resUpdatePW$error === void 0 ? void 0 : _resUpdatePW$error.message);
    }
    await this._wepinFetch.setToken({
      accessToken: res.token.access,
      refreshToken: res.token.refresh
    });
    const resResetPwState = await this._wepinFetch.wepinApi.user.updateUserPasswordState({
      userId: res.userInfo.userId
    }, {
      isPasswordResetRequired: false
    });
    if (isErrorResponse(resResetPwState)) {
      throw new WepinLoginError(WepinLoginErrorCode.FailedPasswordStateSetting, resResetPwState === null || resResetPwState === void 0 ? void 0 : resResetPwState.message);
    }
    await this._wepinFetch.wepinApi.user.logout({
      userId: res.userInfo.userId
    });
    await this._wepinFetch.setToken(undefined);
    return {
      idToken: resUpdatePW.idToken,
      refreshToken: resUpdatePW.refreshToken
    };
  }
  async loginWithEmailAndResetPasswordState(email, password) {
    await this.initCookieData(true);
    let isPasswordResetRequired = false;
    const resPwState = await this._wepinFetch.wepinApi.user.getUserPasswordState({
      email: email.trim()
    });
    if (isErrorResponse(resPwState)) {
      if (resPwState.statusCode !== 400 || !resPwState.message.includes('not exist')) {
        throw new WepinLoginError(WepinLoginErrorCode.ApiRequestError, resPwState.message);
      }
      isPasswordResetRequired = true;
    } else isPasswordResetRequired = resPwState.isPasswordResetRequired;
    const {
      idToken,
      refreshToken
    } = await this._wepinFetch.wepinFirebaseApi.signInWithEmailPassword(email.trim(), password, !isPasswordResetRequired);
    const token = await this.changePassword(email, password, {
      idToken,
      refreshToken
    });
    await this.storageManager.setLocalStorage('firebase:wepin', {
      idToken: token.idToken,
      refreshToken: token.refreshToken,
      provider: 'email'
    });
    return {
      provider: 'email',
      token: {
        idToken: token.idToken,
        refreshToken: token.refreshToken
      }
    };
  }
  async loginWithEmailAndPassword(email, password) {
    if (!this._isInitialized) throw new WepinLoginError(WepinLoginErrorCode.NotInitialized);
    if (email) {
      if (!emailRegExp.test(email)) {
        throw new WepinLoginError(WepinLoginErrorCode.IncorrectEmailForm);
      }
    }
    if (password) {
      if (!passwordRegExp.test(password)) {
        throw new WepinLoginError(WepinLoginErrorCode.IncorrectPasswordForm);
      }
    }
    const checkEmailExist = await this._wepinFetch.wepinApi.user.checkEmailExist({
      email
    });
    if (isErrorResponse(checkEmailExist)) {
      throw new WepinLoginError(WepinLoginErrorCode.ApiRequestError, checkEmailExist.message);
    }
    const {
      isEmailExist,
      isEmailverified,
      providerIds
    } = checkEmailExist;

    // 계정이 있는 경우
    if (isEmailExist && isEmailverified && providerIds.includes('password')) {
      return await this.loginWithEmailAndResetPasswordState(email, password);
    } else {
      throw new WepinLoginError(WepinLoginErrorCode.RequiredSignupEmail);
    }
  }
  async doFirebaseLoginWithCustomToken(customToken, provider) {
    const {
      idToken,
      refreshToken
    } = await this._wepinFetch.wepinFirebaseApi.signInWithCustomToken(customToken);
    await this.storageManager.setLocalStorage('firebase:wepin', {
      idToken,
      refreshToken,
      provider
    });
    return {
      provider,
      token: {
        idToken,
        refreshToken
      }
    };
  }
  async loginWithIdToken(params) {
    if (!this._isInitialized) throw new WepinLoginError(WepinLoginErrorCode.NotInitialized);
    await this.initCookieData(true);
    const res = await this._wepinFetch.wepinApi.user.loginOAuthIdToken({
      idToken: params.token,
      sign: params.sign
    });
    if (isErrorResponse(res)) {
      throw new WepinLoginError(WepinLoginErrorCode.ApiRequestError, res.message);
    }
    return await this.doFirebaseLoginWithCustomToken(res.token, 'external_token');
  }
  async loginWithAccessToken(params) {
    if (!this._isInitialized) throw new WepinLoginError(WepinLoginErrorCode.NotInitialized);
    await this.initCookieData(true);
    const res = await this._wepinFetch.wepinApi.user.loginOAuthAccessToken({
      provider: params.provider,
      accessToken: params.token,
      sign: params.sign
    });
    if (isErrorResponse(res)) {
      throw new WepinLoginError(WepinLoginErrorCode.ApiRequestError, res.message);
    }
    return await this.doFirebaseLoginWithCustomToken(res.token, 'external_token');
  }
  async getRefreshFirebaseToken() {
    if (!this._isInitialized) {
      throw new WepinLoginError(WepinLoginErrorCode.NotInitialized);
    }
    if (await checkExistFirebaseLoginSession(this._wepinFetch, this.storageManager)) {
      const token = await this.storageManager.getLocalStorage('firebase:wepin');
      return {
        provider: token.provider,
        token: {
          idToken: token.idToken,
          refreshToken: token.refreshToken
        }
      };
    } else {
      throw new WepinLoginError(WepinLoginErrorCode.InvalidLoginSession);
    }
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
    if (!this._isInitialized) {
      throw new WepinLoginError(WepinLoginErrorCode.NotInitialized);
    }
    if (!(param !== null && param !== void 0 && param.token.idToken) || !(param !== null && param !== void 0 && param.token.refreshToken)) {
      throw new WepinLoginError(WepinLoginErrorCode.InvalidParameters, 'idToken and refreshToken are required');
    }
    const res = await this._wepinFetch.wepinApi.user.login({
      idToken: param === null || param === void 0 ? void 0 : param.token.idToken
    });
    if (isErrorResponse(res)) {
      throw new WepinLoginError(WepinLoginErrorCode.FailedLogin, res.message);
    }
    const data = await this.storageManager.setLoginUserLocalStorage(param, res);
    // this._userInfo = data.userInfo
    await this._wepinFetch.setToken(data.connectUser);
    const userStatus = await this.storageManager.getLocalStorage('user_status');
    const walletId = await this.storageManager.getLocalStorage('wallet_id');
    if ((userStatus === null || userStatus === void 0 ? void 0 : userStatus.loginStatus) === 'pinRequired') userStatus.pinRequired = true;

    // if (res.loginStatus !== 'complete') {
    //   throw new Error('Wepin.loginWepin: registerRequired')
    // }
    return Object.assign(data.userInfo, {
      walletId,
      userStatus,
      token: data.connectUser
    });
  }
  async getCurrentWepinUser() {
    if (!this._isInitialized) {
      throw new WepinLoginError(WepinLoginErrorCode.NotInitialized);
    }
    if (!(await checkExistWepinLoginSession(this._wepinFetch, this.storageManager))) {
      throw new WepinLoginError(WepinLoginErrorCode.InvalidLoginSession);
    }
    const wepinUser = await getLoginUserStorage(this.storageManager);
    if (!wepinUser) {
      throw new WepinLoginError(WepinLoginErrorCode.InvalidLoginSession);
    }
    return wepinUser;
  }
  async logoutWepin() {
    if (!this._isInitialized) throw new WepinLoginError(WepinLoginErrorCode.NotInitialized);
    if (await this.initCookieData(true)) return true;
    throw new WepinLoginError(WepinLoginErrorCode.AlreadyLogout);
  }
}
//# sourceMappingURL=wepinLogin.js.map