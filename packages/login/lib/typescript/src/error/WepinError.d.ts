export declare enum WepinLoginErrorCode {
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
    AlraadyInitialized = "AlraadyInitialized",
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
    ExistedEmail = "ExistedEmail"
}
export declare class WepinLoginError extends Error {
    code: WepinLoginErrorCode;
    constructor(code: WepinLoginErrorCode, message?: string);
}
//# sourceMappingURL=WepinError.d.ts.map