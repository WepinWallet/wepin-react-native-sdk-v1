import { type WepinFetch } from '@wepin/fetch-js';
import type { IWepinUser } from '@wepin/common';
import type { WepinStorageManager } from '../storage/WepinStorageManager';
export declare const checkExistFirebaseLoginSession: (wepinFetch: WepinFetch, storage: WepinStorageManager) => Promise<boolean>;
export declare const checkExistWepinLoginSession: (wepinFetch: WepinFetch, storage: WepinStorageManager) => Promise<boolean>;
export declare const getLoginUserStorage: (storage: WepinStorageManager) => Promise<IWepinUser | null>;
//# sourceMappingURL=loginWepin.d.ts.map