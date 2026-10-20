#!/usr/bin/env bash
set -euo pipefail

# Resolve project root from script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

BASELINE_FILE="${PROJECT_ROOT}/__baselines__/IntentionalBugsTest.java"
TARGET_FILE="${PROJECT_ROOT}/src/test/java/tests/IntentionalBugsTest.java"

# Fail clearly if baseline is missing
if [ ! -f "$BASELINE_FILE" ]; then
    echo "Error: Baseline fixture not found at $BASELINE_FILE" >&2
    exit 1
fi

# Copy baseline over working fixture
cp "$BASELINE_FILE" "$TARGET_FILE"

# Remove Java build artifacts produced by TestSentry validation (Gradle/Maven
# recompile the fixture to run the validation plan). These are build output,
# never source changes, so they are cleaned instead of restored.
for BUILD_DIR in target build .gradle; do
    if [ -d "${PROJECT_ROOT}/${BUILD_DIR}" ]; then
        rm -rf "${PROJECT_ROOT}/${BUILD_DIR}"
    fi
done

# Remove any stray compiled classes emitted next to the sources.
find "${PROJECT_ROOT}/src" -name '*.class' -type f -delete 2>/dev/null || true

echo "Reset complete: IntentionalBugsTest.java restored from __baselines__; generated build artifacts removed."
