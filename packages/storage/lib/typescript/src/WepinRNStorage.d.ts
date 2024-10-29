import type { IWepinStorage, LocalStorageType, LocalStorageKey, LocalStorageData, IUserInfo, IWepinToken } from '@wepin/storage-js';
export default class WepinRNStorage implements IWepinStorage {
    #private;
    platform: 'web' | 'ios' | 'android';
    constructor();
    getLocalStorageEnabled(): boolean;
    private addAppId;
    private getAllAppIds;
    getAllData(): Promise<Record<string, LocalStorageType>>;
    clearAllAppIds(): Promise<void>;
    setAllLocalStorage(appId: string, value: LocalStorageType): Promise<void>;
    setLocalStorage(appId: string, name: LocalStorageKey, value: LocalStorageData): Promise<void>;
    getLocalStorage<T>(appId: string, name: LocalStorageKey): Promise<T | undefined>;
    getAllLocalStorage(appId: string): Promise<LocalStorageType | undefined>;
    clearLocalStorage(appId: string, name: LocalStorageKey): Promise<void>;
    clearAllLocalStorage(appId: string): Promise<void>;
    clearAllAppIdsData(): Promise<void>;
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