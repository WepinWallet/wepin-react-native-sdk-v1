import type { ILoginAccessTokenParams, ILoginIdTokenParams, ILoginOauth2Params, LoginOauthResult, LoginResult } from '../types';
import type { providerType } from '@wepin/common';
import type { IAccount } from '../types/Account';
import type { TxData } from '../types/TxData';
export declare const createWepinWidget: (appId: string, appKey: string) => void;
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
export declare const loginWithUI: (providers: {
    provider: string;
    clientId: string;
}[], email?: string) => Promise<any>;
export declare const changeLanguage: (language: string, currency?: string) => Promise<any>;
export declare const getStatus: () => Promise<any>;
export declare const openWidget: () => Promise<any>;
export declare const closeWidget: () => Promise<any>;
export declare const register: () => Promise<any>;
export declare const getAccounts: (networks?: string[], withEoa?: boolean) => Promise<any>;
export declare const getBalance: (accounts?: IAccount[]) => Promise<any>;
export declare const getNFTs: (refresh: boolean, networks?: string[]) => Promise<any>;
export declare const send: (account: IAccount, txData?: TxData) => Promise<any>;
export declare const receive: (account: IAccount) => Promise<any>;
export declare const finalize: () => Promise<any>;
//# sourceMappingURL=NativeModuleWepinSDK.d.ts.map