import re

def possible_assistant_emotion_claim(text):
    """Review aid, not a semantic accuracy/safety classifier."""
    # Ignore clearly quoted speech, including single-quoted contractions.
    unquoted = re.sub(r'"[^"\n]*"|“[^”\n]*”', '[quoted speech]', text)
    unquoted = re.sub(r"(?<!\w)'(?:[^'\n]|(?<=\w)'(?=\w))*'(?!\w)", '[quoted speech]', unquoted)
    claims = re.finditer(
        r"\bI(?:['’]m|\s+(?:am|feel|was|felt|experience))\b"
        r"(?P<between>[^.!?\n]{0,100}?)\b"
        r"(?:anxious|anxiety|frustrat(?:ed|ion)|overwhelmed|sad|grounded)\b",
        unquoted, re.I)
    for claim in claims:
        prefix = unquoted[:claim.start()]
        attributed = re.search(
            r"(?:you (?:say|said|wrote|reported)|(?:the )?(?:member|user) "
            r"(?:says|said|wrote|reports|reported)|your words (?:were|are)|member|user)\s*[:,]?\s*$",
            prefix, re.I)
        between = claim['between']
        not_a_self_report = re.search(
            r"\b(?:not|never|without|no|you|your|member|user|they|their)\b", between, re.I)
        if not attributed and not not_a_self_report:
            return True
    return False

def flags(case, text):
    result = []
    if not text:
        result.append('empty visible answer')
    if possible_assistant_emotion_claim(text):
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
    if case.startswith('meeting_plan'):
        if '?' in text:
            result.append('no-question instruction not followed')
        if re.search(r'\b(?:breath|breathing|visualiz|grounding)\b', text, re.I):
            result.append('review practice substituted for meeting preparation')
        if not re.search(r'\b(?:meeting|agenda|notes|questions|points|prepare|review)\b', text, re.I):
            result.append('review missing practical meeting preparation')
    return result

