import Foundation
import WepinCommon

internal class WepinErrorMapper {
  // WepinError(Swift)를 React Native 에러 코드와 메시지로 변환하는 메서드
  static func getCodeAndMessage(_ error: Error) -> (String, String) {
    // WepinError 타입으로 캐스팅 가능한 경우
    if let wepinError = error as? WepinError {
      let loginError = mapToLoginError(wepinError)
      return (loginError.code.rawValue, loginError.message)
    }
    
    // 그 외 일반 에러
    return (WepinReactErrorCode.UnknownError.code, error.localizedDescription)
  }
  
  // WepinError를 React Native에서 사용할 수 있는 에러 형식으로 변환
  private static func mapToLoginError(_ error: WepinError) -> WepinReactError {
    let errorCode: WepinReactErrorCode
    
    switch error {
    case .alreadyInitialized:
      errorCode = .AlreadyInitialized
    case .alreadyLogout:
      errorCode = .AlreadyLogout
    case .apiRequestError:
      errorCode = .ApiRequestError
    case .invalidParameter:
      errorCode = .InvalidParameters
    case .notInitialized:
      errorCode = .NotInitialized
    case .invalidAppKey:
      errorCode = .InvalidAppKey
    case .invalidLoginProvider:
      errorCode = .InvalidLoginProvider
    case .invalidToken:
      errorCode = .InvalidToken
    case .invalidLoginSession, .invalidLoginSessionSimple:
      errorCode = .InvalidLoginSession
    case .userCanceled:
      errorCode = .UserCancelled
    case .notConnectedInternet:
      errorCode = .NotConnectedInternet
    case .loginFailed:
      errorCode = .FailedLogin
    case .requiredEmailVerified:
      errorCode = .RequiredEmailVerified
    case .incorrectEmailForm:
      errorCode = .IncorrectEmailForm
    case .incorrectPasswordForm:
      errorCode = .IncorrectPasswordForm
    case .networkNotInitialized:
      errorCode = .NotInitializedNetwork
    case .requiredSignupEmail:
      errorCode = .RequiredSignupEmail
    case .failedEmailVerification:
      errorCode = .FailedEmailVerified
    case .failedPasswordStateSetting:
      errorCode = .FailedPasswordStateSetting
    case .failedPasswordSetting:
      errorCode = .FailedPasswordSetting
    case .existedEmail:
      errorCode = .ExistedEmail
    case .deprecated:
      errorCode = .Deprecated
    case .invalidViewController:
      errorCode = .NotActivity
    case .invalidEmailDomain:
      errorCode = .InvalidEmailDomain
    case .failedSendEmail:
      errorCode = .FailedSendEmail
    default:
      errorCode = .UnknownError
    }
    
    return WepinReactError(code: errorCode, message: error.errorDescription ?? "Unknown error")
  }
  
  // React Native 에러 처리를 위해 WepinError를 RCTPromiseRejectBlock으로 변환
  static func rejectWithError(_ error: Error, reject: RCTPromiseRejectBlock) {
    let (code, message) = getCodeAndMessage(error)
    reject(code, message, error as NSError)
  }
}

// React Native에서 사용할 에러 코드
enum WepinReactErrorCode: String {
  case ApiRequestError = "ApiRequestError"
  case InvalidParameters = "InvalidParameters"
  case NotInitialized = "NotInitialized"
  case InvalidAppKey = "InvalidAppKey"
  case InvalidLoginProvider = "InvalidLoginProvider"
  case InvalidToken = "InvalidToken"
  case InvalidLoginSession = "InvalidLoginSession"
  case UserCancelled = "UserCancelled"
  case NotConnectedInternet = "NotConnectedInternet"
  case FailedLogin = "FailedLogin"
  case AlreadyLogout = "AlreadyLogout"
  case AlreadyInitialized = "AlreadyInitialized"
  case InvalidEmailDomain = "InvalidEmailDomain"
  case FailedSendEmail = "FailedSendEmail"
  case RequiredEmailVerified = "RequiredEmailVerified"
  case IncorrectEmailForm = "IncorrectEmailForm"
  case IncorrectPasswordForm = "IncorrectPasswordForm"
  case NotInitializedNetwork = "NotInitializedNetwork"
  case RequiredSignupEmail = "RequiredSignupEmail"
  case FailedEmailVerified = "FailedEmailVerified"
  case FailedPasswordStateSetting = "FailedPasswordStateSetting"
  case FailedPasswordSetting = "FailedPasswordSetting"
  case ExistedEmail = "ExistedEmail"
  case NotActivity = "NotActivity"
  case Deprecated = "Deprecated"
  case UnknownError = "UnknownError"
  
  var code: String {
    return self.rawValue
  }
}

// 변환된 에러 모델
struct WepinReactError {
  let code: WepinReactErrorCode
  let message: String
}
