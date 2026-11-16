"""Record identity of the actual built APK, never infer it from the file name."""
import hashlib
import json
import os
import re
import sys
from pathlib import Path

apk, badging = map(Path, sys.argv[1:])
text = badging.read_text()
package = re.search(r"package: name='([^']+)' versionCode='([^']+)' versionName='([^']+)'", text)
assert package, 'aapt did not report package identity'
label = re.search(r"application-label:'([^']+)'", text)
certificate_file = apk.parent / 'signer-certificate.txt'
previous_file = apk.parent / 'previous-2157-certificate.txt'
def certificate(path):
    match = re.search(r'Signer #1 certificate SHA-256 digest: ([0-9a-fA-F]+)', path.read_text()) if path.exists() else None
    return match[1].lower() if match else None
signer = certificate(certificate_file)
previous = certificate(previous_file)
print(json.dumps({
    'status': 'test candidate; device verification pending',
    'source_commit': os.environ.get('GITHUB_SHA'),
    'branch': os.environ.get('GITHUB_REF_NAME'),
    'run_id': os.environ.get('GITHUB_RUN_ID'),
    'file': apk.name,
    'package': package[1],
    'version_code': int(package[2]),
    'version_name': package[3],
    'label': label[1] if label else None,
    'size_bytes': apk.stat().st_size,
    'sha256': hashlib.sha256(apk.read_bytes()).hexdigest(),
    'signing_status': 'signature verified; CI test signer' if signer else 'not verified by this manifest',
    'certificate_sha256': signer,
    'previous_2157_certificate_sha256': previous,
    'certificate_matches_2157': signer == previous if signer and previous else None,
    'update_of_2157': False,
    'installation_note': 'Separate authorized candidate package. Never uninstall or clear 2157; its signing private key was not available in the cloud checkout.',
}, indent=2))
