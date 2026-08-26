#!/usr/bin/env bash
set -euo pipefail

# Upload a build with a Jenkins-managed Google service-account credential.
# The JSON credential is read from a temporary credentials-binding file and is
# never copied into the workspace or printed.
artifact=$1
drive_name=$2
folder_id=$3
share_email=${4:-}
credential_file=${GOOGLE_APPLICATION_CREDENTIALS:?Jenkins Google credential is required}

private_key_file=$(mktemp)
metadata_file=$(mktemp)
body_file=$(mktemp)
cleanup() { rm -f "$private_key_file" "$metadata_file" "$body_file"; }
trap cleanup EXIT

jq -r .private_key "$credential_file" > "$private_key_file"
client_email=$(jq -r .client_email "$credential_file")
now=$(date +%s)
header=$(printf '%s' '{"alg":"RS256","typ":"JWT"}' | openssl base64 -A | tr '+/' '-_' | tr -d '=')
claims=$(jq -cn --arg iss "$client_email" --argjson iat "$now" \
  --argjson exp "$((now + 3300))" '{iss:$iss,scope:"https://www.googleapis.com/auth/drive",aud:"https://oauth2.googleapis.com/token",iat:$iat,exp:$exp}' \
  | openssl base64 -A | tr '+/' '-_' | tr -d '=')
signature=$(printf '%s.%s' "$header" "$claims" | openssl dgst -sha256 -sign "$private_key_file" -binary \
  | openssl base64 -A | tr '+/' '-_' | tr -d '=')
access_token=$(curl -fsS https://oauth2.googleapis.com/token \
  --data-urlencode grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer \
  --data-urlencode assertion="$header.$claims.$signature" | jq -er .access_token)

jq -cn --arg name "$drive_name" --arg parent "$folder_id" '{name:$name,parents:[$parent]}' > "$metadata_file"
boundary="mind-recipe-build-${BUILD_NUMBER:-local}"
{
  printf -- '--%s\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' "$boundary"
  cat "$metadata_file"
  printf '\r\n--%s\r\nContent-Type: application/octet-stream\r\n\r\n' "$boundary"
  cat "$artifact"
  printf '\r\n--%s--\r\n' "$boundary"
} > "$body_file"
file_id=$(curl -fsS -X POST 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id' \
  -H "Authorization: Bearer $access_token" \
  -H "Content-Type: multipart/related; boundary=$boundary" --data-binary @"$body_file" | jq -er .id)

if [[ -n "$share_email" ]]; then
  jq -cn --arg email "$share_email" '{type:"user",role:"reader",emailAddress:$email}' > "$metadata_file"
  curl -fsS -X POST "https://www.googleapis.com/drive/v3/files/$file_id/permissions?sendNotificationEmail=true" \
    -H "Authorization: Bearer $access_token" -H 'Content-Type: application/json' \
    --data-binary @"$metadata_file" >/dev/null
fi
printf 'Uploaded %s (Drive file %s)\n' "$drive_name" "$file_id"
