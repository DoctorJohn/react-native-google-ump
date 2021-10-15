import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-google-ump' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const GoogleUMP = NativeModules.GoogleUMP
  ? NativeModules.GoogleUMP
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const {
  CONSENT_STATUS_UNKNOWN,
  CONSENT_STATUS_NOT_REQUIRED,
  CONSENT_STATUS_REQUIRED,
  CONSENT_STATUS_OBTAINED,
  DEBUG_GEOGRAPHY_DISABLED,
  DEBUG_GEOGRAPHY_EEA,
  DEBUG_GEOGRAPHY_NOT_EEA,
} = GoogleUMP.getConstants();

export enum ConsentStatus {
  UNKNOWN = CONSENT_STATUS_UNKNOWN,
  NOT_REQUIRED = CONSENT_STATUS_NOT_REQUIRED,
  REQUIRED = CONSENT_STATUS_REQUIRED,
  OBTAINED = CONSENT_STATUS_OBTAINED,
}

export enum DebugGeography {
  DISABLED = DEBUG_GEOGRAPHY_DISABLED,
  EEA = DEBUG_GEOGRAPHY_EEA,
  NOT_EEA = DEBUG_GEOGRAPHY_NOT_EEA,
}

export type ConsentInfo = {
  consentStatus: ConsentStatus;
  consentFormAvailable: boolean;
};

export type ConsentRequestParameters = {
  adMobAppId?: string;
  underAgeOfConsent?: boolean;
  testDeviceHashedIds?: string[];
  debugGeography?: DebugGeography;
  forceTesting?: boolean;
};

export default {
  requestConsentInfoUpdate(
    consentRequestParameters?: ConsentRequestParameters
  ) {
    return GoogleUMP.requestConsentInfoUpdate(consentRequestParameters ?? {});
  },

  getConsentInfo(): Promise<ConsentInfo> {
    return GoogleUMP.getConsentInfo();
  },

  loadConsentForm(): Promise<null> {
    return GoogleUMP.loadConsentForm();
  },

  showConsentForm(): Promise<null> {
    return GoogleUMP.showConsentForm();
  },

  resetConsentInfo(): Promise<null> {
    return GoogleUMP.resetConsentInfo();
  },
};
