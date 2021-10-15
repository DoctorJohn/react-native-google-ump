#import <React/RCTBridgeModule.h>

@interface GoogleUMPUtils : NSObject

+ (void)rejectPromise:(RCTPromiseRejectBlock)reject
                 code:(NSString *)code
              message:(NSString *)message;

+ (NSString *)getCodeFromError:(NSError *)error;

@end
