#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PinRn, NSObject)


RCT_EXTERN_METHOD(createWepinPin:(NSString *)appId
                 withAppKey:(NSString *)appKey)

RCT_EXTERN_METHOD(initialize:(NSString *)defaultLanguage
                 withDefaultCurrency:(NSString *)defaultCurrency
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isInitialize:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loginWithOauthProvider:(NSString *)provider
                 withClientId:(NSString *)clientId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(signUpWithEmailAndPassword:(NSString *)email
                 withPassword:(NSString *)password
                 withLocale:(NSString * __nullable)locale  //optional 처리 방법 확인
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loginWithEmailAndPassword:(NSString *)email
                 withPassword:(NSString *)password
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loginWithIdToken:(NSString *)idToken
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loginWithAccessToken:(NSString *)provider
                 withAccessToken:(NSString *)accessToken
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getRefreshFirebaseToken:(NSDictionary * __nullable)prevToken //optional
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loginWepin:(NSDictionary *)params
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCurrentWepinUser:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(logout:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(finalize:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

//MARK: - function for PIN

RCT_EXTERN_METHOD(changeLanguage:(NSString *)language
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateRegistrationPINBlock:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateAuthPINBlock:(nonnull NSNumber *)count
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateChangePINBlock:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateAuthOTPCode:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
