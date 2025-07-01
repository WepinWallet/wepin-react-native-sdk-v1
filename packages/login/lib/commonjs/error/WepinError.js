"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WepinLoginErrorCode = exports.WepinLoginError = void 0;
exports.convertNativeError = convertNativeError;
let WepinLoginErrorCode = exports.WepinLoginErrorCode = /*#__PURE__*/function (WepinLoginErrorCode) {
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
  WepinLoginErrorCode["AlreadyInitialized"] = "AlreadyInitialized";
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
  WepinLoginErrorCode["NotActivity"] = "NotActivity";
  WepinLoginErrorCode["Deprecated"] = "Deprecated";
  return WepinLoginErrorCode;
}({});
class WepinLoginError extends Error {
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
    this.name = 'WepinLoginError';
  }
}

// 네이티브 에러를 WepinLoginError로 변환하는 헬퍼 함수
exports.WepinLoginError = WepinLoginError;
function convertNativeError(error) {
  // error.code가 WepinLoginErrorCode 열거형에 있는지 확인
  if (error.code && Object.values(WepinLoginErrorCode).includes(error.code)) {
    return new WepinLoginError(error.code, error.message);
  }

  // 알려진 에러 코드가 아니거나 에러 코드가 없는 경우
  return new WepinLoginError(WepinLoginErrorCode.UnknownError, error.message || error.toString() || 'Unknown native error occurred');
}
//# sourceMappingURL=WepinError.js.map