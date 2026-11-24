"""Reject local language model runtimes and weights in mobile archives."""
import re
import sys
import zipfile

runtime = re.compile(r"(?:^|/)(?:lib)?(?:llama|ggml)[^/]*\.(?:so(?:\.\d+)*|dylib|framework)(?:/|$)|\.gguf$", re.I)
with zipfile.ZipFile(sys.argv[1]) as archive:
    if not archive.namelist():
        sys.exit("Empty mobile archive")
    forbidden = [name for name in archive.namelist() if runtime.search(name)]
    if forbidden:
        sys.exit("Unexpected inference assets: " + ", ".join(forbidden))
