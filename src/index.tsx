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

/**
 * Consent status values.
 */
export enum ConsentStatus {
  /**
   * Unknown consent status.
   */
  UNKNOWN = CONSENT_STATUS_UNKNOWN,

  /**
   * User consent not required.
   */
  NOT_REQUIRED = CONSENT_STATUS_NOT_REQUIRED,

  /**
   * User consent required but not yet obtained.
   */
  REQUIRED = CONSENT_STATUS_REQUIRED,

  /**
   * User consent obtained.
   */
  OBTAINED = CONSENT_STATUS_OBTAINED,
}

/**
 * Debug values for testing geography.
 */
export enum DebugGeography {
  /**
   * Disable geography debugging.
   */
  DISABLED = DEBUG_GEOGRAPHY_DISABLED,

  /**
   * Geography appears as in EEA for debug devices.
   */
  EEA = DEBUG_GEOGRAPHY_EEA,

  /**
   * Geography appears as not in EEA for debug devices.
   */
  NOT_EEA = DEBUG_GEOGRAPHY_NOT_EEA,
}

/**
 * User consent information.
 */
export type ConsentInfo = {
  /**
   * The user's consent status.
   */
  consentStatus: ConsentStatus;

  /**
   * Whether a consent form is available and can be loaded.
   */
  consentFormAvailable: boolean;
};

/**
 * Parameters sent on user consent info updates.
 */
export type ConsentRequestParameters = {
  /**
   * Indicates whether the user is tagged for under age of consent.
   */
  underAgeOfConsent?: boolean;

  /**
   * Debug features are enabled for devices with these identifiers.
   * For emulators and simulators, debug features are always enabled.
   */
  testDeviceHashedIds?: string[];

  /**
   * Debug geography.
   */
  debugGeography?: DebugGeography;

  /**
   * (Android only) Override the Admob app id.
   */
  adMobAppId?: string;

  /**
   * (Android only) Force enable testing features.
   */
  forceTesting?: boolean;
};

export default {
  /**
   * Requests the latest consent information.
   * Must be called before loading a consent form.
   *
   * @param consentRequestParameters Consent request parameters.
   */
  requestConsentInfoUpdate(
    consentRequestParameters?: ConsentRequestParameters
  ) {
    return GoogleUMP.requestConsentInfoUpdate(consentRequestParameters ?? {});
  },

  /**
   * Get the user's consent information.
   * The value is cached between app sessions and can be read without requesting info.
   */
  getConsentInfo(): Promise<ConsentInfo> {
    return GoogleUMP.getConsentInfo();
  },

  /**
   * Load a single use consent form if available.
   */
  loadConsentForm(): Promise<null> {
    return GoogleUMP.loadConsentForm();
  },

  /**
   * Presents a previously loaded single use consent form.
   * The form is dismissed after the user selects an option.
   * The consent status is updated before the promise resolves.
   */
  showConsentForm(): Promise<null> {
    return GoogleUMP.showConsentForm();
  },

  /**
   * Clear all consent state from persistent storage.
   */
  resetConsentInfo(): Promise<null> {
    return GoogleUMP.resetConsentInfo();
  },
};
