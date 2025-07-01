"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WepinProviderErrorCode = exports.WepinProviderError = void 0;
let WepinProviderErrorCode = exports.WepinProviderErrorCode = /*#__PURE__*/function (WepinProviderErrorCode) {
  WepinProviderErrorCode["ApiRequestError"] = "ApiRequestError";
  WepinProviderErrorCode["InvalidParameters"] = "InvalidParameters";
  WepinProviderErrorCode["NotInitialized"] = "NotInitialized";
  WepinProviderErrorCode["InvalidAppKey"] = "InvalidAppKey";
  WepinProviderErrorCode["InvalidLoginProvider"] = "InvalidLoginProvider";
  WepinProviderErrorCode["InvalidToken"] = "InvalidToken";
  WepinProviderErrorCode["InvalidLoginSession"] = "InvalidLoginSession";
  WepinProviderErrorCode["UserCancelled"] = "UserCancelled";
  WepinProviderErrorCode["UnknownError"] = "UnknownError";
  WepinProviderErrorCode["NotConnectedInternet"] = "NotConnectedInternet";
  WepinProviderErrorCode["FailedLogin"] = "FailedLogin";
  WepinProviderErrorCode["AlreadyLogout"] = "AlreadyLogout";
  WepinProviderErrorCode["AlreadyInitialized"] = "AlreadyInitialized";
  WepinProviderErrorCode["InvalidEmailDomain"] = "InvalidEmailDomain";
  WepinProviderErrorCode["FailedSendEmail"] = "FailedSendEmail";
  WepinProviderErrorCode["RequiredEmailVerified"] = "RequiredEmailVerified";
  WepinProviderErrorCode["IncorrectEmailForm"] = "IncorrectEmailForm";
  WepinProviderErrorCode["IncorrectPasswordForm"] = "IncorrectPasswordForm";
  WepinProviderErrorCode["NotInitializedNetwork"] = "NotInitializedNetwork";
  WepinProviderErrorCode["RequiredSignupEmail"] = "RequiredSignupEmail";
  WepinProviderErrorCode["FailedEmailVerified"] = "FailedEmailVerified";
  WepinProviderErrorCode["FailedPasswordStateSetting"] = "FailedPasswordStateSetting";
  WepinProviderErrorCode["FailedPasswordSetting"] = "FailedPasswordSetting";
  WepinProviderErrorCode["ExistedEmail"] = "ExistedEmail";
  WepinProviderErrorCode["NotActivity"] = "NotActivity";
  WepinProviderErrorCode["RequestFailed"] = "RequestFailed";
  return WepinProviderErrorCode;
}({});
class WepinProviderError extends Error {
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
    this.name = 'WepinProviderError';
  }
}
exports.WepinProviderError = WepinProviderError;
//# sourceMappingURL=WepinError.js.map