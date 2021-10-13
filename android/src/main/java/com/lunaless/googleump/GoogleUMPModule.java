package com.lunaless.googleump;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import com.google.android.ump.ConsentDebugSettings;
import com.google.android.ump.ConsentForm;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.FormError;
import com.google.android.ump.UserMessagingPlatform;

@ReactModule(name = GoogleUMPModule.NAME)
public class GoogleUMPModule extends ReactContextBaseJavaModule {
  public static final String NAME = "GoogleUMP";
  private final ConsentInformation consentInformation;
  private ConsentForm consentForm;

  public GoogleUMPModule(ReactApplicationContext reactContext) {
    super(reactContext);
    consentInformation = UserMessagingPlatform.getConsentInformation(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  ConsentRequestParameters buildRequestParameters(ReadableMap options) {
    ConsentRequestParameters.Builder paramsBuilder = new ConsentRequestParameters.Builder();

    if (options.hasKey("adMobAppId")) {
      paramsBuilder.setAdMobAppId(options.getString("adMobAppId"));
    }

    if (options.hasKey("underAgeOfConsent")) {
      paramsBuilder.setTagForUnderAgeOfConsent(options.getBoolean("underAgeOfConsent"));
    }

    ConsentDebugSettings.Builder settingsBuilder = new ConsentDebugSettings.Builder(getReactApplicationContext());

    if (options.hasKey("testDeviceHashedIds")) {
      final ReadableArray testDeviceHashedIds = options.getArray("testDeviceHashedIds");

      if (testDeviceHashedIds != null) {
        for (int i = 0; i < testDeviceHashedIds.size(); i++) {
          String id = testDeviceHashedIds.getString(i);
          if (id != null) {
            settingsBuilder.addTestDeviceHashedId(id);
          }
        }
      }
    }

    if (options.hasKey("debugGeography")) {
      settingsBuilder.setDebugGeography(options.getInt("debugGeography"));
    }

    if (options.hasKey("forceTesting")) {
      settingsBuilder.setForceTesting(options.getBoolean("forceTesting"));
    }

    ConsentDebugSettings settings = settingsBuilder.build();
    paramsBuilder.setConsentDebugSettings(settings);

    return paramsBuilder.build();
  }

  @ReactMethod
  public void requestConsentInfoUpdate(ReadableMap options, Promise promise) {
    ConsentRequestParameters params = buildRequestParameters(options);

    final Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      GoogleUMPUtils.rejectPromise(
        promise,
        "null-activity",
        "Attempted to request consent info but current activity was null."
      );
      return;
    }

    consentInformation.requestConsentInfoUpdate(
      currentActivity,
      params,
      new ConsentInformation.OnConsentInfoUpdateSuccessListener() {
        @Override
        public void onConsentInfoUpdateSuccess() {
          promise.resolve(null);
        }
      },
      new ConsentInformation.OnConsentInfoUpdateFailureListener() {
        @Override
        public void onConsentInfoUpdateFailure(@NonNull FormError formError) {
          GoogleUMPUtils.rejectPromise(
            promise,
            GoogleUMPUtils.codeFromFormError(formError),
            formError.getMessage()
          );
        }
      });
  }

  @ReactMethod
  public void getConsentInfo(Promise promise) {
    WritableMap consentInfo = Arguments.createMap();
    consentInfo.putInt("consentStatus", consentInformation.getConsentStatus());
    consentInfo.putBoolean("consentFormAvailable", consentInformation.isConsentFormAvailable());
    promise.resolve(consentInfo);
  }

  @ReactMethod
  public void loadConsentForm(Promise promise) {
    final Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      GoogleUMPUtils.rejectPromise(
        promise,
        "null-activity",
        "Attempted to load the consent form but the current activity was null."
      );
      return;
    }

    currentActivity.runOnUiThread(() -> {
      UserMessagingPlatform.loadConsentForm(
        currentActivity,
        new UserMessagingPlatform.OnConsentFormLoadSuccessListener() {
          @Override
          public void onConsentFormLoadSuccess(@Nullable ConsentForm consentForm) {
            GoogleUMPModule.this.consentForm = consentForm;
            promise.resolve(null);
          }
        },
        new UserMessagingPlatform.OnConsentFormLoadFailureListener() {
          @Override
          public void onConsentFormLoadFailure(@NonNull FormError formError) {
            GoogleUMPUtils.rejectPromise(
              promise,
              GoogleUMPUtils.codeFromFormError(formError),
              formError.getMessage()
            );
          }
        }
      );
    });
  }

  @ReactMethod
  public void showConsentForm(Promise promise) {
    final Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      GoogleUMPUtils.rejectPromise(
        promise,
        "null-activity",
        "Attempted to show consent form but the current activity was null."
      );
      return;
    }

    currentActivity.runOnUiThread(() -> {
      consentForm.show(
        currentActivity,
        new ConsentForm.OnConsentFormDismissedListener() {
          @Override
          public void onConsentFormDismissed(@Nullable FormError formError) {
            if (formError == null) {
              promise.resolve(null);
            } else {
              GoogleUMPUtils.rejectPromise(
                promise,
                GoogleUMPUtils.codeFromFormError(formError),
                formError.getMessage()
              );
            }
          }
        }
      );
    });
  }

  @ReactMethod
  public void resetConsentInfo() {
    consentInformation.reset();
  }
}
