export declare const initializeStorage: (appId: string) => Promise<any>;
export declare const setItem: (appId: string, key: string, value: string) => Promise<any>;
export declare const setAllItems: (appId: string, data: {
    [k: string]: string;
}) => Promise<any>;
export declare const getItem: (appId: string, key: string) => Promise<any>;
export declare const getAllItems: (appId: string) => Promise<any>;
export declare const removeItem: (appId: string, key: string) => Promise<any>;
export declare const clear: (appId: string) => Promise<any>;
//# sourceMappingURL=NativeModuleWepinStorage.d.ts.map