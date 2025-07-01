package com.wepin.loginrn.error

import com.wepin.android.commonlib.error.WepinError

object WepinErrorMapper {
  private fun mapToLoginError(error: WepinError): WepinLoginError {
    val errorCode = when (error.getErrorCode()) {
      WepinError.API_REQUEST_ERROR.code -> WepinLoginErrorCode.ApiRequestError
      WepinError.INVALID_PARAMETER.code -> WepinLoginErrorCode.InvalidParameters
      WepinError.NOT_INITIALIZED_ERROR.code -> WepinLoginErrorCode.NotInitialized
      WepinError.INVALID_APP_KEY.code -> WepinLoginErrorCode.InvalidAppKey
      WepinError.INVALID_LOGIN_PROVIDER.code -> WepinLoginErrorCode.InvalidLoginProvider
      WepinError.INVALID_TOKEN.code -> WepinLoginErrorCode.InvalidToken
      WepinError.INVALID_LOGIN_SESSION.code -> WepinLoginErrorCode.InvalidLoginSession
      WepinError.USER_CANCELED.code -> WepinLoginErrorCode.UserCancelled
      WepinError.NOT_CONNECTED_INTERNET.code -> WepinLoginErrorCode.NotConnectedInternet
      WepinError.FAILED_LOGIN.code -> WepinLoginErrorCode.FailedLogin
      WepinError.ALREADY_LOGOUT.code -> WepinLoginErrorCode.AlreadyLogout
      WepinError.ALREADY_INITIALIZED_ERROR.code -> WepinLoginErrorCode.AlreadyInitialized
      WepinError.INVALID_EMAIL_DOMAIN.code -> WepinLoginErrorCode.InvalidEmailDomain
      WepinError.FAILED_SEND_EMAIL.code -> WepinLoginErrorCode.FailedSendEmail
      WepinError.REQUIRED_EMAIL_VERIFIED.code -> WepinLoginErrorCode.RequiredEmailVerified
      WepinError.INCORRECT_EMAIL_FORM.code -> WepinLoginErrorCode.IncorrectEmailForm
      WepinError.INCORRECT_PASSWORD_FORM.code -> WepinLoginErrorCode.IncorrectPasswordForm
      WepinError.NOT_INITIALIZED_NETWORK.code -> WepinLoginErrorCode.NotInitializedNetwork
      WepinError.REQUIRED_SIGNUP_EMAIL.code -> WepinLoginErrorCode.RequiredSignupEmail
      WepinError.FAILED_EMAIL_VERIFICATION.code -> WepinLoginErrorCode.FailedEmailVerified
      WepinError.FAILED_PASSWORD_STATE_SETTING.code -> WepinLoginErrorCode.FailedPasswordStateSetting
      WepinError.FAILED_PASSWORD_SETTING.code -> WepinLoginErrorCode.FailedPasswordSetting
      WepinError.EXISTED_EMAIL.code -> WepinLoginErrorCode.ExistedEmail
      WepinError.NOT_ACTIVITY.code -> WepinLoginErrorCode.NotActivity
      else -> WepinLoginErrorCode.UnknownError
    }

    return WepinLoginError(
      code = errorCode,
      message = error.errorMessage ?: error.message
    )
  }

  fun getCodeAndMessage(error: WepinError): Pair<String, String?> {
    val mapped = mapToLoginError(error)
    return Pair(mapped.code.code, mapped.message)
  }
}

data class WepinLoginError(
  val code: WepinLoginErrorCode,
  val message: String? = null
) {
  override fun toString(): String {
    return "WepinLoginError(code=${code.code}, message=$message)"
  }
}

enum class WepinLoginErrorCode(val code: String) {
  ApiRequestError("ApiRequestError"),
  InvalidParameters("InvalidParameters"),
  NotInitialized("NotInitialized"),
  InvalidAppKey("InvalidAppKey"),
  InvalidLoginProvider("InvalidLoginProvider"),
  InvalidToken("InvalidToken"),
  InvalidLoginSession("InvalidLoginSession"),
  UserCancelled("UserCancelled"),
  UnknownError("UnknownError"),
  NotConnectedInternet("NotConnectedInternet"),
  FailedLogin("FailedLogin"),
  AlreadyLogout("AlreadyLogout"),
  AlreadyInitialized("AlreadyInitialized"),
  InvalidEmailDomain("InvalidEmailDomain"),
  FailedSendEmail("FailedSendEmail"),
  RequiredEmailVerified("RequiredEmailVerified"),
  IncorrectEmailForm("IncorrectEmailForm"),
  IncorrectPasswordForm("IncorrectPasswordForm"),
  NotInitializedNetwork("NotInitializedNetwork"),
  RequiredSignupEmail("RequiredSignupEmail"),
  FailedEmailVerified("FailedEmailVerified"),
  FailedPasswordStateSetting("FailedPasswordStateSetting"),
  FailedPasswordSetting("FailedPasswordSetting"),
  ExistedEmail("ExistedEmail"),
  NotActivity("NotActivity")
}
