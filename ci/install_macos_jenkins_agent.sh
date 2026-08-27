#!/usr/bin/env bash
set -euo pipefail

# Run once on the macOS builder. The inbound secret is supplied at runtime and
# is written only to the user's protected launchd plist, never to this repo.
JENKINS_URL=${JENKINS_URL:-https://jenkins.mysteriousobject.xyz}
JENKINS_NODE=${JENKINS_NODE:-mac-builder}
JENKINS_AGENT_SECRET=${JENKINS_AGENT_SECRET:?set JENKINS_AGENT_SECRET from the Jenkins node page}
AGENT_ROOT=${JENKINS_AGENT_ROOT:-$HOME/jenkins-agent}
PLIST_PATH="$HOME/Library/LaunchAgents/co.contextfield.mind-recipe.jenkins-agent.plist"

mkdir -p "$AGENT_ROOT" "$HOME/Library/LaunchAgents"
chmod 700 "$AGENT_ROOT"
curl --fail --silent --show-error --location \
  "$JENKINS_URL/jnlpJars/agent.jar" -o "$AGENT_ROOT/agent.jar"

/usr/bin/python3 - "$PLIST_PATH" "$JENKINS_URL" "$JENKINS_NODE" \
  "$JENKINS_AGENT_SECRET" "$AGENT_ROOT" <<'PY'
import plistlib, sys
path, url, node, secret, root = sys.argv[1:]
value = {
    "Label": "co.contextfield.mind-recipe.jenkins-agent",
    "ProgramArguments": [
        "/usr/bin/java", "-jar", f"{root}/agent.jar",
        "-url", url, "-secret", secret, "-name", node,
        "-workDir", root, "-webSocket",
    ],
    "RunAtLoad": True,
    "KeepAlive": {"SuccessfulExit": False},
    "ProcessType": "Background",
    "StandardOutPath": f"{root}/agent.log",
    "StandardErrorPath": f"{root}/agent-error.log",
}
with open(path, "wb") as handle:
    plistlib.dump(value, handle)
PY
chmod 600 "$PLIST_PATH"
launchctl bootout "gui/$(id -u)" "$PLIST_PATH" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST_PATH"
launchctl kickstart -k "gui/$(id -u)/co.contextfield.mind-recipe.jenkins-agent"

echo 'mac-builder launch agent installed and started.'
