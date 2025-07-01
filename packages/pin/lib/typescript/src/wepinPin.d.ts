import { WepinLogin } from './login/wepinLogin';
import { type IWepinSDKAttributes } from '@wepin/common';
import type { AuthOTP, AuthPinBlock, ChangePinBlock, RegistrationPinBlock } from './types/PinBlock';
/**
 * It is entry of Wepin features.
 * Client must use this object to use WepinLogin.
 */
export declare class WepinPin {
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
    generateRegistrationPINBlock(): Promise<RegistrationPinBlock>;
    generateAuthPINBlock(count?: number): Promise<AuthPinBlock>;
    generateChangePINBlock(): Promise<ChangePinBlock>;
    generateAuthOTPCode(): Promise<AuthOTP>;
    changeLanguage({ language }: {
        language: string;
    }): Promise<void>;
}
//# sourceMappingURL=wepinPin.d.ts.map