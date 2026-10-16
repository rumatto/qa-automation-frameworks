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

echo "Reset complete: IntentionalBugsTest.java restored from __baselines__."
