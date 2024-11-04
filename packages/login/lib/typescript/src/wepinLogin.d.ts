import type { LoginOauthResult, LoginResult, ILoginAccessTokenParams, ILoginIdTokenParams, ILoginOauth2Params } from './types';
import type { IWepinUser, providerType } from '@wepin/common';
/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
export declare class WepinLogin {
    version: string;
    wepinAppId: string | undefined;
    wepinAppKey: string | undefined;
    wepinDomain: string | undefined;
    _isInitialized: boolean;
    private storageManager;
    private _wepinFetch;
    appEmailVerified: boolean;
    constructor({ appId, appKey }: {
        appId: string;
        appKey: string;
    });
    toJSON(): string;
    /**
     * Initialize WepinLogin Object. It returns widget instance.
     */
    init(): Promise<void>;
    /**
     * Check if wepin is initialized.
     *
     * @returns
     */
    isInitialized(): boolean;
    /**
     * Finalize Wepin Object.
     */
    finalize(): Promise<void>;
    private initCookieData;
    loginWithOauthProvider(params: ILoginOauth2Params): Promise<LoginOauthResult>;
    signUpWithEmailAndPassword(email: string, password: string, locale?: string): Promise<LoginResult>;
    private changePassword;
    private loginWithEmailAndResetPasswordState;
    loginWithEmailAndPassword(email: string, password: string): Promise<LoginResult>;
    private doFirebaseLoginWithCustomToken;
    loginWithIdToken(params: ILoginIdTokenParams): Promise<LoginResult>;
    loginWithAccessToken(params: ILoginAccessTokenParams): Promise<LoginResult>;
    getRefreshFirebaseToken(): Promise<LoginResult>;
    /**
     * Returns the user's login information.
     * This method with the same as `loginWithUI()`, but it doesn't show the widget.
     *
     * This method must be used in conjunction with the `@wepin/login-js` module.
     * Additionally, the parameters for this method should utilize the return values from the `loginWithOauthProvider()`, `loginWithEmailAndPassword()`, `loginWithIdToken()`, and `loginWithAccessToken()` methods within the `@wepin/login-js` module.
     * @param provider 'email'|'apple'|'google'|'discord'|'naver'|'external_token'
     * @param token  `{idToken: string, refreshToken: string}`. this value is response of `@wepin/login-js`
     * @returns {Promise<IWepinUser>}
     * @example
     * ```typescript
     * import { WepinLogin } from '@wepin/login-js'
     * const wepinLogin = WepinLogin({ appId: 'appId', appKey: 'appKey' })
     * const res = await wepinLogin.loginWithOauthProvider({ provider: 'google' })
     * wepinLogin.loginWepin(res).then((userInfo) => {
     * console.log(userInfo)
     * })
     **/
    loginWepin(param: {
        provider: providerType;
        token: {
            idToken: string;
            refreshToken: string;
        };
    }): Promise<IWepinUser>;
    getCurrentWepinUser(): Promise<IWepinUser>;
    logoutWepin(): Promise<boolean>;
}
//# sourceMappingURL=wepinLogin.d.ts.map