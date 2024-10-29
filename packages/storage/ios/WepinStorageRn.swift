import Foundation
import Security
import React


@objc(WepinStorageRn)
class WepinStorageRn: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "WepinStorageRn"
    }
    
    func currentViewController() -> UIViewController? {
        return UIApplication.shared.delegate?.window??.rootViewController?.presentedViewController ?? UIApplication.shared.delegate?.window??.rootViewController
    }
    
    private let servicePrefix: String = "wepin" + (Bundle.main.bundleIdentifier ?? "") 

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

  private var rnAppAuthTaskId: UIBackgroundTaskIdentifier = UIBackgroundTaskIdentifier.invalid

  private static let kStateSizeBytes = 32
  private static let kCodeVerifierBytes = 32

  @objc(setItem:withValue:withResolver:withRejecter:)
  func setItem(
          key: String,
          value: String,
          resolve: @escaping RCTPromiseResolveBlock,
          reject: @escaping RCTPromiseRejectBlock
  ) {
      guard let dataFromValue = value.data(using: String.Encoding(rawValue: String.Encoding.utf8.rawValue)) else {
            let error = NSError(domain: Bundle.main.bundleIdentifier ?? "RNEncryptedStorage", code: 0, userInfo: nil)
            self.rejectPromise("An error occurred while parsing value", error: error, rejecter: reject)
            return
        }

        let storeQuery: [NSString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: servicePrefix,
            kSecAttrAccount: key,
            kSecValueData: dataFromValue
        ]

        // Deletes the existing item prior to inserting the new one
        SecItemDelete(storeQuery as CFDictionary)

        let insertStatus = SecItemAdd(storeQuery as CFDictionary, nil)

        if insertStatus == errSecSuccess {
            resolve(value)
        } else {
            let error = NSError(domain: Bundle.main.bundleIdentifier ?? "RNEncryptedStorage", code: Int(insertStatus), userInfo: nil)
            self.rejectPromise("An error occurred while saving value", error: error, rejecter: reject)
        }
  }

    @objc(getItem:withResolver:withRejecter:)
    func getItem(
            key: String,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: @escaping RCTPromiseRejectBlock
    ) {
        let getQuery: [NSString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: servicePrefix,
            kSecAttrAccount: key,
            kSecReturnData: kCFBooleanTrue!,
            kSecMatchLimit: kSecMatchLimitOne
        ]

        var dataRef: AnyObject?
        let getStatus = SecItemCopyMatching(getQuery as CFDictionary, &dataRef)

        if getStatus == errSecSuccess {
            if let data = dataRef as? Data, let storedValue = String(data: data, encoding: .utf8) {
                resolve(storedValue)
            } else {
                resolve(nil)
            }
        } else if getStatus == errSecItemNotFound {
            resolve(nil)
        } else {
            let error = NSError(domain: Bundle.main.bundleIdentifier ?? "RNEncryptedStorage", code: Int(getStatus), userInfo: nil)
            self.rejectPromise("An error occurred while retrieving value", error: error, rejecter: reject)
        }
    }

    @objc(removeItem:withResolver:withRejecter:)
    func removeItem(
            key: String,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: @escaping RCTPromiseRejectBlock
    ) {
        let removeQuery: [NSString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: servicePrefix,
            kSecAttrAccount: key
        ]

        let removeStatus = SecItemDelete(removeQuery as CFDictionary)

        if removeStatus == errSecSuccess {
            resolve(key)
        } else {
            let error = NSError(domain: Bundle.main.bundleIdentifier ?? "RNEncryptedStorage", code: Int(removeStatus), userInfo: nil)
            self.rejectPromise("An error occurred while removing value", error: error, rejecter: reject)
        }
    }

    @objc(clearwithResolver:withRejecter:)
    func clear(
            resolve: @escaping RCTPromiseResolveBlock,
            reject: @escaping RCTPromiseRejectBlock
    ) {
        let secItemClasses: [CFString] = [
            kSecClassGenericPassword,
            kSecClassInternetPassword,
            kSecClassCertificate,
            kSecClassKey,
            kSecClassIdentity
        ]

        for secItemClass in secItemClasses {
            let spec: [NSString: Any] = [kSecClass: secItemClass]
            SecItemDelete(spec as CFDictionary)
        }

        resolve(nil)
    }

    private func rejectPromise(_ message: String, error: NSError, rejecter reject: RCTPromiseRejectBlock) {
        let errorCode = String(error.code)
        let errorMessage = "WepinStorageRnError: \(message)"
        reject(errorCode, errorMessage, error)
    }
}
