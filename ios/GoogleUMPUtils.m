#import "GoogleUMPUtils.h"
#include <UserMessagingPlatform/UserMessagingPlatform.h>

@implementation GoogleUMPUtils

static NSString *ErrorDomain = @"ReactNativeGoogleUMPErrorDomain";

+ (void)rejectPromise:(RCTPromiseRejectBlock)reject
                 code:(NSString *)code
              message:(NSString *)message {
  NSMutableDictionary *userInfo = [NSMutableDictionary dictionary];

  [userInfo setValue:code forKey:@"code"];
  [userInfo setValue:message forKey:@"message"];

  NSError *error = [NSError errorWithDomain:ErrorDomain code:42 userInfo:userInfo];

  reject(code, message, error);
}

+ (NSString *)getCodeFromError:(NSError *)error {
  switch (error.code) {
    case UMPRequestErrorCodeInternal:
      return @"ump-request-internal";
    case UMPRequestErrorCodeInvalidAppID:
      return @"ump-request-invalid-app-id";
    case UMPRequestErrorCodeNetwork:
      return @"ump-request-network";
    case UMPRequestErrorCodeMisconfiguration:
      return @"ump-request-misconfiguration";
    case UMPFormErrorCodeInternal:
      return @"ump-form-internal";
    case UMPFormErrorCodeAlreadyUsed:
      return @"ump-form-already-used";
    case UMPFormErrorCodeUnavailable:
      return @"ump-form-unavailable";
    case UMPFormErrorCodeTimeout:
      return @"ump-form-timeout";
    default:
      return @"ump-unknown-error";
  }
}

@end
