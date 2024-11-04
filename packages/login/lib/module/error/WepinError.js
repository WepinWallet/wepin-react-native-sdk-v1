export let WepinLoginErrorCode = /*#__PURE__*/function (WepinLoginErrorCode) {
  WepinLoginErrorCode["ApiRequestError"] = "ApiRequestError";
  WepinLoginErrorCode["InvalidParameters"] = "InvalidParameters";
  WepinLoginErrorCode["NotInitialized"] = "NotInitialized";
  WepinLoginErrorCode["InvalidAppKey"] = "InvalidAppKey";
  WepinLoginErrorCode["InvalidLoginProvider"] = "InvalidLoginProvider";
  WepinLoginErrorCode["InvalidToken"] = "InvalidToken";
  WepinLoginErrorCode["InvalidLoginSession"] = "InvalidLoginSession";
  WepinLoginErrorCode["UserCancelled"] = "UserCancelled";
  WepinLoginErrorCode["UnknownError"] = "UnknownError";
  WepinLoginErrorCode["NotConnectedInternet"] = "NotConnectedInternet";
  WepinLoginErrorCode["FailedLogin"] = "FailedLogin";
  WepinLoginErrorCode["AlreadyLogout"] = "AlreadyLogout";
  WepinLoginErrorCode["AlraadyInitialized"] = "AlraadyInitialized";
  WepinLoginErrorCode["InvalidEmailDomain"] = "InvalidEmailDomain";
  WepinLoginErrorCode["FailedSendEmail"] = "FailedSendEmail";
  WepinLoginErrorCode["RequiredEmailVerified"] = "RequiredEmailVerified";
  WepinLoginErrorCode["IncorrectEmailForm"] = "IncorrectEmailForm";
  WepinLoginErrorCode["IncorrectPasswordForm"] = "IncorrectPasswordForm";
  WepinLoginErrorCode["NotInitializedNetwork"] = "NotInitializedNetwork";
  WepinLoginErrorCode["RequiredSignupEmail"] = "RequiredSignupEmail";
  WepinLoginErrorCode["FailedEmailVerified"] = "FailedEmailVerified";
  WepinLoginErrorCode["FailedPasswordStateSetting"] = "FailedPasswordStateSetting";
  WepinLoginErrorCode["FailedPasswordSetting"] = "FailedPasswordSetting";
  WepinLoginErrorCode["ExistedEmail"] = "ExistedEmail";
  return WepinLoginErrorCode;
}({});
export class WepinLoginError extends Error {
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
    this.name = 'WepinLoginError';
  }
}
//# sourceMappingURL=WepinError.js.map