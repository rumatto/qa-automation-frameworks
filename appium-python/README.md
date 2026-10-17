# Appium (Python)

Small Appium + Python example framework for the local Android demo APK.

It targets the native app built under `android-demo-app/` and runs against an
Android emulator through a local Appium server.

## What it covers

- login success and failure
- app shell navigation
- contact form validation
- API-backed submission flow as an opt-in test

## Prerequisites

- Python 3.12+
- Android SDK at `~/Library/Android/sdk`
- a running Android emulator
- Appium available on `PATH`

Build the APK if needed:

```bash
cd android-demo-app
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
./gradlew assembleDebug
```

## Setup

```bash
cd appium-python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

Start an emulator first, for example:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
"$ANDROID_HOME/emulator/emulator" -avd pixel6a
```

Then run the tests:

```bash
source .venv/bin/activate
pytest
```

The framework starts a local Appium server automatically when `appium` is
available on `PATH`.

By default, `pytest` runs only flows that do not require a companion API
service. To include the API-backed submission test, export `RUN_API_TESTS=1`
and make sure the app can reach a compatible host API on the base URL baked
into the APK, or rebuild the APK with a different `demoApiBaseUrl`.

## Environment overrides

Useful overrides:

```bash
export APK_PATH=/absolute/path/to/app-debug.apk
export APPIUM_SERVER_URL=http://127.0.0.1:4723/wd/hub
export APPIUM_AUTOSTART=0
export RUN_API_TESTS=1
export ANDROID_DEVICE_NAME="Android Emulator"
export ANDROID_PLATFORM_VERSION=13
export APP_PACKAGE=com.romio.androiddemo
export APP_ACTIVITY=.MainActivity
```

Default APK path:

```text
../android-demo-app/app/build/outputs/apk/debug/app-debug.apk
```

## Artifacts

Failed tests save screenshots under:

```text
test-results/
```
