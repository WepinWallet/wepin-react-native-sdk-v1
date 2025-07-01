import Foundation
import WepinCommon
import WepinLogin
import WepinPin
import React


@objc(PinRn)
class PinRn: NSObject, RCTBridgeModule {
  private var wepinPin: WepinPin? = nil
  private var wepinLogin: WepinLogin? = nil
  
  static func moduleName() -> String! {
    return "PinRn"
  }
  
  func currentViewController() -> UIViewController? {
    // 현재 스레드가 메인 스레드가 아니면 메인 스레드에서 실행
    if Thread.isMainThread {
      return UIApplication.shared.delegate?.window??.rootViewController?.presentedViewController ?? UIApplication.shared.delegate?.window??.rootViewController
    } else {
      // 메인 스레드에서 동기적으로 실행하고 결과 반환
      var viewController: UIViewController?
      DispatchQueue.main.sync {
        viewController = UIApplication.shared.delegate?.window??.rootViewController?.presentedViewController ?? UIApplication.shared.delegate?.window??.rootViewController
      }
      return viewController
    }
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc(createWepinPin:withAppKey:)
  func createWepinPin(appId: String, appKey: String) {
    let params = WepinPinParams(appId: appId, appKey: appKey)
    wepinPin = WepinPin(params, platformType: "react")
  }
  
  @objc(initialize:withDefaultCurrency:withResolver:withRejecter:)
  func initialize(defaultLanguage: String, defaultCurrency: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinPin = self.wepinPin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    
    Task {
      do {
        let attributes = WepinPinAttributes(defaultLanguage: defaultLanguage, defaultCurrency: defaultCurrency)
        let result = try await wepinPin.initialize(attributes: attributes)
        wepinLogin = wepinPin.login
        resolve(result)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(isInitialized:withRejecter:)
  func isInitialized(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    let result = wepinLogin.isInitialized()
    resolve(result)
  }
  
  @objc(loginWithOauthProvider:withClientId:withResolver:withRejecter:)
  func loginWithOauthProvider(provider: String, clientId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    Task {
      do {
        let params = WepinLoginOauth2Params(provider: provider, clientId: clientId)
        guard let viewController = currentViewController() else {
          reject(WepinReactErrorCode.NotActivity.rawValue, "", nil)
          return
        }
        let result = try await wepinLogin.loginWithOauthProvider(params: params, viewController: viewController)
        // WepinLoginOauthResult를 Dictionary로 변환
        let resultDict: [String: Any] = [
          "provider": result.provider,
          "token": result.token,
          "type": result.type.rawValue
        ]
        
        resolve(resultDict)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(signUpWithEmailAndPassword:withPassword:withLocale:withResolver:withRejecter:)
  func signUpWithEmailAndPassword(email: String, password: String, locale: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    Task {
      do {
        let params = WepinLoginWithEmailParams(email: email, password: password, locale: locale)
        let result = try await wepinLogin.signUpWithEmailAndPassword(params: params)
        // WepinLoginResult를 Dictionary로 변환
        let resultDict: [String: Any] = [
          "provider": result.provider.rawValue,
          "token": [
            "idToken": result.token.idToken,
            "refreshToken": result.token.refreshToken
          ]
        ]
        
        resolve(resultDict)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(loginWithEmailAndPassword:withPassword:withResolver:withRejecter:)
  func loginWithEmailAndPassword(email: String, password: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    Task {
      do {
        let params = WepinLoginWithEmailParams(email: email, password: password)
        let result = try await wepinLogin.loginWithEmailAndPassword(params: params)
        // WepinLoginResult를 Dictionary로 변환
        let resultDict: [String: Any] = [
          "provider": result.provider.rawValue,
          "token": [
            "idToken": result.token.idToken,
            "refreshToken": result.token.refreshToken
          ]
        ]
        
        resolve(resultDict)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(loginWithIdToken:withResolver:withRejecter:)
  func loginWithIdToken(idToken: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    Task {
      do {
        let params = WepinLoginOauthIdTokenRequest(idToken: idToken)
        let result = try await wepinLogin.loginWithIdToken(params: params)
        // WepinLoginResult를 Dictionary로 변환
        let resultDict: [String: Any] = [
          "provider": result.provider.rawValue,
          "token": [
            "idToken": result.token.idToken,
            "refreshToken": result.token.refreshToken
          ]
        ]
        
        resolve(resultDict)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(loginWithAccessToken:withAccessToken:withResolver:withRejecter:)
  func loginWithAccessToken(provider: String, accessToken: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    Task {
      do {
        let params = WepinLoginOauthAccessTokenRequest(provider: provider, accessToken: accessToken)
        let result = try await wepinLogin.loginWithAccessToken(params: params)
        // WepinLoginResult를 Dictionary로 변환
        let resultDict: [String: Any] = [
          "provider": result.provider.rawValue,
          "token": [
            "idToken": result.token.idToken,
            "refreshToken": result.token.refreshToken
          ]
        ]
        
        resolve(resultDict)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(getRefreshFirebaseToken:withResolver:withRejecter:)
  func getRefreshFirebaseToken(prevToken: [String: Any]?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    Task {
      do {
        var loginResult: WepinLoginResult? = nil
        
        if let prevToken = prevToken,
           let providerStr = prevToken["provider"] as? String,
           let tokenDict = prevToken["token"] as? [String: String],
           let idToken = tokenDict["idToken"],
           let refreshToken = tokenDict["refreshToken"],
           let provider = WepinLoginProviders(rawValue: providerStr) {
          
          // WepinLoginResult 생성
          loginResult = WepinLoginResult(
            provider: provider,
            token: WepinFBToken(idToken: idToken, refreshToken: refreshToken)
          )
        }
        
        let result = try await wepinLogin.getRefreshFirebaseToken(prevFBToken: loginResult)
        let resultDict: [String: Any] = [
          "provider": result.provider.rawValue,
          "token": [
            "idToken": result.token.idToken,
            "refreshToken": result.token.refreshToken
          ]
        ]
        
        resolve(resultDict)
        
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(loginWepin:withResolver:withRejecter:)
  func loginWepin(params: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    guard let providerStr = params["provider"] as? String,
          let provider = WepinLoginProviders(rawValue: providerStr),
          let tokenDict = params["token"] as? [String: String],
          let idToken = tokenDict["idToken"],
          let refreshToken = tokenDict["refreshToken"] else {
      reject(WepinReactErrorCode.InvalidParameters.rawValue, "Invalid parameters for loginWepin", nil)
      return
    }
    
    // WepinLoginResult 생성
    let loginResult = WepinLoginResult(
      provider: provider,
      token: WepinFBToken(idToken: idToken, refreshToken: refreshToken)
    )
    Task {
      do {
        let user = try await wepinLogin.loginWepin(params: loginResult)
        
        // WepinUser 객체를 Dictionary로 변환
        let userDict = convertWepinUserToDict(user)
        resolve(userDict)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(getCurrentWepinUser:withRejecter:)
  func getCurrentWepinUser(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    Task {
      do {
        let result = try await wepinLogin.getCurrentWepinUser()
        let userDict = convertWepinUserToDict(result)
        resolve(userDict)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(logout:withRejecter:)
  func logout(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinLogin = self.wepinLogin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    Task {
      do {
        let result = try await wepinLogin.logoutWepin()
        resolve(result)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(finalize:withRejecter:)
  func finalize(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinPin = self.wepinPin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinLogin has not been created", nil)
      return
    }
    wepinPin.finalize()
    let res = wepinPin.isInitialized()
    if !res {
      resolve(true)
    } else {
      resolve(false)
    }
  }

  //MARK: - function for PIN

  @objc(changeLanguage:withResolver:withRejecter:)
  func changeLanguage(language: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinPin = self.wepinPin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinPin has not been created", nil)
      return
    }
    wepinPin.changeLanguage(language: language)
    resolve(true)
  }
  @objc(generateRegistrationPINBlock:withRejecter:)
  func generateRegistrationPINBlock(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinPin = self.wepinPin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinPin has not been created", nil)
      return
    }
    
    DispatchQueue.main.async {
      Task {
        do {
//          guard let viewController = self.currentViewController() else {
//                      reject(WepinReactErrorCode.NotActivity.rawValue, "Failed to get root view controller", nil)
//                      return
//                    }
          let result = try await wepinPin.generateRegistrationPINBlock()
          print("generateRegistrationPINBlock: \(result)")
          let resultDict = result?.toJSValue()
          resolve(resultDict)
        } catch {
          self.rejectWepinError(error, reject: reject)
        }
      }
    }
  }

  @objc(generateAuthPINBlock:withResolver:withRejecter:)
  func generateAuthPINBlock(count: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinPin = self.wepinPin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinPin has not been created", nil)
      return
    }
    DispatchQueue.main.async {
      Task {
        do {
//          guard let viewController = self.currentViewController() else {
//                      reject(WepinReactErrorCode.NotActivity.rawValue, "Failed to get root view controller", nil)
//                      return
//                    }
          print("count: \(count)")
          let intCount = count.intValue
                  print("count: \(intCount)")
          let result = try await wepinPin.generateAuthPINBlock(count: intCount)
          print("generateAuthPINBlock: \(result)")
          let resultDict = result?.toJSValue()
          resolve(resultDict)
        } catch {
          self.rejectWepinError(error, reject: reject)
        }
      }
    }
  }

  @objc(generateChangePINBlock:withRejecter:)
  func generateChangePINBlock(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinPin = self.wepinPin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinPin has not been created", nil)
      return
    }
    DispatchQueue.main.async {
      Task {
        do {
//          guard let viewController = self.currentViewController() else {
//                      reject(WepinReactErrorCode.NotActivity.rawValue, "Failed to get root view controller", nil)
//                      return
//                    }
          let result = try await wepinPin.generateChangePINBlock()
          print("generateChangePINBlock: \(result)")
          let resultDict = result?.toJSValue()
          resolve(resultDict)
        } catch {
          self.rejectWepinError(error, reject: reject)
        }
      }
    }
  }

  @objc(generateAuthOTPCode:withRejecter:)
  func generateAuthOTPCode(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinPin = self.wepinPin else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinPin has not been created", nil)
      return
    }
    DispatchQueue.main.async {
      Task {
        do {
//          guard let viewController = self.currentViewController() else {
//                      reject(WepinReactErrorCode.NotActivity.rawValue, "Failed to get root view controller", nil)
//                      return
//                    }
          let result = try await wepinPin.generateAuthOTPCode()
          print("generateAuthOTPCode: \(result)")
          let resultDict = result?.toJSValue()
          resolve(resultDict)
        } catch {
          self.rejectWepinError(error, reject: reject)
        }
      }
    }
  }
  
  private func rejectWepinError(_ error: Error, reject: RCTPromiseRejectBlock) {
    if error is WepinError {
      WepinErrorMapper.rejectWithError(error, reject: reject)
    } else {
      reject(WepinReactErrorCode.UnknownError.rawValue, error.localizedDescription, error as NSError)
    }
  }
  
  private func convertWepinUserToDict(_ user: WepinUser) -> [String: Any] {
      var userDict: [String: Any] = [
        "status": user.status
      ]
      
      // userInfo가 있다면 추가
      if let userInfo = user.userInfo {
        userDict["userInfo"] = [
          "userId": userInfo.userId,
          "email": userInfo.email,
          "provider": userInfo.provider.rawValue,
          "use2FA": userInfo.use2FA
        ]
      }
      
      // walletId가 있다면 추가
      if let walletId = user.walletId {
        userDict["walletId"] = walletId
      }
      
      // userStatus가 있다면 추가
      if let userStatus = user.userStatus {
        userDict["userStatus"] = [
          "loginStatus": userStatus.loginStatus.rawValue,
          "pinRequired": userStatus.pinRequired as Any
        ]
      }
      
      // token이 있다면 추가
      if let token = user.token {
        userDict["token"] = [
          "access": token.access,
          "refresh": token.refresh
        ]
      }
      
      return userDict
    }
}

extension EncUVD {
  func toJSValue() -> [String: Any] {
    var uvdDict: [String: Any] = [
      "b64SKey": self.b64SKey,
      "b64Data": self.b64Data
    ]
    
    if let seqNum = self.seqNum {
      uvdDict["seqNum"] = seqNum
    }
    
    return uvdDict
  }
}

extension EncPinHint {
  func toJSValue() -> [String: Any] {
    return [
      "version": self.version,
      "length": self.length,
      "data": self.data
    ]
  }
}

extension RegistrationPinBlock {
  func toJSValue() -> [String: Any] {
    return [
      "uvd": self.uvd.toJSValue(),
      "hint": self.hint.toJSValue()
    ]
  }
}

extension AuthPinBlock {
  func toJSValue() -> [String: Any] {
    var authDict: [String: Any] = [
      "uvdList": self.uvdList.compactMap{ uvd -> [String: Any] in
        return uvd.toJSValue()
      }
    ]
    
    if let otp = self.otp {
      authDict["otp"] = otp
    }
    
    return authDict
  }
}

extension ChangePinBlock {
  func toJSValue() -> [String: Any] {
    var changeDict: [String: Any] = [
      "uvd": self.uvd.toJSValue(),
      "newUVD": self.newUVD.toJSValue(),
      "hint": self.hint.toJSValue()
    ]
    
    if let otp = self.otp {
      changeDict["otp"] = otp
    }
    
    return changeDict
  }
}

extension AuthOTP {
  func toJSValue() -> [String: Any] {
    return [
      "code": self.code
    ]
  }
}
