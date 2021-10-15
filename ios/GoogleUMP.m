#import "GoogleUMP.h"
#include <UserMessagingPlatform/UserMessagingPlatform.h>
#import "GoogleUMPUtils.h"

@implementation GoogleUMP

static UMPConsentForm *consentForm = nil;

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

- (NSDictionary *)constantsToExport {
  NSMutableDictionary *constants = [NSMutableDictionary new];

  constants[@"CONSENT_STATUS_UNKNOWN"] = @(UMPConsentStatusUnknown);
  constants[@"CONSENT_STATUS_NOT_REQUIRED"] = @(UMPConsentStatusNotRequired);
  constants[@"CONSENT_STATUS_REQUIRED"] = @(UMPConsentStatusRequired);
  constants[@"CONSENT_STATUS_OBTAINED"] = @(UMPConsentStatusObtained);

  constants[@"DEBUG_GEOGRAPHY_DISABLED"] = @(UMPDebugGeographyDisabled);
  constants[@"DEBUG_GEOGRAPHY_EEA"] = @(UMPDebugGeographyEEA);
  constants[@"DEBUG_GEOGRAPHY_NOT_EEA"] = @(UMPDebugGeographyNotEEA);

  return constants;
}

- (UMPRequestParameters *)buildRequestParameters:(NSDictionary *)options {
  UMPRequestParameters *parameters = [[UMPRequestParameters alloc] init];

  if ([options objectForKey:@"underAgeOfConsent"]) {
    parameters.tagForUnderAgeOfConsent = [options[@"underAgeOfConsent"] boolValue];
  }

  UMPDebugSettings *debugSettings = [[UMPDebugSettings alloc] init];

  if ([options objectForKey:@"testDeviceHashedIds"]) {
    debugSettings.testDeviceIdentifiers = [options valueForKey:@"testDeviceHashedIds"];
  }

  if ([options objectForKey:@"debugGeography"]) {
    debugSettings.geography = [options[@"debugGeography"] integerValue];
  }

  parameters.debugSettings = debugSettings;
  return parameters;
}

RCT_EXPORT_METHOD(requestConsentInfoUpdate
                  : (NSDictionary *)options resolver
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  UMPRequestParameters *parameters = [self buildRequestParameters:options];

  [UMPConsentInformation.sharedInstance
      requestConsentInfoUpdateWithParameters:parameters
                           completionHandler:^(NSError *_Nullable error) {
                             if (error == nil) {
                               resolve([NSNull null]);
                             } else {
                               NSString *code = [GoogleUMPUtils getCodeFromError:error];
                               [GoogleUMPUtils rejectPromise:reject
                                                        code:code
                                                     message:error.localizedDescription];
                             }
                           }];
}

RCT_EXPORT_METHOD(getConsentInfo
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  UMPFormStatus formStatus = UMPConsentInformation.sharedInstance.formStatus;
  UMPConsentStatus consentStatus = UMPConsentInformation.sharedInstance.consentStatus;

  NSDictionary *payload = @{
    @"consentStatus" : @(consentStatus),
    @"consentFormAvailable" : @(formStatus == UMPFormStatusAvailable),
  };

  resolve(payload);
}

RCT_EXPORT_METHOD(loadConsentForm
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  [UMPConsentForm
      loadWithCompletionHandler:^(UMPConsentForm *_Nullable form, NSError *_Nullable error) {
        if (error == nil) {
          consentForm = form;
          resolve([NSNull null]);
        } else {
          NSString *code = [GoogleUMPUtils getCodeFromError:error];
          [GoogleUMPUtils rejectPromise:reject code:code message:error.localizedDescription];
        }
      }];
}

RCT_EXPORT_METHOD(showConsentForm
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  if (consentForm == nil) {
    [GoogleUMPUtils rejectPromise:reject
                             code:@"null-consent-form"
                          message:@"Attempted to show the consent form but it "
                                  @"was not loaded yet."];
    return;
  }

  [consentForm
      presentFromViewController:[UIApplication sharedApplication].delegate.window.rootViewController
              completionHandler:^(NSError *_Nullable error) {
                if (error == nil) {
                  resolve([NSNull null]);
                } else {
                  NSString *code = [GoogleUMPUtils getCodeFromError:error];
                  [GoogleUMPUtils rejectPromise:reject
                                           code:code
                                        message:error.localizedDescription];
                }
              }];
}

RCT_EXPORT_METHOD(resetConsentInfo) { [UMPConsentInformation.sharedInstance reset]; }

@end
