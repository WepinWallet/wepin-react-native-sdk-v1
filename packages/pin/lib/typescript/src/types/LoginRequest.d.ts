import type { WEPIN_OAUTH2 } from '../const/config';
export interface ILoginOauth2Params {
    provider: (typeof WEPIN_OAUTH2)[number];
    clientId: string;
    withLogout?: boolean;
}
export interface ILoginIdTokenParams {
    token: string;
}
export interface ILoginAccessTokenParams extends ILoginIdTokenParams {
    provider: 'naver' | 'discord';
}
//# sourceMappingURL=LoginRequest.d.ts.map