#!/usr/bin/env bash
set -euo pipefail

# The production host deliberately terminates mobile compilers under pressure.
# Do not disable the guard or obscure the process names to evade it. Detect the
# condition before Gradle starts and direct the build to an isolated CI worker.
if [[ "$(uname -s)" != Linux ]] ||
   ! command -v systemctl >/dev/null ||
   ! systemctl is-active --quiet secops-production-build-guard.timer; then
  exit 0
fi

available_kb=$(awk '/MemAvailable:/ {print $2}' /proc/meminfo)
disk_percent=$(df -P / | awk 'NR==2 {gsub(/%/, "", $5); print $5}')
if (( available_kb < 1048576 || disk_percent >= 82 )); then
  echo "MOBILE_BUILD_HOST_PRESSURE: available memory ${available_kb} KiB; disk ${disk_percent}%." >&2
  echo 'The production guard requires >=1048576 KiB available memory and <82% disk usage.' >&2
  echo 'Use an isolated CI worker. Do not disable the production guard or delete retained builds.' >&2
  exit 24
fi
