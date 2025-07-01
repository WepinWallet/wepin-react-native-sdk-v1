export let WepinSdkErrorCode = /*#__PURE__*/function (WepinSdkErrorCode) {
  WepinSdkErrorCode["ApiRequestError"] = "ApiRequestError";
  WepinSdkErrorCode["InvalidParameters"] = "InvalidParameters";
  WepinSdkErrorCode["NotInitialized"] = "NotInitialized";
  WepinSdkErrorCode["InvalidAppKey"] = "InvalidAppKey";
  WepinSdkErrorCode["InvalidLoginProvider"] = "InvalidLoginProvider";
  WepinSdkErrorCode["InvalidToken"] = "InvalidToken";
  WepinSdkErrorCode["InvalidLoginSession"] = "InvalidLoginSession";
  WepinSdkErrorCode["UserCancelled"] = "UserCancelled";
  WepinSdkErrorCode["UnknownError"] = "UnknownError";
  WepinSdkErrorCode["NotConnectedInternet"] = "NotConnectedInternet";
  WepinSdkErrorCode["FailedLogin"] = "FailedLogin";
  WepinSdkErrorCode["AlreadyLogout"] = "AlreadyLogout";
  WepinSdkErrorCode["AlreadyInitialized"] = "AlreadyInitialized";
  WepinSdkErrorCode["InvalidEmailDomain"] = "InvalidEmailDomain";
  WepinSdkErrorCode["FailedSendEmail"] = "FailedSendEmail";
  WepinSdkErrorCode["RequiredEmailVerified"] = "RequiredEmailVerified";
  WepinSdkErrorCode["IncorrectEmailForm"] = "IncorrectEmailForm";
  WepinSdkErrorCode["IncorrectPasswordForm"] = "IncorrectPasswordForm";
  WepinSdkErrorCode["NotInitializedNetwork"] = "NotInitializedNetwork";
  WepinSdkErrorCode["RequiredSignupEmail"] = "RequiredSignupEmail";
  WepinSdkErrorCode["FailedEmailVerified"] = "FailedEmailVerified";
  WepinSdkErrorCode["FailedPasswordStateSetting"] = "FailedPasswordStateSetting";
  WepinSdkErrorCode["FailedPasswordSetting"] = "FailedPasswordSetting";
  WepinSdkErrorCode["ExistedEmail"] = "ExistedEmail";
  WepinSdkErrorCode["NotActivity"] = "NotActivity";
  return WepinSdkErrorCode;
}({});
export class WepinSdkError extends Error {
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
    this.name = 'WepinSdkError';
  }
}
//# sourceMappingURL=WepinError.js.map