#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LoginRn, NSObject)


RCT_EXTERN_METHOD(authorize:(NSString *)wepinAppId
                 withRedirectUrl:(NSString *)redirectUrl
                 withClientId:(NSString *)clientId
                 withScopes:(NSArray<NSString *> *)scopes
                 withAdditionalParameters: (NSDictionary *_Nullable)additionalParameters
                 withServiceConfiguration: (NSDictionary *_Nullable)serviceConfiguration
                 withSkipCodeExchange:(BOOL)skipCodeExchange
                 withConnectionTimeoutSeconds:(double)connectionTimeoutSeconds
                 withAdditionalHeaders: (NSDictionary *_Nullable)additionalHeaders
                 withIosCustomBrowser:(NSString *)iosCustomBrowser
                 withPrefersEphemeralSession:(BOOL)prefersEphemeralSession
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
