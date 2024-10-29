#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WepinStorageRn, NSObject)

RCT_EXTERN_METHOD(setItem:
  (NSString *)key 
  withValue:(NSString *)value 
  withResolver:(RCTPromiseResolveBlock)resolve 
  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getItem:(NSString *)key withResolver:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeItem:(NSString *)key withResolver:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clear:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject)
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end