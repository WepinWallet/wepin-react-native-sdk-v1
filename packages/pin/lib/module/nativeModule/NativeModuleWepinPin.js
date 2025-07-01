import { NativeModules, Platform } from 'react-native';
import LOG from '../utils/log';
const LINKING_ERROR = `The package '@wepin/pin-rn' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const PinRn = NativeModules.PinRn ? NativeModules.PinRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
export const createWepinPin = (appId, appKey) => {
  PinRn.createWepinPin(appId, appKey);
};
export const initialize = async (defaultLanguage, defaultCurrency) => {
  return await PinRn.initialize(defaultLanguage, defaultCurrency);
};
export const isInitialize = async () => {
  return PinRn.isInitialized();
};

///////////////////////WepinLogin///////////////////////////////////////////////////

export const loginWithOauthProvider = async params => {
  LOG.debug('loginWithOauthProvider', params);
  return await PinRn.loginWithOauthProvider(params.provider, params.clientId);
};
export const signUpWithEmailAndPassword = async (email, password, locale) => {
  return await PinRn.signUpWithEmailAndPassword(email, password, locale);
};
export const loginWithEmailAndPassword = async (email, password) => {
  return PinRn.loginWithEmailAndPassword(email, password);
};
export const loginWithIdToken = async params => {
  return PinRn.loginWithIdToken(params.token);
};
export const loginWithAccessToken = async params => {
  return PinRn.loginWithAccessToken(params.provider, params.token);
};
export const getRefreshFirebaseToken = async prevToken => {
  return PinRn.getRefreshFirebaseToken(prevToken);
};
export const getCurrentWepinUser = async () => {
  return PinRn.getCurrentWepinUser();
};
export const loginWepin = async param => {
  return PinRn.loginWepin(param);
};
export const logout = async () => {
  return PinRn.logout();
};
/////////////////////////////////////////////////////////////////////////////

export const generateRegistrationPINBlock = async () => {
  return PinRn.generateRegistrationPINBlock();
};
export const generateAuthPINBlock = async count => {
  const pinCount = count || 1;
  return PinRn.generateAuthPINBlock(pinCount);
};
export const generateChangePINBlock = async () => {
  return PinRn.generateChangePINBlock();
};
export const generateAuthOTPCode = async () => {
  return PinRn.generateAuthOTPCode();
};
export const changeLanguage = async language => {
  return PinRn.changeLanguage(language);
};
export const finalize = async () => {
  return PinRn.finalize();
};
//# sourceMappingURL=NativeModuleWepinPin.js.map