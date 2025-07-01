export let WepinPinErrorCode = /*#__PURE__*/function (WepinPinErrorCode) {
  WepinPinErrorCode["ApiRequestError"] = "ApiRequestError";
  WepinPinErrorCode["InvalidParameters"] = "InvalidParameters";
  WepinPinErrorCode["NotInitialized"] = "NotInitialized";
  WepinPinErrorCode["InvalidAppKey"] = "InvalidAppKey";
  WepinPinErrorCode["InvalidLoginProvider"] = "InvalidLoginProvider";
  WepinPinErrorCode["InvalidToken"] = "InvalidToken";
  WepinPinErrorCode["InvalidLoginSession"] = "InvalidLoginSession";
  WepinPinErrorCode["UserCancelled"] = "UserCancelled";
  WepinPinErrorCode["UnknownError"] = "UnknownError";
  WepinPinErrorCode["NotConnectedInternet"] = "NotConnectedInternet";
  WepinPinErrorCode["FailedLogin"] = "FailedLogin";
  WepinPinErrorCode["AlreadyLogout"] = "AlreadyLogout";
  WepinPinErrorCode["AlreadyInitialized"] = "AlreadyInitialized";
  WepinPinErrorCode["InvalidEmailDomain"] = "InvalidEmailDomain";
  WepinPinErrorCode["FailedSendEmail"] = "FailedSendEmail";
  WepinPinErrorCode["RequiredEmailVerified"] = "RequiredEmailVerified";
  WepinPinErrorCode["IncorrectEmailForm"] = "IncorrectEmailForm";
  WepinPinErrorCode["IncorrectPasswordForm"] = "IncorrectPasswordForm";
  WepinPinErrorCode["NotInitializedNetwork"] = "NotInitializedNetwork";
  WepinPinErrorCode["RequiredSignupEmail"] = "RequiredSignupEmail";
  WepinPinErrorCode["FailedEmailVerified"] = "FailedEmailVerified";
  WepinPinErrorCode["FailedPasswordStateSetting"] = "FailedPasswordStateSetting";
  WepinPinErrorCode["FailedPasswordSetting"] = "FailedPasswordSetting";
  WepinPinErrorCode["ExistedEmail"] = "ExistedEmail";
  WepinPinErrorCode["NotActivity"] = "NotActivity";
  return WepinPinErrorCode;
}({});
export class WepinPinError extends Error {
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
    this.name = 'WepinPinError';
  }
}
//# sourceMappingURL=WepinError.js.map