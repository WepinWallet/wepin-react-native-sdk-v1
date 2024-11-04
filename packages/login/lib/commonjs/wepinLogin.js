"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WepinLogin = void 0;
var _reactNativeDeviceInfo = require("react-native-device-info");
var _package = _interopRequireDefault(require("../package.json"));
var _reactNative = require("react-native");
var _fetchJs = require("@wepin/fetch-js");
var _regExp = require("./const/regExp");
var _config = require("./const/config");
var _appAuthConst = require("./const/appAuthConst");
var _NativeModuleAppAuth = require("./nativeModule/NativeModuleAppAuth");
var _singupEmail = require("./login/singupEmail");
var _loginWepin = require("./login/loginWepin");
var _WepinStorageManager = require("./storage/WepinStorageManager");
var _WepinError = require("./error/WepinError");
var _common = require("@wepin/common");
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
    this.storageManager = new _WepinStorageManager.WepinStorageManager(_reactNative.Platform.OS, appId);
    this._wepinFetch = new _fetchJs.WepinFetch({
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
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.AlraadyInitialized);
    }
    this._isInitialized = false;
    await this._wepinFetch.init();
    const appInfo = await this._wepinFetch.wepinApi.app.getAppInfo({
      platform: _fetchJs.WepinPlatformType[this.storageManager.platform],
      withNetwork: false
    });
    if ((0, _fetchJs.isErrorResponse)(appInfo)) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.InvalidAppKey, appInfo.message);
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
    if (!this._isInitialized) throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.NotInitialized);
    await this.initCookieData(true);
    // const state = uuidv4(); // 랜덤한 state 값 생성
    const authEndpoint = _appAuthConst.AppAuthConst.getAuthorizationEndpoint(params.provider);
    const tokenEndpoint = _appAuthConst.AppAuthConst.getTokenEndpoint(params.provider);
    const additionalParameters = {
      prompt: 'select_account'
      // state,
    };
    if (params.provider === 'apple') {
      additionalParameters.response_mode = 'form_post';
    }
    const url = (0, _common.getUrlsByMode)((0, _common.getModeByAppKey)(this.wepinAppKey)).sdkBackend;
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
    const result = await (0, _NativeModuleAppAuth.authorize)(config);
    result.authorizationCode;
    if (params.provider === 'discord') {
      const response = {
        provider: params.provider,
        token: result.accessToken,
        type: _config.WEPIN_OAUTH_TOKEN_TYPE[1]
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
    if ((0, _fetchJs.isErrorResponse)(tokenRes)) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.ApiRequestError, tokenRes.message);
    }
    const response = {
      provider: params.provider,
      token: params.provider === 'naver' ? tokenRes.access_token : tokenRes.id_token,
      type: params.provider === 'naver' ? _config.WEPIN_OAUTH_TOKEN_TYPE[1] : _config.WEPIN_OAUTH_TOKEN_TYPE[0]
    };
    return response;
  }
  async signUpWithEmailAndPassword(email, password, locale) {
    if (!this._isInitialized) throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.NotInitialized);
    if (email) {
      if (!_regExp.emailRegExp.test(email)) {
        throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.IncorrectEmailForm);
      }
    }
    await this.initCookieData(true);
    const {
      oobReset,
      oobVerify
    } = await (0, _singupEmail.checkAndVerifyEmail)({
      email: email.trim(),
      locale: locale,
      isRequireVerified: this.appEmailVerified,
      wepinFetch: this._wepinFetch
    });
    if (password) {
      if (!_regExp.passwordRegExp.test(password)) {
        throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.IncorrectPasswordForm);
      }
    }
    await (0, _singupEmail.signUpEmail)({
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
    if ((0, _fetchJs.isErrorResponse)(resPwState)) {
      if (resPwState.statusCode !== 400 || !resPwState.message.includes('not exist')) {
        throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.FailedPasswordSetting, resPwState.message);
      }
      isPasswordResetRequired = true;
    } else isPasswordResetRequired = resPwState.isPasswordResetRequired;
    if (!isPasswordResetRequired) return token;
    const res = await this._wepinFetch.wepinApi.user.login({
      idToken: token.idToken
    });
    if ((0, _fetchJs.isErrorResponse)(res)) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.FailedLogin, res.message);
    }
    const resUpdatePW = await this._wepinFetch.wepinFirebaseApi.updatePassword(token.idToken, password);
    if ((0, _fetchJs.isFirebaseErrorResponse)(resUpdatePW)) {
      var _resUpdatePW$error;
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.FailedPasswordSetting, (_resUpdatePW$error = resUpdatePW.error) === null || _resUpdatePW$error === void 0 ? void 0 : _resUpdatePW$error.message);
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
    if ((0, _fetchJs.isErrorResponse)(resResetPwState)) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.FailedPasswordStateSetting, resResetPwState === null || resResetPwState === void 0 ? void 0 : resResetPwState.message);
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
    if ((0, _fetchJs.isErrorResponse)(resPwState)) {
      if (resPwState.statusCode !== 400 || !resPwState.message.includes('not exist')) {
        throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.ApiRequestError, resPwState.message);
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
    if (!this._isInitialized) throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.NotInitialized);
    if (email) {
      if (!_regExp.emailRegExp.test(email)) {
        throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.IncorrectEmailForm);
      }
    }
    if (password) {
      if (!_regExp.passwordRegExp.test(password)) {
        throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.IncorrectPasswordForm);
      }
    }
    const checkEmailExist = await this._wepinFetch.wepinApi.user.checkEmailExist({
      email
    });
    if ((0, _fetchJs.isErrorResponse)(checkEmailExist)) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.ApiRequestError, checkEmailExist.message);
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
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.RequiredSignupEmail);
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
    if (!this._isInitialized) throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.NotInitialized);
    await this.initCookieData(true);
    const res = await this._wepinFetch.wepinApi.user.loginOAuthIdToken({
      idToken: params.token,
      sign: params.sign
    });
    if ((0, _fetchJs.isErrorResponse)(res)) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.ApiRequestError, res.message);
    }
    return await this.doFirebaseLoginWithCustomToken(res.token, 'external_token');
  }
  async loginWithAccessToken(params) {
    if (!this._isInitialized) throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.NotInitialized);
    await this.initCookieData(true);
    const res = await this._wepinFetch.wepinApi.user.loginOAuthAccessToken({
      provider: params.provider,
      accessToken: params.token,
      sign: params.sign
    });
    if ((0, _fetchJs.isErrorResponse)(res)) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.ApiRequestError, res.message);
    }
    return await this.doFirebaseLoginWithCustomToken(res.token, 'external_token');
  }
  async getRefreshFirebaseToken() {
    if (!this._isInitialized) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.NotInitialized);
    }
    if (await (0, _loginWepin.checkExistFirebaseLoginSession)(this._wepinFetch, this.storageManager)) {
      const token = await this.storageManager.getLocalStorage('firebase:wepin');
      return {
        provider: token.provider,
        token: {
          idToken: token.idToken,
          refreshToken: token.refreshToken
        }
      };
    } else {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.InvalidLoginSession);
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
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.NotInitialized);
    }
    if (!(param !== null && param !== void 0 && param.token.idToken) || !(param !== null && param !== void 0 && param.token.refreshToken)) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.InvalidParameters, 'idToken and refreshToken are required');
    }
    const res = await this._wepinFetch.wepinApi.user.login({
      idToken: param === null || param === void 0 ? void 0 : param.token.idToken
    });
    if ((0, _fetchJs.isErrorResponse)(res)) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.FailedLogin, res.message);
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
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.NotInitialized);
    }
    if (!(await (0, _loginWepin.checkExistWepinLoginSession)(this._wepinFetch, this.storageManager))) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.InvalidLoginSession);
    }
    const wepinUser = await (0, _loginWepin.getLoginUserStorage)(this.storageManager);
    if (!wepinUser) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.InvalidLoginSession);
    }
    return wepinUser;
  }
  async logoutWepin() {
    if (!this._isInitialized) throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.NotInitialized);
    if (await this.initCookieData(true)) return true;
    throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.AlreadyLogout);
  }
}
exports.WepinLogin = WepinLogin;
//# sourceMappingURL=wepinLogin.js.map