"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUpWithEmailAndPassword = exports.send = exports.register = exports.receive = exports.openWidget = exports.logout = exports.loginWithUI = exports.loginWithOauthProvider = exports.loginWithIdToken = exports.loginWithEmailAndPassword = exports.loginWithAccessToken = exports.loginWepin = exports.isInitialize = exports.initialize = exports.getStatus = exports.getRefreshFirebaseToken = exports.getNFTs = exports.getCurrentWepinUser = exports.getBalance = exports.getAccounts = exports.finalize = exports.createWepinWidget = exports.closeWidget = exports.changeLanguage = void 0;
var _reactNative = require("react-native");
var _log = _interopRequireDefault(require("../utils/log"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const LINKING_ERROR = `The package '@wepin/sdk-rn' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const SdkRn = _reactNative.NativeModules.SdkRn ? _reactNative.NativeModules.SdkRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const createWepinWidget = (appId, appKey) => {
  SdkRn.createWepinWidget(appId, appKey);
};
exports.createWepinWidget = createWepinWidget;
const initialize = async (defaultLanguage, defaultCurrency) => {
  return await SdkRn.initialize(defaultLanguage, defaultCurrency);
};
exports.initialize = initialize;
const isInitialize = async () => {
  return await SdkRn.isInitialized();
};

///////////////////////WepinLogin///////////////////////////////////////////////////
exports.isInitialize = isInitialize;
const loginWithOauthProvider = async params => {
  _log.default.debug('loginWithOauthProvider', params);
  return await SdkRn.loginWithOauthProvider(params.provider, params.clientId);
};
exports.loginWithOauthProvider = loginWithOauthProvider;
const signUpWithEmailAndPassword = async (email, password, locale) => {
  return await SdkRn.signUpWithEmailAndPassword(email, password, locale);
};
exports.signUpWithEmailAndPassword = signUpWithEmailAndPassword;
const loginWithEmailAndPassword = async (email, password) => {
  return await SdkRn.loginWithEmailAndPassword(email, password);
};
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
const loginWithIdToken = async params => {
  return await SdkRn.loginWithIdToken(params.token);
};
exports.loginWithIdToken = loginWithIdToken;
const loginWithAccessToken = async params => {
  return await SdkRn.loginWithAccessToken(params.provider, params.token);
};
exports.loginWithAccessToken = loginWithAccessToken;
const getRefreshFirebaseToken = async prevToken => {
  return await SdkRn.getRefreshFirebaseToken(prevToken);
};
exports.getRefreshFirebaseToken = getRefreshFirebaseToken;
const getCurrentWepinUser = async () => {
  return await SdkRn.getCurrentWepinUser();
};
exports.getCurrentWepinUser = getCurrentWepinUser;
const loginWepin = async param => {
  return await SdkRn.loginWepin(param);
};
exports.loginWepin = loginWepin;
const logout = async () => {
  return await SdkRn.logout();
};
/////////////////////////////////////////////////////////////////////////////
exports.logout = logout;
const loginWithUI = async (providers, email) => {
  return await SdkRn.loginWithUI(providers, email);
};
exports.loginWithUI = loginWithUI;
const changeLanguage = async (language, currency) => {
  return await SdkRn.changeLanguage(language, currency);
};
exports.changeLanguage = changeLanguage;
const getStatus = async () => {
  return await SdkRn.getStatus();
};
exports.getStatus = getStatus;
const openWidget = async () => {
  try {
    return await SdkRn.openWidget();
  } catch (error) {
    console.error('openWidget error', error);
    throw error;
  }
};
exports.openWidget = openWidget;
const closeWidget = async () => {
  return SdkRn.closeWidget();
};
exports.closeWidget = closeWidget;
const register = async () => {
  return await SdkRn.register();
};
exports.register = register;
const getAccounts = async (networks, withEoa = false) => {
  return await SdkRn.getAccounts(networks, withEoa);
};
exports.getAccounts = getAccounts;
const getBalance = async accounts => {
  return await SdkRn.getBalance(accounts);
};
exports.getBalance = getBalance;
const getNFTs = async (refresh, networks) => {
  return await SdkRn.getNFTs(refresh, networks);
};
exports.getNFTs = getNFTs;
const send = async (account, txData) => {
  return await SdkRn.send(account, txData);
};
exports.send = send;
const receive = async account => {
  return await SdkRn.receive(account);
};
exports.receive = receive;
const finalize = async () => {
  return SdkRn.finalize();
};
exports.finalize = finalize;
//# sourceMappingURL=NativeModuleWepinSDK.js.map