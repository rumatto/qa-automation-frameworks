# Android Demo App

Small native Android demo app that mirrors the existing web demo flows:

- login with `demo` / `secret`
- home view with demo profile load
- settings view
- contact form with validation and API submission
- persisted auth state through `SharedPreferences`

## Build a debug APK

On this machine, the Android SDK is installed under `~/Library/Android/sdk`. Build with:

```bash
cd android-demo-app
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
./gradlew assembleDebug
```

APK output:

```bash
app/build/outputs/apk/debug/app-debug.apk
```

## Demo API

By default the app targets the Android emulator host bridge:

```text
http://10.0.2.2:8080
```

Override it at build time when needed:

```bash
./gradlew assembleDebug -PdemoApiBaseUrl=http://192.168.1.25:8080
```

If you want the app's profile load and successful message submission to work,
provide a host API compatible with the expected endpoints on that base URL.

## Automation notes

The app uses stable Android resource IDs for automation, including:

- `login_username`
- `login_password`
- `login_submit`
- `nav_home`
- `nav_settings`
- `nav_form`
- `nav_logout`
- `form_email`
- `form_message`
- `form_submit`
- `form_status`
