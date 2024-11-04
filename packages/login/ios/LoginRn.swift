import Foundation
import AppAuth
import AuthenticationServices
import React


@objc(LoginRn)
class LoginRn: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "LoginRn"
    }
    
    func currentViewController() -> UIViewController? {
        return UIApplication.shared.delegate?.window??.rootViewController?.presentedViewController ?? UIApplication.shared.delegate?.window??.rootViewController
    }
//    var authorizationFlowManagerDelegate: RNAppAuthFlowManagerDelegate!
    

  private var currentSession: OIDExternalUserAgentSession?

  @objc func resumeExternalUserAgentFlow(with url: URL) -> Bool {
        return currentSession?.resumeExternalUserAgentFlow(with: url) ?? false
    }

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

  private var rnAppAuthTaskId: UIBackgroundTaskIdentifier = UIBackgroundTaskIdentifier.invalid

  private static let kStateSizeBytes = 32
  private static let kCodeVerifierBytes = 32
  private var authSession: ASWebAuthenticationSession?

  @objc(authorize:withRedirectUrl:withClientId:withScopes:withAdditionalParameters:withServiceConfiguration:withSkipCodeExchange:withConnectionTimeoutSeconds:withAdditionalHeaders:withIosCustomBrowser:withPrefersEphemeralSession:withResolver:withRejecter:)
  func authorize(
          wepinAppId: String,
          redirectUrl: String,
          clientId: String,
          scopes: [String],
          additionalParameters: [String: String]?,
          serviceConfiguration: [String: Any]?,
          skipCodeExchange: Bool,
          connectionTimeoutSeconds: Double,
          additionalHeaders: [String: Any]?,
          iosCustomBrowser: String?,
          prefersEphemeralSession: Bool,
          resolve: @escaping RCTPromiseResolveBlock,
          reject: @escaping RCTPromiseRejectBlock
  ) {
//      resolve("Hello")
//      return 
      configureUrlSession(additionalHeaders: additionalHeaders, sessionTimeout: connectionTimeoutSeconds)

      let configuration = createServiceConfiguration(serviceConfiguration!)
      authorizeWithConfiguration(
        wepinAppId: wepinAppId,
        configuration: configuration,
        redirectUrl: redirectUrl,
        clientId: clientId,
        scopes: scopes,
        additionalParameters: additionalParameters,
        skipCodeExchange: skipCodeExchange,
        iosCustomBrowser: iosCustomBrowser,
        prefersEphemeralSession: prefersEphemeralSession,
        resolve: resolve,
        reject: reject
      )
  }

  private func configureUrlSession(additionalHeaders: [String: Any]?, sessionTimeout: Double) {
      // URLSession configuration code
  }

  private func createServiceConfiguration(_ serviceConfiguration: [String: Any]) -> OIDServiceConfiguration {
    // Create OIDServiceConfiguration from the dictionary
    let authorizationEndpoint = URL(string: serviceConfiguration["authorizationEndpoint"] as! String)!
    let tokenEndpoint = URL(string: serviceConfiguration["tokenEndpoint"] as! String)!
    let registrationEndpoint = URL(string: serviceConfiguration["registrationEndpoint"] as? String ?? "")
    let endSessionEndpoint = URL(string: serviceConfiguration["endSessionEndpoint"] as? String ?? "")

    let configuration = OIDServiceConfiguration(
        authorizationEndpoint: authorizationEndpoint,
        tokenEndpoint: tokenEndpoint,
        issuer: nil,
        registrationEndpoint: registrationEndpoint,
        endSessionEndpoint: endSessionEndpoint
    )

    return configuration
  }

  private static func generateCodeVerifier() -> String? {
      return OIDTokenUtilities.randomURLSafeString(withSize: UInt(kCodeVerifierBytes))
  }

  private static func generateState() -> String? {
      return OIDTokenUtilities.randomURLSafeString(withSize: UInt(kStateSizeBytes))
  }

  private static func codeChallengeS256(for codeVerifier: String) -> String? {
//    guard let codeVerifierData = codeVerifier.data(using: .ascii) else {
//        return nil
//    }
    let sha256Verifier = OIDTokenUtilities.sha256(codeVerifier)
    return OIDTokenUtilities.encodeBase64urlNoPadding(sha256Verifier)
  }

  /*
  * Authorize a user in exchange for a token with provided OIDServiceConfiguration
  */
  private func authorizeWithConfiguration(
    wepinAppId: String,
    configuration: OIDServiceConfiguration,
    redirectUrl: String,
    clientId: String,
    scopes: [String],
    additionalParameters: [String: String]?,
    skipCodeExchange: Bool,
    iosCustomBrowser: String?,
    prefersEphemeralSession: Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
) {
    let codeVerifier = Self.generateCodeVerifier()
    let codeChallenge = Self.codeChallengeS256(for: codeVerifier!)
    let state = additionalParameters?["state"] as? String ?? Self.generateState()
    var parameter = additionalParameters
    
    if ((additionalParameters?["state"] as? String) != nil){  parameter?.removeValue(forKey: "state") }
    
    // builds authentication request
    let request = OIDAuthorizationRequest(
        configuration: configuration,
        clientId: clientId,
        clientSecret: nil,
        scope: OIDScopeUtilities.scopes(with: scopes),
        redirectURL: URL(string: redirectUrl)!,
        responseType: OIDResponseTypeCode,
        state: additionalParameters?["state"] as? String ?? Self.generateState(),
        nonce: nil,
        codeVerifier: codeVerifier,
        codeChallenge: codeChallenge,
        codeChallengeMethod: OIDOAuthorizationRequestCodeChallengeMethodS256,
        additionalParameters: additionalParameters
    )

    // performs authentication request
//    guard let appDelegate = UIApplication.shared.delegate as? (UIApplicationDelegate & RNAppAuthFlowManager) else {
//        NSException(name: NSExceptionName(rawValue: "RNAppAuth Missing protocol conformance"),
//                    reason: "\(String(describing: UIApplication.shared.delegate)) does not conform to RNAppAuthFlowManager",
//                    userInfo: nil).raise()
//        return
//    }
//
//    appDelegate.authorizationFlowManagerDelegate = self
    weak var weakSelf = self

    rnAppAuthTaskId = UIApplication.shared.beginBackgroundTask {
        if self.rnAppAuthTaskId != UIBackgroundTaskIdentifier.invalid {
            UIApplication.shared.endBackgroundTask(self.rnAppAuthTaskId)
            self.rnAppAuthTaskId = UIBackgroundTaskIdentifier.invalid
        }
    }

    let presentingViewController = currentViewController()

    #if targetEnvironment(macCatalyst)
    let externalUserAgent: OIDExternalUserAgent? = nil
    #else
    let externalUserAgent = iosCustomBrowser != nil ? getCustomBrowser(iosCustomBrowser!) : nil
    #endif

    let callback: OIDAuthorizationCallback = { authorizationResponse, error in
        guard let strongSelf = weakSelf else { return }
        strongSelf.currentSession = nil
        if strongSelf.rnAppAuthTaskId != UIBackgroundTaskIdentifier.invalid {
            UIApplication.shared.endBackgroundTask(strongSelf.rnAppAuthTaskId)
            strongSelf.rnAppAuthTaskId = UIBackgroundTaskIdentifier.invalid
        }
        if let authorizationResponse = authorizationResponse {
            resolve(self.formatAuthorizationResponse(authorizationResponse, withCodeVerifier: codeVerifier))
        } else {
            reject(self.getErrorCode(error! as NSError, defaultCode: "authentication_failed"),
                   self.getErrorMessage(error! as NSError), error)
        }
    }
    
    let tokenCallback: OIDTokenCallback = { authState, error in
        guard let strongSelf = weakSelf else { return }
        strongSelf.currentSession = nil
        if strongSelf.rnAppAuthTaskId != UIBackgroundTaskIdentifier.invalid {
            UIApplication.shared.endBackgroundTask(strongSelf.rnAppAuthTaskId)
            strongSelf.rnAppAuthTaskId = UIBackgroundTaskIdentifier.invalid
        }
        if let authState = authState {
            resolve(self.formatResponse(authState))
        } else {
            reject(self.getErrorCode(error! as NSError, defaultCode: "authentication_failed"),
                   self.getErrorMessage(error! as NSError), error)
        }
    }

    let presentationContextProvider = WepinPresentationContextProvider(window: presentingViewController!.view.window)
    self.authSession = ASWebAuthenticationSession(url: request.externalUserAgentRequestURL(),
                                                  callbackURLScheme:  "wepin.\(wepinAppId)") { callbackURL, error in
        
        guard let strongSelf = weakSelf else { return }
        strongSelf.currentSession = nil
        if strongSelf.rnAppAuthTaskId != UIBackgroundTaskIdentifier.invalid {
            UIApplication.shared.endBackgroundTask(strongSelf.rnAppAuthTaskId)
            strongSelf.rnAppAuthTaskId = UIBackgroundTaskIdentifier.invalid
        }
        if let callbackURL = callbackURL {
            // Handle the callback URL and process the authentication response
            let authResponse = OIDAuthorizationResponse(request: request, parameters: OIDURLQueryComponent(url: callbackURL)!.dictionaryValue)
            let authState = OIDAuthState(authorizationResponse: authResponse)
            
            if !skipCodeExchange {
                // Exchange authorization code for access token
                if let authorizationCode = authState.lastAuthorizationResponse.authorizationCode, let codeVerifier = authState.lastAuthorizationResponse.request.codeVerifier {
                    let tokenRequest = OIDTokenRequest(
                        configuration: configuration,
                        grantType: OIDGrantTypeAuthorizationCode,
                        authorizationCode: authorizationCode,
                        redirectURL: request.redirectURL,
                        clientID: clientId,
                        clientSecret: nil,
                        scope: request.scope,
                        refreshToken: nil,
                        codeVerifier: codeVerifier,
                        additionalParameters: nil)
                    
                    OIDAuthorizationService.perform(tokenRequest, callback: tokenCallback)
                } else {
                    reject(self.getErrorCode(error! as NSError, defaultCode: "Missing authorization code or code verifier"),
                           self.getErrorMessage(error! as NSError), error)
                }
            } else {
                callback(authState.lastAuthorizationResponse, error)
                
            }
            
        } else if let error = error {
            // guard let strongSelf = weakSelf else { return }
            // strongSelf.currentSession = nil
            reject(self.getErrorCode(error as NSError, defaultCode: "authentication_failed"),
                   self.getErrorMessage(error as NSError), error)
        } else {
            // guard let strongSelf = weakSelf else { return }
            // strongSelf.currentSession = nil
            reject( "authentication_failed",
                   "unkonw", error)
        }
    }

    if let authSession = authSession {
        authSession.presentationContextProvider = presentationContextProvider
        authSession.start()
    }
  }
  /*
 * Take raw OIDAuthorizationResponse and turn it to response format to pass to JavaScript caller
 */
func formatAuthorizationResponse(_ response: OIDAuthorizationResponse, withCodeVerifier codeVerifier: String?) -> [String: Any] {
    let dateFormatter = DateFormatter()
    dateFormatter.timeZone = TimeZone(abbreviation: "UTC")
    dateFormatter.locale = Locale(identifier: "en_US_POSIX")
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
    
    var result: [String: Any] = [
        "authorizationCode": response.authorizationCode ?? "",
        "state": response.state ?? "",
        "accessToken": response.accessToken ?? "",
        "accessTokenExpirationDate": response.accessTokenExpirationDate != nil ? dateFormatter.string(from: response.accessTokenExpirationDate!) : "",
        "tokenType": response.tokenType ?? "",
        "idToken": response.idToken ?? "",
        "scopes": response.scope != nil ? response.scope!.components(separatedBy: " ") : [],
        "additionalParameters": response.additionalParameters as Any
    ]
    
    if let codeVerifier = codeVerifier {
        result["codeVerifier"] = codeVerifier
    }
    
    return result
}

/*
 * Take raw OIDTokenResponse and turn it to a token response format to pass to JavaScript caller
 */
func formatResponse(_ response: OIDTokenResponse) -> [String: Any] {
    let dateFormatter = DateFormatter()
    dateFormatter.timeZone = TimeZone(abbreviation: "UTC")
    dateFormatter.locale = Locale(identifier: "en_US_POSIX")
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
    
    return [
        "accessToken": response.accessToken ?? "",
        "accessTokenExpirationDate": response.accessTokenExpirationDate != nil ? dateFormatter.string(from: response.accessTokenExpirationDate!) : "",
        "additionalParameters": response.additionalParameters as Any,
        "idToken": response.idToken ?? "",
        "refreshToken": response.refreshToken ?? "",
        "tokenType": response.tokenType ?? ""
    ]
}

/*
 * Take raw OIDTokenResponse and additional parameters from an OIDAuthorizationResponse
 * and turn them into an extended token response format to pass to JavaScript caller
 */
func formatResponse(_ response: OIDTokenResponse, withAuthResponse authResponse: OIDAuthorizationResponse) -> [String: Any] {
    let dateFormatter = DateFormatter()
    dateFormatter.timeZone = TimeZone(abbreviation: "UTC")
    dateFormatter.locale = Locale(identifier: "en_US_POSIX")
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"
    
    return [
        "accessToken": response.accessToken ?? "",
        "accessTokenExpirationDate": response.accessTokenExpirationDate != nil ? dateFormatter.string(from: response.accessTokenExpirationDate!) : "",
        "authorizeAdditionalParameters": authResponse.additionalParameters as Any,
        "tokenAdditionalParameters": response.additionalParameters as Any,
        "idToken": response.idToken ?? "",
        "refreshToken": response.refreshToken ?? "",
        "tokenType": response.tokenType ?? "",
        "scopes": authResponse.scope != nil ? authResponse.scope!.components(separatedBy: " ") : []
    ]
}

func getErrorCode(_ error: NSError, defaultCode: String) -> String {
    if error.domain == OIDOAuthAuthorizationErrorDomain {
        switch error.code {
        case OIDErrorCodeOAuth.invalidRequest.rawValue:
            return "invalid_request"
        case OIDErrorCodeOAuth.unauthorizedClient.rawValue:
            return "unauthorized_client"
        case OIDErrorCodeOAuth.accessDenied.rawValue:
            return "access_denied"
        case OIDErrorCodeOAuth.unsupportedResponseType.rawValue:
            return "unsupported_response_type"
        case OIDErrorCodeOAuth.invalidScope.rawValue:
            return "invalid_scope"
        case OIDErrorCodeOAuth.serverError.rawValue:
            return "server_error"
        case OIDErrorCodeOAuth.temporarilyUnavailable.rawValue:
            return "temporarily_unavailable"
        default:
            break
        }
    } else if error.domain == OIDOAuthTokenErrorDomain {
        switch error.code {
        case OIDErrorCodeOAuthToken.invalidRequest.rawValue:
            return "invalid_request"
        case OIDErrorCodeOAuthToken.invalidClient.rawValue:
            return "invalid_client"
        case OIDErrorCodeOAuthToken.invalidGrant.rawValue:
            return "invalid_grant"
        case OIDErrorCodeOAuthToken.unauthorizedClient.rawValue:
            return "unauthorized_client"
        case OIDErrorCodeOAuthToken.unsupportedGrantType.rawValue:
            return "unsupported_grant_type"
        case OIDErrorCodeOAuthToken.invalidScope.rawValue:
            return "invalid_scope"
        default:
            break
        }
    }

    return defaultCode
}

#if !targetEnvironment(macCatalyst)
func getCustomBrowser(_ browserType: String) -> OIDExternalUserAgent {
    let browsers: [String: () -> OIDExternalUserAgent] = [
        "safari": { OIDExternalUserAgentIOSCustomBrowser.customBrowserSafari() },
        "chrome": { OIDExternalUserAgentIOSCustomBrowser.customBrowserChrome() },
        "opera": { OIDExternalUserAgentIOSCustomBrowser.customBrowserOpera() },
        "firefox": { OIDExternalUserAgentIOSCustomBrowser.customBrowserFirefox() }
    ]
    
    if let browser = browsers[browserType] {
        return browser()
    } else {
        fatalError("Unsupported browser type")
    }
}
#endif

func getErrorMessage(_ error: NSError) -> String {
    if let userInfo = error.userInfo as? [String: Any],
       let oauthError = userInfo[OIDOAuthErrorResponseErrorKey] as? [String: Any],
       let errorDescription = oauthError[OIDOAuthErrorFieldErrorDescription] as? String {
        return errorDescription
    } else {
        return error.localizedDescription
    }
}

func getExternalUserAgent(presentingViewController: UIViewController, prefersEphemeralSession: Bool) -> OIDExternalUserAgent {
    #if targetEnvironment(macCatalyst)
    return OIDExternalUserAgentCatalyst(presentingViewController: presentingViewController)
    #elseif os(iOS)
    if #available(iOS 13.0, *) {
        return OIDExternalUserAgentIOS(presenting: presentingViewController, prefersEphemeralSession: prefersEphemeralSession)!
    } else {
        return OIDExternalUserAgentIOS(presenting: presentingViewController)!
    }
    #elseif os(macOS)
    return OIDExternalUserAgentMac()
    #endif
  }
}

class WepinPresentationContextProvider: NSObject, ASWebAuthenticationPresentationContextProviding {
    private weak var window: UIWindow?

    init(window: UIWindow?) {
        self.window = window
    }

    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        return window ?? ASPresentationAnchor()
    }
}



//@objc protocol RNAppAuthFlowManagerDelegate: NSObjectProtocol {
//    @objc func resumeExternalUserAgentFlow(with url: URL) -> Bool
//}
//
//
//@objc protocol RNAppAuthFlowManager: NSObjectProtocol {
//    @objc weak var authorizationFlowManagerDelegate: RNAppAuthFlowManagerDelegate? { get set }
//}
