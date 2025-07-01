#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SdkRn, NSObject)


RCT_EXTERN_METHOD(createWepinWidget:(NSString *)appId
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

//MARK: function for widget
RCT_EXTERN_METHOD(changeLanguage:(NSString *)language
                 withCurrency:(NSString * __nullable)currency //optional
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getStatus:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(openWidget:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(closeWidget:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loginWithUI:(NSArray *)loginProviders
                 withEmail:(NSString * __nullable) email
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(register:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(send:(NSDictionary *)account
                 withTxData:(NSDictionary * __nullable)txData
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(receive:(NSDictionary *)account
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAccounts:(NSArray * __nullable)networks
                 withEoa:(BOOL)withEoa
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBalance:(NSArray * __nullable)accounts
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getNFTs:(BOOL *)refresh
                 withNetworks:(NSArray * __nullable)networks
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
