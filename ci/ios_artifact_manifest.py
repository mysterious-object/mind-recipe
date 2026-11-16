"""Manifest of an actual unsigned IPA; no signing identity or store claim."""
import hashlib
import json
import os
import plistlib
import sys
import zipfile
from pathlib import Path

ipa = Path(sys.argv[1])
with zipfile.ZipFile(ipa) as archive:
    assert archive.testzip() is None
    info = plistlib.loads(archive.read('Payload/Runner.app/Info.plist'))
    names = archive.namelist()
    signed = any(n.startswith('Payload/Runner.app/_CodeSignature/') for n in names)
    provisioned = 'Payload/Runner.app/embedded.mobileprovision' in names
assert str(info['CFBundleVersion']) == '2158', info['CFBundleVersion']
assert not signed and not provisioned, 'Expected explicitly unsigned candidate IPA'
print(json.dumps({
    'source_commit': os.environ['GITHUB_SHA'], 'run_id': os.environ['GITHUB_RUN_ID'],
    'file': ipa.name, 'bundle_id': info['CFBundleIdentifier'],
    'version_code': info['CFBundleVersion'], 'display_version': info['CFBundleShortVersionString'],
    'label': info.get('CFBundleDisplayName', info['CFBundleName']),
    'size_bytes': ipa.stat().st_size, 'sha256': hashlib.sha256(ipa.read_bytes()).hexdigest(),
    'signing_status': 'UNSIGNED (--no-codesign): no root signature directory or provisioning profile; not device-installable as delivered',
    'certificate_sha256': None, 'zip_integrity': 'passed',
    'codesign_inspection': (ipa.parent / 'ios-signing-inspection.txt').read_text() if (ipa.parent / 'ios-signing-inspection.txt').exists() else None,
    'native_tests': 'same-run iPhone simulator RunnerTests results uploaded separately',
}, indent=2))
