import Foundation
import WepinCommon
import WepinLogin
import WepinWidget
import React


@objc(SdkRn)
class SdkRn: NSObject, RCTBridgeModule {
  private var wepinWidget: WepinWidget? = nil
  private var wepinLogin: WepinLogin? = nil
  
  static func moduleName() -> String! {
    return "SdkRn"
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
  
  @objc(createWepinWidget:withAppKey:)
  func createWepinWidget(appId: String, appKey: String) {
    let params = WepinWidgetParams(viewController: currentViewController(), appId: appId, appKey: appKey)
    wepinWidget = WepinWidget(wepinWidgetParams: params, platformType: "react")
  }
  
  @objc(initialize:withDefaultCurrency:withResolver:withRejecter:)
  func initialize(defaultLanguage: String, defaultCurrency: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    
    Task {
      do {
        let attributes = WepinWidgetAttribute(defaultLanguage: defaultLanguage, defaultCurrency: defaultCurrency)
        let result = try await wepinWidget.initialize(attributes: attributes)
        wepinLogin = wepinWidget.login
        resolve(result)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(isInitialized:withRejecter:)
  func isInitialized(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    let result = wepinWidget.isInitialized()
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
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    Task{
      do {
        _ = try await wepinWidget.finalize()
        let res = wepinWidget.isInitialized()
        if !res {
          resolve(true)
        } else {
          resolve(false)
        }
      } catch {
        resolve(false)
      }
    }
  }
  
  //MARK: - function for widget
  @objc(changeLanguage:withCurrency:withResolver:withRejecter:)
  func changeLanguage(language: String, currency: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    wepinWidget.changeLanguage(language)
    resolve(true)
  }
  
  @objc(getStatus:withRejecter:)
  func getStatus(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    Task {
      do {
        let result = try await wepinWidget.getStatus()
        resolve(result.toJSValue())
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(openWidget:withRejecter:)
  func openWidget(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    Task {
      do {
        guard let viewController = currentViewController() else {
          reject(WepinReactErrorCode.NotActivity.rawValue, "", nil)
          return
        }
        let result = try await wepinWidget.openWidget(viewController: viewController)
        resolve(result)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(closeWidget:withRejecter:)
  func closeWidget(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    Task {
      do {
        try wepinWidget.closeWidget()
        resolve(true)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(loginWithUI:withEmail:withResolver:withRejecter:)
  func loginWithUI(loginProviders: [[String: Any]], email: String?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    Task {
      do {
        guard let viewController = currentViewController() else {
          reject(WepinReactErrorCode.NotActivity.rawValue, "", nil)
          return
        }
        // 변환 로직: [[String: Any]] -> [LoginProviderInfo]
        let params = loginProviders.compactMap { providerDict -> LoginProviderInfo? in
          guard let provider = providerDict["provider"] as? String,
                let clientId = providerDict["clientId"] as? String else {
            return nil
          }
          
          let clientSecret = providerDict["clientSecret"] as? String
          return LoginProviderInfo(provider: provider, clientId: clientId, clientSecret: clientSecret)
        }
        
        let result = try await wepinWidget.loginWithUI(viewController: viewController, loginProviders: params, email: email)
        resolve(convertWepinUserToDict(result))
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(register:withRejecter:)
  func register(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    Task {
      do {
        guard let viewController = currentViewController() else {
          reject(WepinReactErrorCode.NotActivity.rawValue, "", nil)
          return
        }
        let result = try await wepinWidget.register(viewController: viewController)
        resolve(convertWepinUserToDict(result))
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(send:withTxData:withResolver:withRejecter:)
  func send(account: [String: Any], txData: [String: Any]?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    
    // This is already using DispatchQueue.main which is good, but let's make some improvements
    DispatchQueue.main.async {
      Task {
        do {
          // The issue might be with how we're getting the view controller
          guard let viewController = self.currentViewController() else {
            reject(WepinReactErrorCode.NotActivity.rawValue, "Failed to get root view controller", nil)
            return
          }
          
          // Convert parameters as before...
          guard let network = account["network"] as? String,
                let address = account["address"] as? String else {
            reject(WepinReactErrorCode.InvalidParameters.rawValue, "Invalid account data", nil)
            return
          }
          
          let contract = account["contract"] as? String
          let isAA = account["isAA"] as? Bool ?? false
          
          let wepinAccount = WepinAccount(
            network: network,
            address: address,
            contract: contract,
            isAA: isAA
          )
          
          var wepinTxData: WepinTxData? = nil
          if let txDataDict = txData {
            guard let toAddress = txDataDict["toAddress"] as? String,
                  let amount = txDataDict["amount"] as? String else {
              reject(WepinReactErrorCode.InvalidParameters.rawValue, "Invalid txData", nil)
              return
            }
            
            wepinTxData = WepinTxData(toAddress: toAddress, amount: amount)
          }
          
          // Add a short delay to ensure the view controller is fully initialized
          try await Task.sleep(nanoseconds: 100_000_000) // 100ms delay
          
          let result = try await wepinWidget.send(viewController: viewController, account: wepinAccount, txData: wepinTxData)
          let resultDict: [String: Any] = ["txId": result.txId]
          resolve(resultDict)
        } catch {
          self.rejectWepinError(error, reject: reject)
        }
      }
    }
  }
  
  @objc(receive:withResolver:withRejecter:)
  func receive(account: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    
    // Move this to the main thread like in the send function
    DispatchQueue.main.async {
      Task {
        do {
          guard let viewController = self.currentViewController() else {
            reject(WepinReactErrorCode.NotActivity.rawValue, "Failed to get root view controller", nil)
            return
          }
          
          guard let network = account["network"] as? String,
                let address = account["address"] as? String else {
            reject(WepinReactErrorCode.InvalidParameters.rawValue, "Invalid account data", nil)
            return
          }
          
          let contract = account["contract"] as? String
          let isAA = account["isAA"] as? Bool ?? false
          
          let wepinAccount = WepinAccount(
            network: network,
            address: address,
            contract: contract,
            isAA: isAA
          )
          
          // Add a short delay to ensure the view controller is fully initialized
          try await Task.sleep(nanoseconds: 100_000_000) // 100ms delay
          
          let result = try await wepinWidget.receive(viewController: viewController, account: wepinAccount)
          let resultDict: [String: Any] = [
            "account": result.account.toJSValue()
          ]
          resolve(resultDict)
        } catch {
          self.rejectWepinError(error, reject: reject)
        }
      }
    }
  }
  
  @objc(getAccounts:withEoa:withResolver:withRejecter:)
  func getAccounts(networks: [String]?, withEoa: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    Task {
      do {
        let result = try await wepinWidget.getAccounts(networks: networks, withEoa: withEoa)
        let resultDict = result.compactMap { account -> [String: Any]? in
          return account.toJSValue()
        }
        resolve(resultDict)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(getBalance:withResolver:withRejecter:)
  func getBalance(accounts: [[String: Any]]?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    Task {
      do {
        let wepinAccounts: [WepinAccount]? = accounts?.compactMap { accountDict -> WepinAccount? in
          guard let network = accountDict["network"] as? String,
                let address = accountDict["address"] as? String else {
            reject(WepinReactErrorCode.InvalidParameters.rawValue, "Invalid account data: network and address are required", nil)
            return nil
          }
          
          let contract = accountDict["contract"] as? String
          let isAA = accountDict["isAA"] as? Bool ?? false
          
          return WepinAccount(
            network: network,
            address: address,
            contract: contract,
            isAA: isAA
          )
        }
        let result = try await wepinWidget.getBalance(accounts: wepinAccounts)
        let resultDict = result.compactMap { balanceInfo -> [String: Any] in
          return balanceInfo.toJSValue()
        }
        resolve(resultDict)
      } catch {
        rejectWepinError(error, reject: reject)
      }
    }
  }
  
  @objc(getNFTs:withNetworks:withResolver:withRejecter:)
  func getNFTs(refresh: Bool, networks: [String]?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let wepinWidget = self.wepinWidget else {
      reject(WepinReactErrorCode.NotInitialized.rawValue, "WepinWidget has not been created", nil)
      return
    }
    Task {
      do {
        let result = try await wepinWidget.getNFTs(refresh: refresh, networks: networks)
        let resultDict = result.compactMap { nft -> [String: Any] in
          return nft.toJSValue()
        }
        resolve(resultDict)
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

extension WepinLifeCycle {
  /// JavaScript에 전달할 string 값으로 변환하는 함수
  func toJSValue() -> String {
    switch self {
    case .notInitialized:
      return "not_initialized"
    case .initializing:
      return "initializing"
    case .initialized:
      return "initialized"
    case .beforeLogin:
      return "before_login"
    case .login:
      return "login"
    case .loginBeforeRegister:
      return "login_before_register"
    }
  }
}

extension WepinAccount {
  func toJSValue() -> [String: Any] {
    var accountDict: [String: Any] = [
      "network": self.network,
      "address": self.address
    ]
    
    // contract가 nil이 아닐 때만 추가
    if let contract = self.contract {
      accountDict["contract"] = contract
    }
    
    // isAA가 nil이 아닐 때만 추가
    if let isAA = self.isAA {
      accountDict["isAA"] = isAA
    }
    
    return accountDict
  }
}

extension WepinAccountBalanceInfo {
  func toJSValue() -> [String: Any] {
    let tokensDict: [[String: Any]] = self.tokens.compactMap {token -> [String: Any] in
      return [
        "contract": token.contract,
        "symbol": token.symbol,
        "balance": token.balance
      ]
    }
    
    let accountBalanceInfo = [
      "network": self.network,
      "address": self.address,
      "symbol": self.symbol,
      "balance": self.balance,
      "tokens": tokensDict
    ] as [String : Any]
    
    return accountBalanceInfo
  }
}

extension WepinNFTContract {
  func toJSValue() -> [String: Any] {
    var resultDict = [
      "name": self.name,
      "address": self.address,
      "scheme": self.scheme,
      "network": self.network,
    ]
    
    if let description = self.description {
      resultDict["contract"] = description
    }
    
    if let externalLink = self.externalLink {
      resultDict["externalLink"] = externalLink
    }
    
    if let imageUrl = self.imageUrl {
      resultDict["imageUrl"] = imageUrl
    }
    
    return resultDict
  }
}

extension WepinNFT {
  func toJSValue() -> [String: Any] {
    var resultDict = [
      "account": self.account.toJSValue(),
      "contract": self.contract.toJSValue(),
      "name": self.name,
      "description": self.description,
      "externalLink": self.externalLink,
      "imageUrl": self.imageUrl,
      "contentType": self.contentType,
      "state": self.state
    ] as [String: Any]
    
    if let contentUrl = self.contentUrl {
      resultDict["contentUrl"] = contentUrl
    }
    if let quantity = self.quantity {
      resultDict["quantity"] = quantity
    }
    return resultDict
  }
}
