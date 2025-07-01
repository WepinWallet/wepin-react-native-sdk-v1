export declare enum WepinProviderErrorCode {
    ApiRequestError = "ApiRequestError",
    InvalidParameters = "InvalidParameters",
    NotInitialized = "NotInitialized",
    InvalidAppKey = "InvalidAppKey",
    InvalidLoginProvider = "InvalidLoginProvider",
    InvalidToken = "InvalidToken",
    InvalidLoginSession = "InvalidLoginSession",
    UserCancelled = "UserCancelled",
    UnknownError = "UnknownError",
    NotConnectedInternet = "NotConnectedInternet",
    FailedLogin = "FailedLogin",
    AlreadyLogout = "AlreadyLogout",
    AlreadyInitialized = "AlreadyInitialized",
    InvalidEmailDomain = "InvalidEmailDomain",
    FailedSendEmail = "FailedSendEmail",
    RequiredEmailVerified = "RequiredEmailVerified",
    IncorrectEmailForm = "IncorrectEmailForm",
    IncorrectPasswordForm = "IncorrectPasswordForm",
    NotInitializedNetwork = "NotInitializedNetwork",
    RequiredSignupEmail = "RequiredSignupEmail",
    FailedEmailVerified = "FailedEmailVerified",
    FailedPasswordStateSetting = "FailedPasswordStateSetting",
    FailedPasswordSetting = "FailedPasswordSetting",
    ExistedEmail = "ExistedEmail",
    NotActivity = "NotActivity",
    RequestFailed = "RequestFailed"
}
export declare class WepinProviderError extends Error {
    code: WepinProviderErrorCode;
    constructor(code: WepinProviderErrorCode, message?: string);
}
//# sourceMappingURL=WepinError.d.ts.map