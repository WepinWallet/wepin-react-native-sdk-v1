import type { ILoginAccessTokenParams, ILoginIdTokenParams, ILoginOauth2Params, LoginOauthResult, LoginResult } from '../types';
import type { providerType } from '@wepin/common';
export declare const createWepinPin: (appId: string, appKey: string) => void;
export declare const initialize: (defaultLanguage: String, defaultCurrency: String) => Promise<any>;
export declare const isInitialize: () => Promise<any>;
export declare const loginWithOauthProvider: (params: ILoginOauth2Params) => Promise<LoginOauthResult>;
export declare const signUpWithEmailAndPassword: (email: string, password: string, locale?: string) => Promise<any>;
export declare const loginWithEmailAndPassword: (email: string, password: string) => Promise<any>;
export declare const loginWithIdToken: (params: ILoginIdTokenParams) => Promise<any>;
export declare const loginWithAccessToken: (params: ILoginAccessTokenParams) => Promise<any>;
export declare const getRefreshFirebaseToken: (prevToken?: LoginResult) => Promise<any>;
export declare const getCurrentWepinUser: () => Promise<any>;
export declare const loginWepin: (param: {
    provider: providerType;
    token: {
        idToken: string;
        refreshToken: string;
    };
}) => Promise<any>;
export declare const logout: () => Promise<any>;
export declare const generateRegistrationPINBlock: () => Promise<any>;
export declare const generateAuthPINBlock: (count?: number) => Promise<any>;
export declare const generateChangePINBlock: () => Promise<any>;
export declare const generateAuthOTPCode: () => Promise<any>;
export declare const changeLanguage: (language: string) => Promise<any>;
export declare const finalize: () => Promise<any>;
//# sourceMappingURL=NativeModuleWepinPin.d.ts.map