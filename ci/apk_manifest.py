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
}, indent=2))
