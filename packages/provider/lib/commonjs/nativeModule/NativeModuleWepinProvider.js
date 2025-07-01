"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUpWithEmailAndPassword = exports.logout = exports.loginWithOauthProvider = exports.loginWithIdToken = exports.loginWithEmailAndPassword = exports.loginWithAccessToken = exports.loginWepin = exports.isInitialize = exports.initialize = exports.getRefreshFirebaseToken = exports.getCurrentWepinUser = exports.finalize = exports.createWepinProvider = exports.changeLanguage = void 0;
var _reactNative = require("react-native");
var _log = _interopRequireDefault(require("../utils/log"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const LINKING_ERROR = `The package '@wepin/provider-rn' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const ProviderRn = _reactNative.NativeModules.ProviderRn ? _reactNative.NativeModules.ProviderRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const createWepinProvider = (appId, appKey) => {
  ProviderRn.createWepinProvider(appId, appKey);
};
exports.createWepinProvider = createWepinProvider;
const initialize = async (defaultLanguage, defaultCurrency) => {
  return await ProviderRn.initialize(defaultLanguage, defaultCurrency);
};
exports.initialize = initialize;
const isInitialize = async () => {
  return ProviderRn.isInitialized();
};

///////////////////////WepinLogin///////////////////////////////////////////////////
exports.isInitialize = isInitialize;
const loginWithOauthProvider = async params => {
  _log.default.debug('loginWithOauthProvider', params);
  return await ProviderRn.loginWithOauthProvider(params.provider, params.clientId);
};
exports.loginWithOauthProvider = loginWithOauthProvider;
const signUpWithEmailAndPassword = async (email, password, locale) => {
  return await ProviderRn.signUpWithEmailAndPassword(email, password, locale);
};
exports.signUpWithEmailAndPassword = signUpWithEmailAndPassword;
const loginWithEmailAndPassword = async (email, password) => {
  return ProviderRn.loginWithEmailAndPassword(email, password);
};
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
const loginWithIdToken = async params => {
  return ProviderRn.loginWithIdToken(params.token);
};
exports.loginWithIdToken = loginWithIdToken;
const loginWithAccessToken = async params => {
  return ProviderRn.loginWithAccessToken(params.provider, params.token);
};
exports.loginWithAccessToken = loginWithAccessToken;
const getRefreshFirebaseToken = async prevToken => {
  return ProviderRn.getRefreshFirebaseToken(prevToken);
};
exports.getRefreshFirebaseToken = getRefreshFirebaseToken;
const getCurrentWepinUser = async () => {
  return ProviderRn.getCurrentWepinUser();
};
exports.getCurrentWepinUser = getCurrentWepinUser;
const loginWepin = async param => {
  return ProviderRn.loginWepin(param);
};
exports.loginWepin = loginWepin;
const logout = async () => {
  return ProviderRn.logout();
};
/////////////////////////////////////////////////////////////////////////////
exports.logout = logout;
const changeLanguage = async (language, currency) => {
  return ProviderRn.changeLanguage(language, currency);
};
exports.changeLanguage = changeLanguage;
const finalize = async () => {
  return ProviderRn.finalize();
};
exports.finalize = finalize;
//# sourceMappingURL=NativeModuleWepinProvider.js.map