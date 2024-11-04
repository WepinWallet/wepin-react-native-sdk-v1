import type { AuthConfiguration } from '../types';
export declare const SECOND_IN_MS = 1000;
export declare const DEFAULT_TIMEOUT_IOS = 60;
export declare const DEFAULT_TIMEOUT_ANDROID = 15;
export declare const authorize: ({ wepinAppId, redirectUrl, clientId, scopes, additionalParameters, serviceConfiguration, customHeaders, additionalHeaders, skipCodeExchange, iosCustomBrowser, androidAllowCustomBrowsers, androidTrustedWebActivity, connectionTimeoutSeconds, iosPrefersEphemeralSession, }: AuthConfiguration) => Promise<any>;
//# sourceMappingURL=NativeModuleAppAuth.d.ts.map