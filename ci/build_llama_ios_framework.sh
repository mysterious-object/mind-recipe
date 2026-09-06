#!/usr/bin/env bash
set -euo pipefail

# Build the exact llama.cpp ABI used by the vendored Dart bindings and embed it
# as a loadable iOS framework. The cache makes this a one-time build on the
# persistent Jenkins/Tart worker while keeping GitHub runners reproducible.
LLAMA_COMMIT=4ffc47cb2001e7d523f9ff525335bbe34b1a2858
MIN_IOS_VERSION=15.0
APP_BUNDLE=${1:?Runner.app path is required}
CACHE_ROOT=${MIND_RECIPE_LLAMA_IOS_CACHE:-"$HOME/.cache/mindrecipe/llama-ios-$LLAMA_COMMIT"}
SOURCE_DIR="$CACHE_ROOT/source"
BUILD_DIR="$CACHE_ROOT/build-device"
FRAMEWORK_DIR="$CACHE_ROOT/llama.framework"

command -v cmake >/dev/null
command -v xcrun >/dev/null

if [[ ! -x "$FRAMEWORK_DIR/llama" ]]; then
  mkdir -p "$CACHE_ROOT"
  if [[ ! -d "$SOURCE_DIR/.git" ]]; then
    git clone --filter=blob:none https://github.com/ggml-org/llama.cpp.git "$SOURCE_DIR"
  fi
  git -C "$SOURCE_DIR" fetch --depth 1 origin "$LLAMA_COMMIT"
  git -C "$SOURCE_DIR" checkout --detach "$LLAMA_COMMIT"

  cmake -S "$SOURCE_DIR" -B "$BUILD_DIR" -G Xcode \
    -DCMAKE_SYSTEM_NAME=iOS \
    -DCMAKE_OSX_SYSROOT=iphoneos \
    -DCMAKE_OSX_ARCHITECTURES=arm64 \
    -DCMAKE_OSX_DEPLOYMENT_TARGET="$MIN_IOS_VERSION" \
    -DCMAKE_XCODE_ATTRIBUTE_CODE_SIGNING_REQUIRED=NO \
    -DCMAKE_XCODE_ATTRIBUTE_CODE_SIGNING_ALLOWED=NO \
    -DCMAKE_XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY= \
    -DBUILD_SHARED_LIBS=OFF \
    -DLLAMA_BUILD_COMMON=OFF \
    -DLLAMA_BUILD_EXAMPLES=OFF \
    -DLLAMA_BUILD_TOOLS=OFF \
    -DLLAMA_BUILD_TESTS=OFF \
    -DLLAMA_BUILD_SERVER=OFF \
    -DGGML_METAL=ON \
    -DGGML_METAL_EMBED_LIBRARY=ON \
    -DGGML_BLAS=ON \
    -DGGML_NATIVE=OFF \
    -DGGML_OPENMP=OFF
  cmake --build "$BUILD_DIR" --config Release -j "$(sysctl -n hw.logicalcpu)" -- -quiet

  required=(libllama.a libggml.a libggml-base.a libggml-cpu.a libggml-metal.a libggml-blas.a)
  libraries=()
  for name in "${required[@]}"; do
    path=$(find "$BUILD_DIR" -type f -path '*Release-iphoneos*' -name "$name" -print -quit)
    [[ -n "$path" ]] || { echo "IOS_LLAMA_LIBRARY_MISSING:$name" >&2; exit 31; }
    libraries+=("$path")
  done

  rm -rf "$FRAMEWORK_DIR"
  mkdir -p "$FRAMEWORK_DIR/Headers" "$FRAMEWORK_DIR/Modules"
  combined="$CACHE_ROOT/libllama-combined.a"
  xcrun libtool -static -o "$combined" "${libraries[@]}"
  xcrun -sdk iphoneos clang++ -dynamiclib \
    -isysroot "$(xcrun --sdk iphoneos --show-sdk-path)" \
    -arch arm64 \
    -miphoneos-version-min="$MIN_IOS_VERSION" \
    -Wl,-force_load,"$combined" \
    -framework Foundation -framework Metal -framework Accelerate \
    -install_name '@rpath/llama.framework/llama' \
    -o "$FRAMEWORK_DIR/llama"

  cp "$SOURCE_DIR/include/llama.h" "$FRAMEWORK_DIR/Headers/"
  cp "$SOURCE_DIR/ggml/include/"*.h "$FRAMEWORK_DIR/Headers/"
  cat > "$FRAMEWORK_DIR/Modules/module.modulemap" <<'EOF'
framework module llama {
  umbrella "Headers"
  link "c++"
  link framework "Accelerate"
  link framework "Metal"
  link framework "Foundation"
  export *
}
EOF
  cat > "$FRAMEWORK_DIR/Info.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>llama</string>
<key>CFBundleIdentifier</key><string>app.mindrecipe.llama</string>
<key>CFBundleInfoDictionaryVersion</key><string>6.0</string>
<key>CFBundleName</key><string>llama</string>
<key>CFBundlePackageType</key><string>FMWK</string>
<key>CFBundleShortVersionString</key><string>1.0</string>
<key>CFBundleVersion</key><string>1</string>
<key>MinimumOSVersion</key><string>$MIN_IOS_VERSION</string>
<key>CFBundleSupportedPlatforms</key><array><string>iPhoneOS</string></array>
</dict></plist>
EOF
fi

mkdir -p "$APP_BUNDLE/Frameworks"
rm -rf "$APP_BUNDLE/Frameworks/llama.framework"
cp -R "$FRAMEWORK_DIR" "$APP_BUNDLE/Frameworks/llama.framework"
xcrun vtool -show-build "$APP_BUNDLE/Frameworks/llama.framework/llama" >/dev/null
xcrun nm -gU "$APP_BUNDLE/Frameworks/llama.framework/llama" | grep -q '_llama_model_load_from_file'
