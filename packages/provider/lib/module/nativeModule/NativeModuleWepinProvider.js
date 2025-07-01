import { NativeModules, Platform } from 'react-native';
import LOG from '../utils/log';
const LINKING_ERROR = `The package '@wepin/provider-rn' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const ProviderRn = NativeModules.ProviderRn ? NativeModules.ProviderRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
export const createWepinProvider = (appId, appKey) => {
  ProviderRn.createWepinProvider(appId, appKey);
};
export const initialize = async (defaultLanguage, defaultCurrency) => {
  return await ProviderRn.initialize(defaultLanguage, defaultCurrency);
};
export const isInitialize = async () => {
  return ProviderRn.isInitialized();
};

///////////////////////WepinLogin///////////////////////////////////////////////////

export const loginWithOauthProvider = async params => {
  LOG.debug('loginWithOauthProvider', params);
  return await ProviderRn.loginWithOauthProvider(params.provider, params.clientId);
};
export const signUpWithEmailAndPassword = async (email, password, locale) => {
  return await ProviderRn.signUpWithEmailAndPassword(email, password, locale);
};
export const loginWithEmailAndPassword = async (email, password) => {
  return ProviderRn.loginWithEmailAndPassword(email, password);
};
export const loginWithIdToken = async params => {
  return ProviderRn.loginWithIdToken(params.token);
};
export const loginWithAccessToken = async params => {
  return ProviderRn.loginWithAccessToken(params.provider, params.token);
};
export const getRefreshFirebaseToken = async prevToken => {
  return ProviderRn.getRefreshFirebaseToken(prevToken);
};
export const getCurrentWepinUser = async () => {
  return ProviderRn.getCurrentWepinUser();
};
export const loginWepin = async param => {
  return ProviderRn.loginWepin(param);
};
export const logout = async () => {
  return ProviderRn.logout();
};
/////////////////////////////////////////////////////////////////////////////

export const changeLanguage = async (language, currency) => {
  return ProviderRn.changeLanguage(language, currency);
};
export const finalize = async () => {
  return ProviderRn.finalize();
};
//# sourceMappingURL=NativeModuleWepinProvider.js.map