import type { WEPIN_OAUTH_TOKEN_TYPE } from '../const/config';
import type { providerType } from '@wepin/common';
export interface FBToken {
    idToken: string;
    refreshToken: string;
}
export interface LoginResult {
    provider: providerType;
    token: FBToken;
}
export interface LoginOauthResult {
    provider: providerType;
    token: string;
    type: (typeof WEPIN_OAUTH_TOKEN_TYPE)[number];
}
//# sourceMappingURL=LoginResult.d.ts.map