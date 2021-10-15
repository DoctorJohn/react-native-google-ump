# React Native Google UMP

[![NPM][npm-image]][npm-url]
[![License][license-image]][license-url]

[npm-image]: https://img.shields.io/npm/v/react-native-google-ump
[npm-url]: https://www.npmjs.com/package/react-native-google-ump
[license-image]: https://img.shields.io/npm/l/react-native-google-ump
[license-url]: https://github.com/DoctorJohn/react-native-google-ump/blob/master/LICENSE

React Native bindings for [Google's User Messaging Platform SDK](https://developers.google.com/admob/ump/) for Android and iOS.

## Installation

```sh
npm install react-native-google-ump
```

or

```sh
yarn add react-native-google-ump
```

### Add your app ID on Android

Obtain your app ID by following the [Help Center instructions](https://support.google.com/admob/answer/7356431).

Add the following to your `AndroidManifest.xml` after replacing `YOUR-APP-ID`.

```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="YOUR-APP-ID"/>
```

Take a look at our example app in the `example` directory if you're unsure where exactly the `meta-data` tag belongs.

### Add your app ID on iOS

Obtain your app ID by following the [Help Center instructions](https://support.google.com/admob/answer/7356431).

Add the following to your `Info.plist` after replacing `YOUR-APP-ID`:

```xml
<key>GADApplicationIdentifier</key>
<string>YOUR-APP-ID</string>
```

## Usage

The User Messaging Platform SDK is designed to be used in a linear fashion, so is this package.
The steps for using the SDK and this package are:

1. Request the latest consent information.
2. Check if consent is required.
3. Check if a form is available and if so load a form.
4. Present the form.
5. Provide a way for users to change their consent.

These steps are explained in more detail in [the SDK's documentation](https://developers.google.com/admob/ump/).

### Basic example

```typescript
import * as React from 'react';
import { Text } from 'react-native';
import UMP, { ConsentStatus } from 'react-native-google-ump';

export default function ConsentScreen() {
  React.useEffect(() => {
    async function effect() {
      // 1. Request the latest consent information
      await UMP.requestConsentInfoUpdate();
      const consentInfo = await UMP.getConsentInfo();

      // 2. Check if consent is required
      if (result.consentStatus == ConsentStatus.REQUIRED) {
        // 3. Check if a form is available...
        if (result.consentFormAvailable) {
          // ... and if so load a form
          await UMP.loadConsentForm();

          // 4. Present the form
          await UMP.showConsentForm();
        }
      }
    }
    effect();
  }, []);

  return <Text>Loading consent info...</Text>;
}
```

### Request the latest consent information

It is recommended that you request an update of the consent information at every app launch.
This will determine whether or not your user needs to provide consent.

```typescript
import UMP from 'react-native-google-ump';

await UMP.requestConsentInfoUpdate({
  underAgeOfConsent: false,
});
```

### Check consent information

```typescript
import UMP, { ConsentStatus } from 'react-native-google-ump';

const consentInfo = await UMP.getConsentInfo();

if (consentInfo.consentStatus === ConsentStatus.REQUIRED) {
  // Consent is required

  if (consentInfo.consentFormAvailable) {
    // A consent form is available
  }
}
```

Note that consent information is cached between app sessions and can be read without requesting an info update.

### Load the form

Once you've determined that a form is available, the next step is to load the form.

```typescript
import UMP from 'react-native-google-ump';

await UMP.loadConsentForm();
```

### Present the form

You should determine if the user requires consent prior to presenting the form.
If consent is not required, you can still show a form so that your user can change their consent.

```typescript
import UMP from 'react-native-google-ump';

await UMP.showConsentForm();
```

Note that a consent form can only be shown once.
To show another form you need to call `loadConsentForm` again.

## Testing

### Enable debug settings

To use the debug functionality, you need to provide your test device's hashed id.
Emulators and simulators have testing enabled by default.

```js
import UMP from 'react-native-google-ump';

await UMP.requestConsentInfoUpdate({
  testDeviceHashedIds: ["test-device-id-here"];
});
```

### Force a geography

This package provides a way to test your app's behavior as though the device was located or not located in the EAA.

```js
import UMP from 'react-native-google-ump';

await UMP.requestConsentInfoUpdate({
  debugGeography: DebugGeography.EEA,
});

await UMP.requestConsentInfoUpdate({
  debugGeography: DebugGeography.NOT_EEA,
});
```

### Reset consent state

For testing it's helpful to reset the state of the SDK to simulate a user's first install experience.
This package provides the reset method to do this:

```js
import UMP from 'react-native-google-ump';

await UMP.resetConsentInfo();
```

## Delay app measurement (optional)

> By default, the Google Mobile Ads SDK initializes app measurement and begins sending user-level event data to Google immediately when the app starts.
> If your app requires user consent before these events can be sent, you can delay app measurement until you explicitly initialize the Mobile Ads SDK or load an ad.

To delay app measurement, follow the official instructions for
[Android][delay-measurement-android] and [IOS][delay-measurement-ios].

[delay-measurement-android]: https://developers.google.com/admob/ump/android/quick-start#delay_app_measurement_optional
[delay-measurement-ios]: https://developers.google.com/admob/ump/ios/quick-start#delay_app_measurement_optional

## Further reading

**This readme file only covers basics** about the User Messaging Platfom SDK.
The [SDK's documentation](https://developers.google.com/admob/ump/) is more detailed and discusses
more topics such as _mediation_, _forwarding consent_ and handling _App Tracking Transparency_ requirements.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
