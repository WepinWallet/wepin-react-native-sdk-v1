import { NativeModules, Platform } from 'react-native';
import LOG from '../utils/log';
const LINKING_ERROR = `The package '@wepin/sdk-rn' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const SdkRn = NativeModules.SdkRn ? NativeModules.SdkRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
export const createWepinWidget = (appId, appKey) => {
  SdkRn.createWepinWidget(appId, appKey);
};
export const initialize = async (defaultLanguage, defaultCurrency) => {
  return await SdkRn.initialize(defaultLanguage, defaultCurrency);
};
export const isInitialize = async () => {
  return await SdkRn.isInitialized();
};

///////////////////////WepinLogin///////////////////////////////////////////////////

export const loginWithOauthProvider = async params => {
  LOG.debug('loginWithOauthProvider', params);
  return await SdkRn.loginWithOauthProvider(params.provider, params.clientId);
};
export const signUpWithEmailAndPassword = async (email, password, locale) => {
  return await SdkRn.signUpWithEmailAndPassword(email, password, locale);
};
export const loginWithEmailAndPassword = async (email, password) => {
  return await SdkRn.loginWithEmailAndPassword(email, password);
};
export const loginWithIdToken = async params => {
  return await SdkRn.loginWithIdToken(params.token);
};
export const loginWithAccessToken = async params => {
  return await SdkRn.loginWithAccessToken(params.provider, params.token);
};
export const getRefreshFirebaseToken = async prevToken => {
  return await SdkRn.getRefreshFirebaseToken(prevToken);
};
export const getCurrentWepinUser = async () => {
  return await SdkRn.getCurrentWepinUser();
};
export const loginWepin = async param => {
  return await SdkRn.loginWepin(param);
};
export const logout = async () => {
  return await SdkRn.logout();
};
/////////////////////////////////////////////////////////////////////////////

export const loginWithUI = async (providers, email) => {
  return await SdkRn.loginWithUI(providers, email);
};
export const changeLanguage = async (language, currency) => {
  return await SdkRn.changeLanguage(language, currency);
};
export const getStatus = async () => {
  return await SdkRn.getStatus();
};
export const openWidget = async () => {
  try {
    return await SdkRn.openWidget();
  } catch (error) {
    console.error('openWidget error', error);
    throw error;
  }
};
export const closeWidget = async () => {
  return SdkRn.closeWidget();
};
export const register = async () => {
  return await SdkRn.register();
};
export const getAccounts = async (networks, withEoa = false) => {
  return await SdkRn.getAccounts(networks, withEoa);
};
export const getBalance = async accounts => {
  return await SdkRn.getBalance(accounts);
};
export const getNFTs = async (refresh, networks) => {
  return await SdkRn.getNFTs(refresh, networks);
};
export const send = async (account, txData) => {
  return await SdkRn.send(account, txData);
};
export const receive = async account => {
  return await SdkRn.receive(account);
};
export const finalize = async () => {
  return SdkRn.finalize();
};
//# sourceMappingURL=NativeModuleWepinSDK.js.map