#!/usr/bin/env bash
set -euo pipefail

workspace_root=$(cd "$(dirname "$0")/.." && pwd)
cd "$workspace_root/flutter"
[[ "$(uname -s)" == Darwin ]] || {
  echo 'IOS_NATIVE_TESTS_REQUIRE_MACOS: run this gate on the macOS build worker.' >&2
  exit 25
}

simulator_id=$(xcrun simctl list devices available --json | python3 -c '
import json, sys
devices = json.load(sys.stdin)["devices"]
phones = [d for runtime, ds in devices.items() if "iOS" in runtime
          for d in ds if d.get("isAvailable") and d["name"].startswith("iPhone")]
if not phones:
    sys.exit("IOS_SIMULATOR_MISSING: install an iPhone simulator runtime.")
print(phones[0]["udid"])
')

flutter build ios --simulator --debug --no-pub
# The OS confirmation/permission adapter tests must pass independently of the
# shared Dart tests. Preserve the native result bundle for inspection in CI.
mkdir -p build/ios/native-test-results
result_dir=$(mktemp -d "$workspace_root/flutter/build/ios/native-test-results/run.XXXXXX")
xcodebuild test \
  -workspace ios/Runner.xcworkspace \
  -scheme Runner \
  -configuration Debug \
  -destination "platform=iOS Simulator,id=$simulator_id" \
  -destination-timeout 120 \
  -resultBundlePath "$result_dir/RunnerTests.xcresult" \
  CODE_SIGNING_ALLOWED=NO
