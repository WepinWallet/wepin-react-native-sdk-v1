import type { ILoginAccessTokenParams, ILoginIdTokenParams, ILoginOauth2Params, LoginOauthResult, LoginResult } from '../types';
import type { providerType } from '@wepin/common';
export declare const createWepinLogin: (appId: string, appKey: string) => void;
export declare const initialize: () => Promise<boolean>;
export declare const isInitialize: () => Promise<boolean>;
export declare const loginWithOauthProvider: (params: ILoginOauth2Params) => Promise<LoginOauthResult>;
export declare const signUpWithEmailAndPassword: (email: string, password: string, locale?: string) => Promise<LoginResult>;
export declare const loginWithEmailAndPassword: (email: string, password: string) => Promise<LoginResult>;
export declare const loginWithIdToken: (params: ILoginIdTokenParams) => Promise<LoginResult>;
export declare const loginWithAccessToken: (params: ILoginAccessTokenParams) => Promise<LoginResult>;
export declare const getRefreshFirebaseToken: (prevToken?: LoginResult) => Promise<LoginResult>;
export declare const getCurrentWepinUser: () => Promise<any>;
export declare const loginWepin: (param: {
    provider: providerType;
    token: {
        idToken: string;
        refreshToken: string;
    };
}) => Promise<any>;
export declare const logout: () => Promise<boolean>;
export declare const finalize: () => Promise<boolean>;
//# sourceMappingURL=NativeModuleWepinLogin.d.ts.map