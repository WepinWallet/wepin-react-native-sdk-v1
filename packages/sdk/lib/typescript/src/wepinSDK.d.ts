import { WepinLogin } from './login/wepinLogin';
import { type IWepinSDKAttributes, type IWepinUser } from '@wepin/common';
import type { IAccount } from './types/Account';
import type { IAccountBalanceInfo } from './types/AccountBalance';
import type { INFT } from './types/NFT';
import type { WepinLifeCycle } from './types/WepinLifeCycle';
import type { TxData } from './types/TxData';
/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
export declare class WepinWidgetSDK {
    version: string;
    wepinAppId: string | undefined;
    wepinAppKey: string | undefined;
    wepinDomain: string | undefined;
    _isInitialized: boolean;
    login: WepinLogin | undefined;
    constructor({ appId, appKey }: {
        appId: string;
        appKey: string;
    });
    toJSON(): string;
    /**
     * Initialize WepinLogin Object. It returns widget instance.
     */
    init(attributes?: IWepinSDKAttributes): Promise<boolean>;
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
    loginWithUI(providers: {
        provider: string;
        clientId: string;
    }[], email?: string): Promise<IWepinUser>;
    changeLanguage({ language, currency, }: {
        language: string;
        currency?: string;
    }): Promise<void>;
    openWidget(): Promise<boolean>;
    closeWidget(): Promise<boolean>;
    register(): Promise<IWepinUser>;
    getAccounts(options?: {
        networks?: string[];
        withEoa?: boolean;
    }): Promise<IAccount[]>;
    getBalance(accounts?: IAccount[]): Promise<IAccountBalanceInfo[]>;
    getNFTs(options?: {
        refresh: boolean;
        networks?: string[];
    }): Promise<INFT[]>;
    send({ account, txData, }: {
        account: IAccount;
        txData?: TxData;
    }): Promise<{
        txId: string;
    }>;
    receive(account: IAccount): Promise<{
        account: IAccount;
    }>;
    getStatus(): Promise<WepinLifeCycle>;
}
//# sourceMappingURL=wepinSDK.d.ts.map