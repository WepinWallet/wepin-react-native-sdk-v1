export declare enum WepinPinErrorCode {
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
    NotActivity = "NotActivity"
}
export declare class WepinPinError extends Error {
    code: WepinPinErrorCode;
    constructor(code: WepinPinErrorCode, message?: string);
}
//# sourceMappingURL=WepinError.d.ts.map