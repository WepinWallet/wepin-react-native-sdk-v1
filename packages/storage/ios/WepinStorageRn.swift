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
    
    private let prevServicePrefix: String = "wepin" + (Bundle.main.bundleIdentifier ?? "") 
    private let cookie_name = "wepin:auth:"
    private let storageManager = StorageManager()

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

  private var rnAppAuthTaskId: UIBackgroundTaskIdentifier = UIBackgroundTaskIdentifier.invalid

  private static let kStateSizeBytes = 32
  private static let kCodeVerifierBytes = 32

  @objc(initializeStorage:)
  func initializeStorage(
    appId: String
  ) {
    migrateOldStorage(appId: appId)
  }

  private func migrateOldStorage(appId: String) {
    if let migrationStatus = storageManager.read(appId: appId, key: "migration"),
        decodeData(data: migrationStatus) == "true" {
            return
        }
    prevStorageReadAll()
    storageManager.write(appId: appId, key: "migration", data: encodeData(value: "true"))
    prevDeleteAll()
  }

  private func prevStorageReadAll() {

    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: prevServicePrefix,
        kSecReturnAttributes as String: kCFBooleanTrue!,
        kSecReturnData as String: kCFBooleanTrue!,
        kSecMatchLimit as String: kSecMatchLimitAll
    ]

    var items: CFTypeRef?
    guard SecItemCopyMatching(query as CFDictionary, &items) == errSecSuccess,
        let itemArray = items as? [[String: Any]] else { return  }
          
    for item in itemArray {
        if let key = item[kSecAttrAccount as String] as? String,
            key.hasPrefix(cookie_name),
            let data = item[kSecValueData as String] as? Data {
            var appId = String(key.dropFirst(cookie_name.count))
                let jsonString = String(data: data, encoding: .utf8) ?? "{}"
                do {
                    if let jsonData = jsonString.data(using: .utf8),
                    let dictionary = try? JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any] {
                        for(key, value) in dictionary {
                            let valueStr = "\(value)"
                            if let dataValue = value as? Data {
                                storageManager.write(appId: appId, key: key, data: dataValue)
                            } else if let stringValue = value as? String, let dataValue = stringValue.data(using: .utf8) {
                                storageManager.write(appId: appId, key: key, data: dataValue)
                            } else if let dictValue = value as? [String: Any] {
                                do {
                                    let jsonData = try JSONSerialization.data(withJSONObject: dictValue, options: [])
                                    storageManager.write(appId: appId, key: key, data: jsonData)
                                } catch {
                                    // print("fail to convert Dictionary to json : \(error)")
                                }
                            } else {
                                // print("not support data type \(key) = \(value)")
                            }
                        }
                    } else {
                        // print("not supported data type: \(jsonString)")
                    }
                } catch {
                    // print("json parsing error")
                }
            }
    }
  }
    
    private func prevDeleteAll() {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: prevServicePrefix
        ]
        SecItemDelete(query as CFDictionary)
    }

    private func encodeData(value: Any) -> Data? {
        if let stringValue = value as? String {
            return stringValue.data(using: .utf8)
        }
        return nil
    }
    
    private func decodeData(data: Data) -> String? {
        if let stringValue = String(data: data, encoding: .utf8) {
            return stringValue
        }

        return nil
    }

  @objc(setItem:withKey:withValue:withResolver:withRejecter:)
  func setItem(
        appId: String,
        key: String,
        value: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
  ) {
    let keychainData = encodeData(value: value)
    storageManager.write(appId: appId, key: key, data: keychainData)
    resolve(nil)
  }

    @objc(getItem:withKey:withResolver:withRejecter:)
    func getItem(
            appId: String,
            key: String,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let data = storageManager.read(appId: appId, key: key) else {
            print("Error fetching data from keychain")
            resolve(nil)
            return
        }

        resolve(decodeData(data: data))
    }

    @objc(setAllItems:withData:withResolver:withRejecter:)
    func setAllItems(
        appId: String,
        data: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        var convertedData: [String: Data?] = [:]
        for (key, value) in data {
            if let keyStr = key as? String {
                if let valueStr = value as? String {
                    convertedData[keyStr] = encodeData(value: valueStr)
                } else {
                    convertedData[keyStr] = nil
                }
            }
        }
        
        storageManager.writeAll(appId: appId, data: convertedData)
        resolve(nil)
    }

    @objc(getAllItems:withResolver:withRejecter:)
    func getAllItems(
        appId: String,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        var allData = storageManager.readAll(appId: appId).reduce(into: [:]) { result, item in
            if let data = item.value {
                result[item.key] = decodeData(data: data)
            }
        }
        resolve(allData)
    }

    @objc(removeItem:withKey:withResolver:withRejecter:)
    func removeItem(
            appId: String,
            key: String,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: @escaping RCTPromiseRejectBlock
    ) {
        storageManager.delete(appId: appId, key: key)
        resolve(nil)
    }

    @objc(clear:withResolver:withRejecter:)
    func clear(
            appId: String,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: @escaping RCTPromiseRejectBlock
    ) {
        storageManager.deleteAll()
        storageManager.write(appId: appId, key: "migration", data: encodeData(value: "true"))

        resolve(nil)
    }

    private func rejectPromise(_ message: String, error: NSError, rejecter reject: RCTPromiseRejectBlock) {
        let errorCode = String(error.code)
        let errorMessage = "WepinStorageRnError: \(message)"
        reject(errorCode, errorMessage, error)
    }
}
