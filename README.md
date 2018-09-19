# Email Assistant

A React-Native application that uses voice commands and text-to-speech to help you read your emails.

## Demo
[![emailassistant demo](https://img.youtube.com/vi/7jYvJ-qesJM/0.jpg)](https://youtu.be/7jYvJ-qesJM)

## Notes
 * Currently only works with Outlook email accounts (hotmail, outlook, office365). Gmail is shown in the accounts listing but isn't implemented (just for show).
 * Only tested on Android using an emulator (Nexus 5X API 23 Google) on a Windows 10 machine.

## Installation

Follow [React-Native's getting started guide](https://facebook.github.io/react-native/docs/getting-started.html). I used Windows as my Development OS and Android as the Target. Note that the only difference is the `react-native init` command shown below.

1. `react-native init emailassistant --version 0.55.4` (0.56.0 is broken on windows https://github.com/facebook/react-native/issues/20331. this will tell you of vulnerabilities that you can fix with npm audit fix. don't do this as it'll update react-native)
2. `npm install` to install our dependencies
3. `react-native link` to link our dependencies
4. added the following to the second line of `android/app/build.gradle` and updated `targetSdkVersion` to 26:
`apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"`
5. add the following to `android/app/src/main/AndroidManifest.xml`:
```xml
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <!-- Accepts URIs that begin with "URL_SCHEME://URL_HOST" -->
            <data android:scheme="@string/URL_SCHEME"
                  android:host="@string/URL_HOST" />
        </intent-filter>
```
and this to the activity:
```xml
      <activity
        android:name=".MainActivity"
        android:launchMode="singleTask"
```
6. `.env_example` has the following environment variables that need to be configured. You can rename to just `.env`. Register your app with outlook by following https://docs.microsoft.com/en-us/outlook/rest/ios-tutorial#register-the-app.
 * `URL_SCHEME`
 * `URL_HOST`
 * `OUTLOOK_CLIENT_ID`

