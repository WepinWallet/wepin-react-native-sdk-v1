package com.wepin.pinrn.error

import com.wepin.android.commonlib.error.WepinError

object WepinErrorMapper {
  private fun mapToLoginError(error: WepinError): WepinReactError {
    val errorCode = when (error.getErrorCode()) {
      WepinError.API_REQUEST_ERROR.code -> WepinReactErrorCode.ApiRequestError
      WepinError.INVALID_PARAMETER.code -> WepinReactErrorCode.InvalidParameters
      WepinError.NOT_INITIALIZED_ERROR.code -> WepinReactErrorCode.NotInitialized
      WepinError.INVALID_APP_KEY.code -> WepinReactErrorCode.InvalidAppKey
      WepinError.INVALID_LOGIN_PROVIDER.code -> WepinReactErrorCode.InvalidLoginProvider
      WepinError.INVALID_TOKEN.code -> WepinReactErrorCode.InvalidToken
      WepinError.INVALID_LOGIN_SESSION.code -> WepinReactErrorCode.InvalidLoginSession
      WepinError.USER_CANCELED.code -> WepinReactErrorCode.UserCancelled
      WepinError.NOT_CONNECTED_INTERNET.code -> WepinReactErrorCode.NotConnectedInternet
      WepinError.FAILED_LOGIN.code -> WepinReactErrorCode.FailedLogin
      WepinError.ALREADY_LOGOUT.code -> WepinReactErrorCode.AlreadyLogout
      WepinError.ALREADY_INITIALIZED_ERROR.code -> WepinReactErrorCode.AlreadyInitialized
      WepinError.INVALID_EMAIL_DOMAIN.code -> WepinReactErrorCode.InvalidEmailDomain
      WepinError.FAILED_SEND_EMAIL.code -> WepinReactErrorCode.FailedSendEmail
      WepinError.REQUIRED_EMAIL_VERIFIED.code -> WepinReactErrorCode.RequiredEmailVerified
      WepinError.INCORRECT_EMAIL_FORM.code -> WepinReactErrorCode.IncorrectEmailForm
      WepinError.INCORRECT_PASSWORD_FORM.code -> WepinReactErrorCode.IncorrectPasswordForm
      WepinError.NOT_INITIALIZED_NETWORK.code -> WepinReactErrorCode.NotInitializedNetwork
      WepinError.REQUIRED_SIGNUP_EMAIL.code -> WepinReactErrorCode.RequiredSignupEmail
      WepinError.FAILED_EMAIL_VERIFICATION.code -> WepinReactErrorCode.FailedEmailVerified
      WepinError.FAILED_PASSWORD_STATE_SETTING.code -> WepinReactErrorCode.FailedPasswordStateSetting
      WepinError.FAILED_PASSWORD_SETTING.code -> WepinReactErrorCode.FailedPasswordSetting
      WepinError.EXISTED_EMAIL.code -> WepinReactErrorCode.ExistedEmail
      WepinError.NOT_ACTIVITY.code -> WepinReactErrorCode.NotActivity
      else -> WepinReactErrorCode.UnknownError
    }

    return WepinReactError(
      code = errorCode,
      message = error.errorMessage ?: error.message
    )
  }

  fun getCodeAndMessage(error: WepinError): Pair<String, String?> {
    val mapped = mapToLoginError(error)
    return Pair(mapped.code.code, mapped.message)
  }
}

data class WepinReactError(
  val code: WepinReactErrorCode,
  val message: String? = null
) {
  override fun toString(): String {
    return "WepinLoginError(code=${code.code}, message=$message)"
  }
}

enum class WepinReactErrorCode(val code: String) {
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
