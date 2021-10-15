package com.lunaless.googleump;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.google.android.ump.FormError;

public class GoogleUMPUtils {
  public static void rejectPromise(Promise promise, String code, String message) {
    WritableMap userInfo = Arguments.createMap();
    userInfo.putString("code", code);
    userInfo.putString("message", message);
    promise.reject(code, message, userInfo);
  }

  public static String getCodeFromError(FormError formError) {
    switch (formError.getErrorCode()) {
      case FormError.ErrorCode.INTERNAL_ERROR:
        return "consent-form-internal-error";
      case FormError.ErrorCode.INTERNET_ERROR:
        return "consent-form-internet-error";
      case FormError.ErrorCode.INVALID_OPERATION:
        return "consent-form-invalid-operation";
      case FormError.ErrorCode.TIME_OUT:
        return "consent-form-time-out";
      default:
        return "consent-form-unknown-error";
    }
  }
}
