"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUpEmail = exports.checkAndVerifyEmail = void 0;
var _fetchJs = require("@wepin/fetch-js");
var _WepinError = require("../error/WepinError");
const checkAndVerifyEmail = async ({
  isRequireVerified,
  email,
  locale,
  wepinFetch
}) => {
  const checkEmailExist = await wepinFetch.wepinApi.user.checkEmailExist({
    email
  });
  if ((0, _fetchJs.isErrorResponse)(checkEmailExist)) {
    throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.ApiRequestError, checkEmailExist.message);
  }
  const {
    isEmailExist,
    isEmailverified,
    providerIds
  } = checkEmailExist;

  // 계정이 있는 경우
  if (isEmailExist && isEmailverified && providerIds.includes('password')) {
    throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.ExistedEmail);
  }
  const verify = await wepinFetch.wepinApi.user.verify({
    type: 'create',
    email,
    localeId: locale === 'ko' ? 1 : 2
  });
  if ((0, _fetchJs.isErrorResponse)(verify)) {
    const statusCode = verify.statusCode;
    let errorMessage = _WepinError.WepinLoginErrorCode.FailedSendEmail;
    if (statusCode === 400) {
      errorMessage = _WepinError.WepinLoginErrorCode.InvalidEmailDomain;
    }
    throw new _WepinError.WepinLoginError(errorMessage, verify.message);
  }
  // 계정이 없고, 이메일 인증이 필요한 경우
  if (isRequireVerified) {
    throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.RequiredEmailVerified);
  }

  // 계정이 없고, 이메일 인증이 필요하지 않은 경우
  // const verify = await wepinFetch.wepinApi.user.verify({
  //   type: 'create',
  //   email,
  //   localeId: locale === 'ko' ? 1 : 2,
  // })
  // if (isErrorResponse(verify)) {
  //   const statusCode = verify.statusCode
  //   let errorMessage = 'fail/send-email'
  //   if (statusCode === 400) {
  //     errorMessage = 'invalid/email-domain'
  //   }
  //   throw new Error(errorMessage)
  // }

  return {
    oobReset: verify.oobReset,
    oobVerify: verify.oobVerify
  };
};
exports.checkAndVerifyEmail = checkAndVerifyEmail;
const signUpEmail = async ({
  oobReset,
  oobVerify,
  email,
  password,
  wepinFetch
}) => {
  try {
    const resetPassword = await wepinFetch.wepinFirebaseApi.resetPassword(oobReset, password, false);
    if ((0, _fetchJs.isFirebaseErrorResponse)(resetPassword) || resetPassword.email.toLowerCase() !== email) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.FailedPasswordSetting);
    }
    const verifyEmail = await wepinFetch.wepinFirebaseApi.verifyEmail(oobVerify);
    if ((0, _fetchJs.isFirebaseErrorResponse)(verifyEmail) || verifyEmail.email.toLowerCase() !== email) {
      throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.FailedEmailVerified);
    }
  } catch (e) {
    throw new _WepinError.WepinLoginError(_WepinError.WepinLoginErrorCode.UnknownError, 'signUpEmail error' + e.message);
  }
};
exports.signUpEmail = signUpEmail;
//# sourceMappingURL=singupEmail.js.map