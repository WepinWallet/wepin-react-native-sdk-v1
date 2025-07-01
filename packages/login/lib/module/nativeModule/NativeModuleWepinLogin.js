import { NativeModules, Platform } from 'react-native';
import { WepinLoginError, WepinLoginErrorCode } from '../error/WepinError';
import LOG from '../utils/log';
const LINKING_ERROR = `The package '@wepin/login-rn' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const LoginRn = NativeModules.LoginRn ? NativeModules.LoginRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});

// 네이티브 에러를 WepinLoginError로 변환하는 헬퍼 함수
function convertNativeError(error) {
  // error.code가 WepinLoginErrorCode 열거형에 있는지 확인
  if (error.code && Object.values(WepinLoginErrorCode).includes(error.code)) {
    return new WepinLoginError(error.code, error.message);
  }

  // 알려진 에러 코드가 아니거나 에러 코드가 없는 경우
  return new WepinLoginError(WepinLoginErrorCode.UnknownError, error.message || error.toString() || 'Unknown native error occurred');
}
export const createWepinLogin = (appId, appKey) => {
  try {
    LoginRn.createWepinLogin(appId, appKey);
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const initialize = async () => {
  try {
    return await LoginRn.initialize();
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const isInitialize = async () => {
  try {
    return await LoginRn.isInitialized();
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const loginWithOauthProvider = async params => {
  try {
    LOG.debug('loginWithOauthProvider', params);
    return await LoginRn.loginWithOauthProvider(params.provider, params.clientId);
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const signUpWithEmailAndPassword = async (email, password, locale) => {
  try {
    return await LoginRn.signUpWithEmailAndPassword(email, password, locale);
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    return await LoginRn.loginWithEmailAndPassword(email, password);
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const loginWithIdToken = async params => {
  try {
    return await LoginRn.loginWithIdToken(params.token);
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const loginWithAccessToken = async params => {
  try {
    return await LoginRn.loginWithAccessToken(params.provider, params.token);
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const getRefreshFirebaseToken = async prevToken => {
  try {
    return await LoginRn.getRefreshFirebaseToken(prevToken);
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const getCurrentWepinUser = async () => {
  try {
    return await LoginRn.getCurrentWepinUser();
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const loginWepin = async param => {
  try {
    return await LoginRn.loginWepin(param);
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const logout = async () => {
  try {
    return await LoginRn.logout();
  } catch (error) {
    throw convertNativeError(error);
  }
};
export const finalize = async () => {
  try {
    return await LoginRn.finalize();
  } catch (error) {
    throw convertNativeError(error);
  }
};
//# sourceMappingURL=NativeModuleWepinLogin.js.map