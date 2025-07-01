"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUpWithEmailAndPassword = exports.logout = exports.loginWithOauthProvider = exports.loginWithIdToken = exports.loginWithEmailAndPassword = exports.loginWithAccessToken = exports.loginWepin = exports.isInitialize = exports.initialize = exports.getRefreshFirebaseToken = exports.getCurrentWepinUser = exports.generateRegistrationPINBlock = exports.generateChangePINBlock = exports.generateAuthPINBlock = exports.generateAuthOTPCode = exports.finalize = exports.createWepinPin = exports.changeLanguage = void 0;
var _reactNative = require("react-native");
var _log = _interopRequireDefault(require("../utils/log"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const LINKING_ERROR = `The package '@wepin/pin-rn' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const PinRn = _reactNative.NativeModules.PinRn ? _reactNative.NativeModules.PinRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const createWepinPin = (appId, appKey) => {
  PinRn.createWepinPin(appId, appKey);
};
exports.createWepinPin = createWepinPin;
const initialize = async (defaultLanguage, defaultCurrency) => {
  return await PinRn.initialize(defaultLanguage, defaultCurrency);
};
exports.initialize = initialize;
const isInitialize = async () => {
  return PinRn.isInitialized();
};

///////////////////////WepinLogin///////////////////////////////////////////////////
exports.isInitialize = isInitialize;
const loginWithOauthProvider = async params => {
  _log.default.debug('loginWithOauthProvider', params);
  return await PinRn.loginWithOauthProvider(params.provider, params.clientId);
};
exports.loginWithOauthProvider = loginWithOauthProvider;
const signUpWithEmailAndPassword = async (email, password, locale) => {
  return await PinRn.signUpWithEmailAndPassword(email, password, locale);
};
exports.signUpWithEmailAndPassword = signUpWithEmailAndPassword;
const loginWithEmailAndPassword = async (email, password) => {
  return PinRn.loginWithEmailAndPassword(email, password);
};
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
const loginWithIdToken = async params => {
  return PinRn.loginWithIdToken(params.token);
};
exports.loginWithIdToken = loginWithIdToken;
const loginWithAccessToken = async params => {
  return PinRn.loginWithAccessToken(params.provider, params.token);
};
exports.loginWithAccessToken = loginWithAccessToken;
const getRefreshFirebaseToken = async prevToken => {
  return PinRn.getRefreshFirebaseToken(prevToken);
};
exports.getRefreshFirebaseToken = getRefreshFirebaseToken;
const getCurrentWepinUser = async () => {
  return PinRn.getCurrentWepinUser();
};
exports.getCurrentWepinUser = getCurrentWepinUser;
const loginWepin = async param => {
  return PinRn.loginWepin(param);
};
exports.loginWepin = loginWepin;
const logout = async () => {
  return PinRn.logout();
};
/////////////////////////////////////////////////////////////////////////////
exports.logout = logout;
const generateRegistrationPINBlock = async () => {
  return PinRn.generateRegistrationPINBlock();
};
exports.generateRegistrationPINBlock = generateRegistrationPINBlock;
const generateAuthPINBlock = async count => {
  const pinCount = count || 1;
  return PinRn.generateAuthPINBlock(pinCount);
};
exports.generateAuthPINBlock = generateAuthPINBlock;
const generateChangePINBlock = async () => {
  return PinRn.generateChangePINBlock();
};
exports.generateChangePINBlock = generateChangePINBlock;
const generateAuthOTPCode = async () => {
  return PinRn.generateAuthOTPCode();
};
exports.generateAuthOTPCode = generateAuthOTPCode;
const changeLanguage = async language => {
  return PinRn.changeLanguage(language);
};
exports.changeLanguage = changeLanguage;
const finalize = async () => {
  return PinRn.finalize();
};
exports.finalize = finalize;
//# sourceMappingURL=NativeModuleWepinPin.js.map