export interface ServiceConfiguration {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    revocationEndpoint?: string;
    registrationEndpoint?: string;
    endSessionEndpoint?: string;
}
export type CustomHeaders = {
    authorize?: Record<string, string>;
    token?: Record<string, string>;
    register?: Record<string, string>;
};
export type AdditionalHeaders = Record<string, string>;
interface BuiltInParameters {
    display?: 'page' | 'popup' | 'touch' | 'wap';
    login_prompt?: string;
    prompt?: 'consent' | 'login' | 'none' | 'select_account';
}
export interface ServiceConfiguration {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    revocationEndpoint?: string;
    registrationEndpoint?: string;
    endSessionEndpoint?: string;
}
export type AuthConfiguration = {
    wepinAppId: string;
    clientId: string;
    scopes: string[];
    redirectUrl: string;
    serviceConfiguration: ServiceConfiguration;
    additionalParameters?: BuiltInParameters & {
        [name: string]: string;
    };
    customHeaders?: CustomHeaders;
    additionalHeaders?: AdditionalHeaders;
    connectionTimeoutSeconds?: number;
    warmAndPrefetchChrome?: boolean;
    skipCodeExchange?: boolean;
    iosCustomBrowser?: 'safari' | 'chrome' | 'opera' | 'firefox' | null;
    androidAllowCustomBrowsers?: ('chrome' | 'chromeCustomTab' | 'firefox' | 'firefoxCustomTab' | 'samsung' | 'samsungCustomTab')[] | null;
    androidTrustedWebActivity?: boolean;
    iosPrefersEphemeralSession?: boolean;
};
export interface AuthorizeResult {
    accessToken: string;
    accessTokenExpirationDate: string;
    authorizeAdditionalParameters?: {
        [name: string]: string;
    };
    tokenAdditionalParameters?: {
        [name: string]: string;
    };
    idToken: string;
    refreshToken: string;
    tokenType: string;
    scopes: string[];
    authorizationCode: string;
    codeVerifier?: string;
}
export {};
//# sourceMappingURL=NativeModuleTypes.d.ts.map