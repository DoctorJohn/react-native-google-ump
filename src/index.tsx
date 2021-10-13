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

export enum ConsentStatus {
  UNKNOWN = 0,
  NOT_REQUIRED = 1,
  REQUIRED = 2,
  OBTAINED = 3,
}

export type ConsentInfo = {
  consentStatus: ConsentStatus;
  consentFormAvailable: boolean;
};

export enum DebugGeography {
  DISABLED = 0,
  EEA = 1,
  NOT_EEA = 2,
}

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
