import type { LoginOauthResult, LoginResult, ILoginAccessTokenParams, ILoginIdTokenParams, ILoginOauth2Params } from '../types';
import type { IWepinUser, providerType } from '@wepin/common';
export declare class WepinLogin {
    constructor();
    loginWithOauthProvider(params: ILoginOauth2Params): Promise<LoginOauthResult>;
    signUpWithEmailAndPassword(email: string, password: string, locale?: string): Promise<LoginResult>;
    loginWithEmailAndPassword(email: string, password: string): Promise<LoginResult>;
    loginWithIdToken(params: ILoginIdTokenParams): Promise<LoginResult>;
    loginWithAccessToken(params: ILoginAccessTokenParams): Promise<LoginResult>;
    getRefreshFirebaseToken(prevToken?: LoginResult): Promise<LoginResult>;
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