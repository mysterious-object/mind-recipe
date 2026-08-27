#!/usr/bin/env bash
set -euo pipefail

# Jenkins-owned, Apple-silicon iOS build runner. The VM is persistent so the
# large Apple SDK and Flutter cache are downloaded once, not on every release.
TART_IMAGE=${MIND_RECIPE_TART_IMAGE:-ghcr.io/cirruslabs/macos-sequoia-xcode@sha256:337c389b3b132cc868d42f40c715b943f263175c5fff50a78856e899be1175df}
TART_VM=${MIND_RECIPE_TART_VM:-mind-recipe-xcode-16-4}
API_URL=${MIND_RECIPE_STAGING_API_URL:?staging API URL is required}
SHARED_NAME=mind-recipe-workspace

command -v tart >/dev/null
command -v sshpass >/dev/null || {
  echo 'JENKINS_MAC_MISSING_SSHPASS: install sshpass once with Homebrew.' >&2
  exit 21
}

if ! tart list --format json 2>/dev/null | grep -q "\"name\"[[:space:]]*:[[:space:]]*\"$TART_VM\""; then
  available_kb=$(df -Pk "$HOME" | awk 'NR==2 {print $4}')
  # The pinned Xcode image is roughly 65 GiB compressed and needs working
  # headroom while Tart materializes its APFS disk. Fail before a partial pull
  # fills the Jenkins host.
  if (( available_kb < 85 * 1024 * 1024 )); then
    echo "JENKINS_MAC_STORAGE_LOW: at least 85 GiB free is required to provision the pinned Xcode VM; found $((available_kb / 1024 / 1024)) GiB." >&2
    exit 22
  fi
  tart clone "$TART_IMAGE" "$TART_VM"
  tart set "$TART_VM" --cpu 6 --memory 12288
fi

tart stop "$TART_VM" >/dev/null 2>&1 || true
tart run --no-graphics --dir="$SHARED_NAME:$WORKSPACE" "$TART_VM" >"$WORKSPACE/tart-run.log" 2>&1 &
tart_pid=$!
cleanup() {
  tart stop "$TART_VM" >/dev/null 2>&1 || true
  wait "$tart_pid" 2>/dev/null || true
}
trap cleanup EXIT

vm_ip=''
for _ in $(seq 1 90); do
  vm_ip=$(tart ip "$TART_VM" 2>/dev/null || true)
  [[ -n "$vm_ip" ]] && break
  sleep 2
done
[[ -n "$vm_ip" ]] || { echo 'JENKINS_MAC_VM_BOOT_TIMEOUT' >&2; exit 23; }

ssh_cmd=(sshpass -p admin ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=10 "admin@$vm_ip")
for _ in $(seq 1 60); do
  "${ssh_cmd[@]}" true >/dev/null 2>&1 && break
  sleep 2
done
"${ssh_cmd[@]}" true >/dev/null

# Provision Flutter only once inside the persistent image. No Apple account or
# signing identity is used: xcodebuild consumes the bundled public iOS SDK and
# Flutter packages Runner.app with --no-codesign.
"${ssh_cmd[@]}" 'test -x "$HOME/flutter/bin/flutter" || git clone --depth 1 --branch 3.47.0 https://github.com/flutter/flutter.git "$HOME/flutter"'
"${ssh_cmd[@]}" "set -euo pipefail
  export PATH=\"\$HOME/flutter/bin:/opt/homebrew/bin:/usr/local/bin:\$PATH\"
  cd '/Volumes/My Shared Files/$SHARED_NAME/flutter'
  xcodebuild -version
  flutter --version
  flutter pub get
  flutter build ios --release --no-codesign --dart-define=MIND_RECIPE_API_BASE='$API_URL'
  rm -rf build/ios/ipa/Payload
  mkdir -p build/ios/ipa/Payload
  cp -R build/ios/iphoneos/Runner.app build/ios/ipa/Payload/
  cd build/ios/ipa
  rm -f mind-recipe-ios-unsigned.ipa
  /usr/bin/zip -qry mind-recipe-ios-unsigned.ipa Payload
  test -s mind-recipe-ios-unsigned.ipa"

test -s flutter/build/ios/ipa/mind-recipe-ios-unsigned.ipa
unzip -t flutter/build/ios/ipa/mind-recipe-ios-unsigned.ipa >/dev/null
