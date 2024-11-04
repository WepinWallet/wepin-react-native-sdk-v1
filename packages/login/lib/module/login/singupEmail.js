import { isErrorResponse, isFirebaseErrorResponse } from '@wepin/fetch-js';
import { WepinLoginError, WepinLoginErrorCode } from '../error/WepinError';
export const checkAndVerifyEmail = async ({
  isRequireVerified,
  email,
  locale,
  wepinFetch
}) => {
  const checkEmailExist = await wepinFetch.wepinApi.user.checkEmailExist({
    email
  });
  if (isErrorResponse(checkEmailExist)) {
    throw new WepinLoginError(WepinLoginErrorCode.ApiRequestError, checkEmailExist.message);
  }
  const {
    isEmailExist,
    isEmailverified,
    providerIds
  } = checkEmailExist;

  // 계정이 있는 경우
  if (isEmailExist && isEmailverified && providerIds.includes('password')) {
    throw new WepinLoginError(WepinLoginErrorCode.ExistedEmail);
  }
  const verify = await wepinFetch.wepinApi.user.verify({
    type: 'create',
    email,
    localeId: locale === 'ko' ? 1 : 2
  });
  if (isErrorResponse(verify)) {
    const statusCode = verify.statusCode;
    let errorMessage = WepinLoginErrorCode.FailedSendEmail;
    if (statusCode === 400) {
      errorMessage = WepinLoginErrorCode.InvalidEmailDomain;
    }
    throw new WepinLoginError(errorMessage, verify.message);
  }
  // 계정이 없고, 이메일 인증이 필요한 경우
  if (isRequireVerified) {
    throw new WepinLoginError(WepinLoginErrorCode.RequiredEmailVerified);
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
export const signUpEmail = async ({
  oobReset,
  oobVerify,
  email,
  password,
  wepinFetch
}) => {
  try {
    const resetPassword = await wepinFetch.wepinFirebaseApi.resetPassword(oobReset, password, false);
    if (isFirebaseErrorResponse(resetPassword) || resetPassword.email.toLowerCase() !== email) {
      throw new WepinLoginError(WepinLoginErrorCode.FailedPasswordSetting);
    }
    const verifyEmail = await wepinFetch.wepinFirebaseApi.verifyEmail(oobVerify);
    if (isFirebaseErrorResponse(verifyEmail) || verifyEmail.email.toLowerCase() !== email) {
      throw new WepinLoginError(WepinLoginErrorCode.FailedEmailVerified);
    }
  } catch (e) {
    throw new WepinLoginError(WepinLoginErrorCode.UnknownError, 'signUpEmail error' + e.message);
  }
};
//# sourceMappingURL=singupEmail.js.map