#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WepinStorageRn, NSObject)

RCT_EXTERN_METHOD(initializeStorage:(NSString *)appId)

RCT_EXTERN_METHOD(setItem:
  (NSString *)appId
  withKey:(NSString *)key
  withValue:(NSString *)value
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setAllItems:
  (NSString *)appId
  withData:(NSDictionary *)data
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getItem:
  (NSString *)appId
  withKey:(NSString *)key
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAllItems:
  (NSString *)appId
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeItem:
  (NSString *)appId
  withKey:(NSString *)key
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clear:
  (NSString *)appId
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject)
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end