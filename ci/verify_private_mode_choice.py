"""Tie the gate-only fix to exact measured 39ffd35 prompts and outputs."""
import hashlib
import json
import os
import sys
from pathlib import Path

old_root, new_root = map(Path, sys.argv[1:])
old_prompts = {r['id']: r for r in json.loads((old_root / 'prompts.json').read_text())}
new_prompts = {r['id']: r for r in json.loads((new_root / 'prompts.json').read_text())}
old_results = json.loads((old_root / 'results.json').read_text())
source = '39ffd355b36758005a2f5ba70dd8fdee0ac8a8e3'
assert old_results['metadata']['source_commit'] == source
checks = []
for case, before in old_prompts.items():
    for mode in ('baseline', 'candidate', 'baseline_thinking', 'candidate_thinking'):
        if mode not in before:
            continue
        assert before[mode] == new_prompts[case][mode], (case, mode, 'prompt changed during gate-only fix')
        checks.append({'case': case, 'mode': mode,
                       'prompt_sha256': hashlib.sha256(before[mode].encode()).hexdigest()})
proof = {'gate_fix_source': os.environ['GITHUB_SHA'], 'paired_output_source': source,
         'paired_run_id': 43769714359, 'paired_artifact_id': 14183992910,
         'status': 'all serialized prompts byte-identical; only interactive mode selection changed',
         'prompt_hashes': checks,
         'planning_comparison': [r for r in old_results['results'] if r['id'] == 'personal_plan'],
         'device_acceptance': 'not performed; installation platform-blocked'}
text = json.dumps(proof, indent=2)
(new_root / 'mode-choice-proof.json').write_text(text + '\n')
print(text)
