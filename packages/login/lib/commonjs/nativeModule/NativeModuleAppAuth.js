"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorize = exports.SECOND_IN_MS = exports.DEFAULT_TIMEOUT_IOS = exports.DEFAULT_TIMEOUT_ANDROID = void 0;
var _reactNative = require("react-native");
var _invariant = _interopRequireDefault(require("invariant"));
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

// export function authenticate(): Promise<string> {
//   return LoginRn.authenticate();
// }

const validateServiceConfigurationEndpoints = serviceConfiguration => (0, _invariant.default)(serviceConfiguration && typeof serviceConfiguration.authorizationEndpoint === 'string' && typeof serviceConfiguration.tokenEndpoint === 'string', 'Config error: you must provide either an issuer or a service endpoints');
const validateClientId = clientId => (0, _invariant.default)(typeof clientId === 'string', 'Config error: clientId must be a string');
const validateRedirectUrl = redirectUrl => (0, _invariant.default)(typeof redirectUrl === 'string', 'Config error: redirectUrl must be a string');
const validateHeaders = headers => {
  if (!headers) {
    return;
  }
  const customHeaderTypeErrorMessage = 'Config error: customHeaders type must be { token?: { [key: string]: string }, authorize?: { [key: string]: string }, register: { [key: string]: string }}';
  const authorizedKeys = ['token', 'authorize', 'register'];
  const keys = Object.keys(headers);
  const correctKeys = keys.filter(key => authorizedKeys.includes(key));
  (0, _invariant.default)(keys.length <= authorizedKeys.length && correctKeys.length > 0 && correctKeys.length === keys.length, customHeaderTypeErrorMessage);
  Object.values(headers).forEach(value => {
    (0, _invariant.default)(typeof value === 'object', customHeaderTypeErrorMessage);
    (0, _invariant.default)(Object.values(value).filter(key => typeof key !== 'string').length === 0, customHeaderTypeErrorMessage);
  });
};
const validateAdditionalHeaders = headers => {
  if (!headers) {
    return;
  }
  const errorMessage = 'Config error: additionalHeaders must be { [key: string]: string }';
  (0, _invariant.default)(typeof headers === 'object', errorMessage);
  (0, _invariant.default)(Object.values(headers).filter(key => typeof key !== 'string').length === 0, errorMessage);
};
const validateConnectionTimeoutSeconds = timeout => {
  if (!timeout) {
    return;
  }
  (0, _invariant.default)(typeof timeout === 'number', 'Config error: connectionTimeoutSeconds must be a number');
};
const SECOND_IN_MS = exports.SECOND_IN_MS = 1000;
const DEFAULT_TIMEOUT_IOS = exports.DEFAULT_TIMEOUT_IOS = 60;
const DEFAULT_TIMEOUT_ANDROID = exports.DEFAULT_TIMEOUT_ANDROID = 15;
const convertTimeoutForPlatform = (platform, connectionTimeout = _reactNative.Platform.OS === 'ios' ? DEFAULT_TIMEOUT_IOS : DEFAULT_TIMEOUT_ANDROID) => platform === 'android' ? connectionTimeout * SECOND_IN_MS : connectionTimeout;
const authorize = async ({
  wepinAppId,
  redirectUrl,
  clientId,
  scopes,
  additionalParameters,
  serviceConfiguration,
  customHeaders,
  additionalHeaders,
  skipCodeExchange = false,
  iosCustomBrowser = null,
  androidAllowCustomBrowsers = null,
  androidTrustedWebActivity = false,
  connectionTimeoutSeconds,
  iosPrefersEphemeralSession = false
}) => {
  validateServiceConfigurationEndpoints(serviceConfiguration);
  validateClientId(clientId);
  validateRedirectUrl(redirectUrl);
  validateHeaders(customHeaders);
  validateAdditionalHeaders(additionalHeaders);
  validateConnectionTimeoutSeconds(connectionTimeoutSeconds);
  // TODO: validateAdditionalParameters

  const nativeMethodArguments = [wepinAppId, redirectUrl, clientId, scopes, additionalParameters, serviceConfiguration, skipCodeExchange, convertTimeoutForPlatform(_reactNative.Platform.OS, connectionTimeoutSeconds)];
  if (_reactNative.Platform.OS === 'android') {
    nativeMethodArguments.push(customHeaders);
    nativeMethodArguments.push(androidAllowCustomBrowsers);
    nativeMethodArguments.push(androidTrustedWebActivity);
  }
  if (_reactNative.Platform.OS === 'ios') {
    nativeMethodArguments.push(additionalHeaders);
    nativeMethodArguments.push(iosCustomBrowser);
    nativeMethodArguments.push(iosPrefersEphemeralSession);
  }
  return LoginRn.authorize(...nativeMethodArguments);
};
exports.authorize = authorize;
//# sourceMappingURL=NativeModuleAppAuth.js.map