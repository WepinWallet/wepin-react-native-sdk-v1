import type { IUserInfo, IWepinToken, LocalStorageData, LocalStorageKey, LocalStorageType } from '@wepin/storage-js';
import WepinRNStorage from '@wepin/storage-rn';
export declare class WepinStorageManager {
    appId: string;
    platform: 'web' | 'ios' | 'android';
    wepinStorage: WepinRNStorage;
    constructor(platform: 'web' | 'ios' | 'android', appId: string);
    setAllLocalStorage(value: LocalStorageType): Promise<void>;
    setLocalStorage(name: LocalStorageKey, value: LocalStorageData): Promise<void>;
    getLocalStorage<T>(name: LocalStorageKey): Promise<T | undefined>;
    getAllLocalStorage(): Promise<LocalStorageType | undefined>;
    clearLocalStorage(name: LocalStorageKey): Promise<void>;
    clearAllLocalStorage(onlyAppId: boolean): Promise<void>;
    setLoginUserLocalStorage(request: {
        provider: string;
        token: {
            idToken: string;
            refreshToken: string;
        };
    }, response: any): Promise<{
        userInfo: IUserInfo;
        connectUser: IWepinToken;
    }>;
}
//# sourceMappingURL=WepinStorageManager.d.ts.map