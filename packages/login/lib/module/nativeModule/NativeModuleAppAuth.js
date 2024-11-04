import { NativeModules, Platform } from 'react-native';
import invariant from 'invariant';
const LINKING_ERROR = `The package '@wepin/login-rn' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const LoginRn = NativeModules.LoginRn ? NativeModules.LoginRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});

// export function authenticate(): Promise<string> {
//   return LoginRn.authenticate();
// }

const validateServiceConfigurationEndpoints = serviceConfiguration => invariant(serviceConfiguration && typeof serviceConfiguration.authorizationEndpoint === 'string' && typeof serviceConfiguration.tokenEndpoint === 'string', 'Config error: you must provide either an issuer or a service endpoints');
const validateClientId = clientId => invariant(typeof clientId === 'string', 'Config error: clientId must be a string');
const validateRedirectUrl = redirectUrl => invariant(typeof redirectUrl === 'string', 'Config error: redirectUrl must be a string');
const validateHeaders = headers => {
  if (!headers) {
    return;
  }
  const customHeaderTypeErrorMessage = 'Config error: customHeaders type must be { token?: { [key: string]: string }, authorize?: { [key: string]: string }, register: { [key: string]: string }}';
  const authorizedKeys = ['token', 'authorize', 'register'];
  const keys = Object.keys(headers);
  const correctKeys = keys.filter(key => authorizedKeys.includes(key));
  invariant(keys.length <= authorizedKeys.length && correctKeys.length > 0 && correctKeys.length === keys.length, customHeaderTypeErrorMessage);
  Object.values(headers).forEach(value => {
    invariant(typeof value === 'object', customHeaderTypeErrorMessage);
    invariant(Object.values(value).filter(key => typeof key !== 'string').length === 0, customHeaderTypeErrorMessage);
  });
};
const validateAdditionalHeaders = headers => {
  if (!headers) {
    return;
  }
  const errorMessage = 'Config error: additionalHeaders must be { [key: string]: string }';
  invariant(typeof headers === 'object', errorMessage);
  invariant(Object.values(headers).filter(key => typeof key !== 'string').length === 0, errorMessage);
};
const validateConnectionTimeoutSeconds = timeout => {
  if (!timeout) {
    return;
  }
  invariant(typeof timeout === 'number', 'Config error: connectionTimeoutSeconds must be a number');
};
export const SECOND_IN_MS = 1000;
export const DEFAULT_TIMEOUT_IOS = 60;
export const DEFAULT_TIMEOUT_ANDROID = 15;
const convertTimeoutForPlatform = (platform, connectionTimeout = Platform.OS === 'ios' ? DEFAULT_TIMEOUT_IOS : DEFAULT_TIMEOUT_ANDROID) => platform === 'android' ? connectionTimeout * SECOND_IN_MS : connectionTimeout;
export const authorize = async ({
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

  const nativeMethodArguments = [wepinAppId, redirectUrl, clientId, scopes, additionalParameters, serviceConfiguration, skipCodeExchange, convertTimeoutForPlatform(Platform.OS, connectionTimeoutSeconds)];
  if (Platform.OS === 'android') {
    nativeMethodArguments.push(customHeaders);
    nativeMethodArguments.push(androidAllowCustomBrowsers);
    nativeMethodArguments.push(androidTrustedWebActivity);
  }
  if (Platform.OS === 'ios') {
    nativeMethodArguments.push(additionalHeaders);
    nativeMethodArguments.push(iosCustomBrowser);
    nativeMethodArguments.push(iosPrefersEphemeralSession);
  }
  return LoginRn.authorize(...nativeMethodArguments);
};
//# sourceMappingURL=NativeModuleAppAuth.js.map