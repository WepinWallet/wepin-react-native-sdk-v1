"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUpWithEmailAndPassword = exports.logout = exports.loginWithOauthProvider = exports.loginWithIdToken = exports.loginWithEmailAndPassword = exports.loginWithAccessToken = exports.loginWepin = exports.isInitialize = exports.initialize = exports.getRefreshFirebaseToken = exports.getCurrentWepinUser = exports.finalize = exports.createWepinLogin = void 0;
var _reactNative = require("react-native");
var _WepinError = require("../error/WepinError");
var _log = _interopRequireDefault(require("../utils/log"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const LINKING_ERROR = `The package '@wepin/login-rn' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const LoginRn = _reactNative.NativeModules.LoginRn ? _reactNative.NativeModules.LoginRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});

// 네이티브 에러를 WepinLoginError로 변환하는 헬퍼 함수
function convertNativeError(error) {
  // error.code가 WepinLoginErrorCode 열거형에 있는지 확인
  if (error.code && Object.values(_WepinError.WepinLoginErrorCode).includes(error.code)) {
    return new _WepinError.WepinLoginError(error.code, error.message);
  }

  // 알려진 에러 코드가 아니거나 에러 코드가 없는 경우
  return new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.UnknownError, error.message || error.toString() || 'Unknown native error occurred');
}
const createWepinLogin = (appId, appKey) => {
  try {
    LoginRn.createWepinLogin(appId, appKey);
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.createWepinLogin = createWepinLogin;
const initialize = async () => {
  try {
    return await LoginRn.initialize();
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.initialize = initialize;
const isInitialize = async () => {
  try {
    return await LoginRn.isInitialized();
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.isInitialize = isInitialize;
const loginWithOauthProvider = async params => {
  try {
    _log.default.debug('loginWithOauthProvider', params);
    return await LoginRn.loginWithOauthProvider(params.provider, params.clientId);
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.loginWithOauthProvider = loginWithOauthProvider;
const signUpWithEmailAndPassword = async (email, password, locale) => {
  try {
    return await LoginRn.signUpWithEmailAndPassword(email, password, locale);
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.signUpWithEmailAndPassword = signUpWithEmailAndPassword;
const loginWithEmailAndPassword = async (email, password) => {
  try {
    return await LoginRn.loginWithEmailAndPassword(email, password);
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
const loginWithIdToken = async params => {
  try {
    return await LoginRn.loginWithIdToken(params.token);
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.loginWithIdToken = loginWithIdToken;
const loginWithAccessToken = async params => {
  try {
    return await LoginRn.loginWithAccessToken(params.provider, params.token);
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.loginWithAccessToken = loginWithAccessToken;
const getRefreshFirebaseToken = async prevToken => {
  try {
    return await LoginRn.getRefreshFirebaseToken(prevToken);
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.getRefreshFirebaseToken = getRefreshFirebaseToken;
const getCurrentWepinUser = async () => {
  try {
    return await LoginRn.getCurrentWepinUser();
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.getCurrentWepinUser = getCurrentWepinUser;
const loginWepin = async param => {
  try {
    return await LoginRn.loginWepin(param);
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.loginWepin = loginWepin;
const logout = async () => {
  try {
    return await LoginRn.logout();
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.logout = logout;
const finalize = async () => {
  try {
    return await LoginRn.finalize();
  } catch (error) {
    throw convertNativeError(error);
  }
};
exports.finalize = finalize;
//# sourceMappingURL=NativeModuleWepinLogin.js.map