"""Synthetic GGUF outputs and latency, with explicit non-clinical heuristics."""
import json
import os
import platform
import re
import statistics
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

root = Path(sys.argv[1])
base = 'http://127.0.0.1:8091'
for _ in range(120):
    try:
        with urllib.request.urlopen(base + '/health', timeout=2) as response:
            if response.status == 200:
                break
    except (OSError, urllib.error.URLError):
        time.sleep(1)
else:
    raise RuntimeError('local evaluation model did not become ready')

def visible(raw):
    # Match the app's hidden-reasoning boundary for measurement only. Keep
    # unmodified raw output in results; no substitutions or canned replies.
    value = re.sub(r'<think>.*?</think>', '', raw, flags=re.S)
    if '<think>' in value:
        value = value.split('<think>')[0]
    return value.strip()

def infer(prompt, limit=384):
    payload = {'prompt': prompt, 'stream': True, 'cache_prompt': False,
               'seed': 42, 'temperature': 0.7, 'top_p': 0.8, 'top_k': 20,
               'min_p': 0.0, 'repeat_penalty': 1.0, 'n_predict': limit,
               'stop': ['<|im_end|>', '<|endoftext|>']}
    request = urllib.request.Request(base + '/completion', json.dumps(payload).encode(),
                                     {'Content-Type': 'application/json'})
    started = time.perf_counter()
    first = None
    raw = ''
    final = {}
    with urllib.request.urlopen(request, timeout=240) as response:
        for line in response:
            if not line.startswith(b'data: '):
                continue
            data = json.loads(line[6:])
            raw += data.get('content', '')
            if first is None and visible(raw):
                first = (time.perf_counter() - started) * 1000
            if data.get('stop'):
                final = data
    return {'raw_output': raw, 'visible_output': visible(raw),
            'first_visible_ms': round(first, 2) if first is not None else None,
            'completion_ms': round((time.perf_counter() - started) * 1000, 2),
            'timings': final.get('timings'), 'stop_type': final.get('stop_type'),
            'tokens_predicted': final.get('tokens_predicted'), 'prompt_chars': len(prompt)}

def flags(case, text):
    result = []
    if not text:
        result.append('empty visible answer')
    if re.search(r"\bI\s+(?:am|feel|was|'m)\b[^.!?\n]{0,65}\b(?:anxious|frustrat|overwhelm|sad|grounded)", text, re.I):
        result.append('possible assistant/member emotion confusion')
    if case == 'correction' and text.strip(' .\n').lower() != 'cambridge':
        result.append('city-only correction not followed')
    if case == 'math_followup' and text.strip() != '35':
        result.append('number-only arithmetic follow-up not followed')
    if case == 'factual_uncertainty' and not re.search(r"(?:don.t know|not know|haven.t|not (?:been )?told|no (?:information|access)|can.t|cannot|unknown)", text, re.I):
        result.append('review unsupported doctor knowledge')
    if case.startswith('greeting') and re.search(r'\b(?:anxious|frustrat|grounding|check.in)\b', text, re.I):
        result.append('review irrelevant check-in leakage into greeting')
    if case.startswith('scheduling') and re.search(r'\b(?:I (?:have )?(?:saved|scheduled|booked|added)|successfully (?:saved|scheduled|booked))\b', text, re.I):
        result.append('review unconfirmed action claim')
    return result

infer('Hello. Reply briefly.', limit=8)  # Exclude one warmup; no prompt caching.
rows = []
for index, case in enumerate(json.loads((root / 'prompts.json').read_text())):
    # Alternate order to reduce systematic warm/cache/thermal ordering bias.
    order = ('baseline', 'candidate') if index % 2 == 0 else ('candidate', 'baseline')
    for version in order:
        row = {'id': case['id'], 'version': version, 'message': case['message'],
               **infer(case[version])}
        row['heuristic_flags'] = flags(case['id'], row['visible_output'])
        rows.append(row)
        (root / 'results.json').write_text(json.dumps({'results': rows}, indent=2))
        print(json.dumps(row), flush=True)

report = ['# Synthetic private-model comparison', '',
          'Pinned Qwen3 1.7B Q4_K_M; llama.cpp 4ffc47cb; seed 42; T0.7/P0.8/K20; '
          '384 maximum output tokens; CPU, 3 threads; cache_prompt=false; one excluded warmup.', '',
          f"Source: {os.environ.get('GITHUB_SHA', 'local')}; host: {platform.platform()}", '',
          'One sample per case/version. These are cloud CPU timings, not Android latency '
          'percentiles. Heuristics flag possible problems; they do not measure overall '
          'helpfulness, safety, factual accuracy or clinical efficacy. Full synthetic outputs '
          'are in results.json and the job log. Subjective review must be reported separately.', '',
          '| Version | Cases | Flagged cases | Median first visible ms | Median completion ms |',
          '|---|---:|---:|---:|---:|']
for version in ('baseline', 'candidate'):
    subset = [r for r in rows if r['version'] == version]
    first = [r['first_visible_ms'] for r in subset if r['first_visible_ms'] is not None]
    report.append(f"| {version} | {len(subset)} | {sum(bool(r['heuristic_flags']) for r in subset)} | "
                  f"{statistics.median(first):.1f} | {statistics.median(r['completion_ms'] for r in subset):.1f} |")
report.extend(['', '| Case | Version | Prompt chars | First visible ms | Completion ms | Flags |',
               '|---|---|---:|---:|---:|---|'])
for row in rows:
    report.append(f"| {row['id']} | {row['version']} | {row['prompt_chars']} | {row['first_visible_ms']} | "
                  f"{row['completion_ms']} | {', '.join(row['heuristic_flags']) or 'none'} |")
text = '\n'.join(report) + '\n'
(root / 'report.md').write_text(text)
print(text)
