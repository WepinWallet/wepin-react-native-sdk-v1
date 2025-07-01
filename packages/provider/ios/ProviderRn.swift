import Foundation
import WepinCommon
import WepinLogin
import WepinProvider
import React


@objc(ProviderRn)
class ProviderRn: NSObject, RCTBridgeModule {
  private var wepinProvider: WepinProvider? = nil
  private var wepinLogin: WepinLogin? = nil
  
  private var provider: BaseProvider? = nil
  
  static func moduleName() -> String! {
    return "ProviderRn"
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
  
  @objc(createWepinProvider:withAppKey:)
  func createWepinProvider(appId: String, appKey: String) {
    let params = WepinProviderParams(appId: appId, appKey: appKey)
    wepinProvider = WepinProvider(params, platformType: "react")
  }
  
  @objc(initialize:withDefaultCurrency:withResolver:withRejecter:)
  func initialize(defaultLanguage: String, defaultCurrency: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinProvider = self.wepinProvider else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinProvider has not been created", nil)
      return
    }
    
    Task {
      do {
        let attributes = WepinProviderAttributes(defaultLanguage: defaultLanguage, defaultCurrency: defaultCurrency)
        let result = try await wepinProvider.initialize(attributes: attributes)
        wepinLogin = wepinProvider.login
        resolve(result)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(isInitialized:withRejecter:)
  func isInitialized(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinProvider = self.wepinProvider else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinProvider has not been created", nil)
      return
    }
    let result = wepinProvider.isInitialized()
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
    guard let wepinProvider = self.wepinProvider else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinProvider has not been created", nil)
      return
    }
    provider = nil
    wepinProvider.finalize()
    let res = wepinProvider.isInitialized()
    if !res {
      //      self.wepinProvider = nil
      self.wepinLogin = nil
      resolve(true)
    } else {
      resolve(false)
    }
  }
  
  @objc(getProvider:withResolver:withRejecter:)
  func getProvider(network: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinProvider = self.wepinProvider else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinProvider has not been created", nil)
      return
    }
    
    guard let networkFamily = ProviderNetworkInfo.shared.getNetworkFamilyByNetwork(network) else {
      reject(WepinReactErrorCode.InvalidParameters.rawValue, "Invalid Network", nil)
      return
    }
    
    Task {
      do {
//        let viewController = currentViewController()
        provider = try wepinProvider.getProvider(network: network)
        resolve(network)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(request:withMethod:withParams:withResolver:withRejecter:)
  func request(network: String, method: String, params: [Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinProvider = self.wepinProvider else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinProvider has not been created", nil)
      return
    }
    
    guard let networkFamily = ProviderNetworkInfo.shared.getNetworkFamilyByNetwork(network) else {
      reject(WepinReactErrorCode.InvalidParameters.rawValue, "Invalid Network", nil)
      return
    }
    
    guard let provider = provider else {
      reject(WepinReactErrorCode.InvalidParameters.rawValue, "Before getProvider", nil)
      return
    }
    Task {
      do {
        let result = try await provider.request(method: method, params: params)
        resolve(result)
      } catch {
        rejectWepinError(error, reject: reject)
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
  
  private func rejectWithEVMError(_ error: Error, reject: RCTPromiseRejectBlock) {
    
    // 에러를 표준 형식으로 변환
    let errorDict = ErrorMapper.mapToEthRpcError(error)
    let code = errorDict["code"] as! Int
    let message = errorDict["message"] as! String
    
    // NSError 생성
    let nsError = NSError(
      domain: "EthRpcError",
      code: code,
      userInfo: [
        NSLocalizedDescriptionKey: message,
        "code": code,
        "message": message
      ]
    )
    
    // React Native에 에러 전달
    reject(String(code), message, nsError)
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
