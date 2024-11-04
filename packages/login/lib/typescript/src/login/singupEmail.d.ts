import type { WepinFetch } from '@wepin/fetch-js';
export declare const checkAndVerifyEmail: ({ isRequireVerified, email, locale, wepinFetch, }: {
    isRequireVerified: boolean;
    email: string;
    locale?: string;
    wepinFetch: WepinFetch;
}) => Promise<{
    oobReset: string | undefined;
    oobVerify: string | undefined;
}>;
export declare const signUpEmail: ({ oobReset, oobVerify, email, password, wepinFetch, }: {
    oobReset: string;
    oobVerify: string;
    email: string;
    password: string;
    wepinFetch: WepinFetch;
}) => Promise<void>;
//# sourceMappingURL=singupEmail.d.ts.map