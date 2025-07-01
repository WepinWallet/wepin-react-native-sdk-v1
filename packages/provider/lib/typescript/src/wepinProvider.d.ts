import { WepinLogin } from './login/wepinLogin';
import { type IWepinSDKAttributes } from '@wepin/common';
import type { BaseProvider } from './BaseProvider';
/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
export declare class WepinProvider {
    version: string;
    wepinAppId: string | undefined;
    wepinAppKey: string | undefined;
    wepinDomain: string | undefined;
    _isInitialized: boolean;
    appEmailVerified: boolean;
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
    changeLanguage({ language, currency, }: {
        language: string;
        currency?: string;
    }): Promise<void>;
    getProvider(network: string): Promise<BaseProvider>;
    /**
     * Finalize Wepin Object.
     */
    finalize(): Promise<void>;
}
//# sourceMappingURL=wepinProvider.d.ts.map