import type { IWepinStorage, LocalStorageType, LocalStorageKey, LocalStorageData, IUserInfo, IWepinToken } from '@wepin/storage-js';
export default class WepinRNStorage implements IWepinStorage {
    platform: 'web' | 'ios' | 'android';
    constructor(appId: string);
    getLocalStorageEnabled(): boolean;
    setAllLocalStorage(appId: string, data: LocalStorageType): Promise<void>;
    setLocalStorage(appId: string, name: LocalStorageKey, value: LocalStorageData): Promise<void>;
    getLocalStorage<T>(appId: string, name: LocalStorageKey): Promise<T | undefined>;
    getAllLocalStorage(appId: string): Promise<LocalStorageType | undefined>;
    clearLocalStorage(appId: string, name: LocalStorageKey): Promise<void>;
    clearAllLocalStorage(appId: string): Promise<void>;
    setLoginUserLocalStorage(appId: string, request: {
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
//# sourceMappingURL=WepinRNStorage.d.ts.map