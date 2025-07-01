export interface ILoginOauth2Params {
    provider: string;
    clientId: string;
    withLogout?: boolean;
}
export interface ILoginIdTokenParams {
    token: string;
}
export interface ILoginAccessTokenParams extends ILoginIdTokenParams {
    provider: string;
}
//# sourceMappingURL=LoginRequest.d.ts.map