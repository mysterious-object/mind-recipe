"""Mind Nav speech rendering with bounded, non-identifying voice presets.

The service never clones a performer or character voice. A source recording may
only be added after its owner and license have been verified; until then the
app uses original neural-voice presets.
"""
from __future__ import annotations

import asyncio
import base64
import os
import re
import subprocess
import tempfile
import threading
from dataclasses import dataclass


@dataclass(frozen=True)
class VoicePreset:
    edge_voice: str
    description: str
    rate_offset: int = 0
    pitch: str = "+0Hz"


# `saved_british` preserves the prior app voice without attaching it to a
# copyrighted character or performer. It is intentionally not the default.
VOICE_PRESETS: dict[str, VoicePreset] = {
    "mind_nav_companion": VoicePreset(
        "en-GB-SoniaNeural",
        "Warm, present British female voice — the original Mind Nav default.",
        rate_offset=1,
        pitch="-1Hz",
    ),
    "grounded": VoicePreset(
        "en-US-GuyNeural",
        "Steady and lower-register for grounding exercises.",
        rate_offset=-8,
    ),
    "bright": VoicePreset(
        "en-US-AriaNeural",
        "Lively, clear, and encouraging for reflective moments.",
        rate_offset=-4,
    ),
    "saved_british": VoicePreset(
        "en-GB-RyanNeural",
        "Saved earlier voice — a bright British narrator.",
        rate_offset=4,
        pitch="+18Hz",
    ),
}


def _master_mp3(source: bytes) -> tuple[bytes, bool]:
    """Master encoded speech with fades, loudness control, and a peak ceiling."""
    try:
        with tempfile.TemporaryDirectory(prefix="mind-nav-voice-") as folder:
            input_path = os.path.join(folder, "raw.mp3")
            output_path = os.path.join(folder, "mastered.mp3")
            with open(input_path, "wb") as output:
                output.write(source)
            filters = (
                "highpass=f=65,lowpass=f=12500,"
                "acompressor=threshold=-20dB:ratio=2:attack=18:release=140:makeup=1.5dB,"
                "loudnorm=I=-17:TP=-2:LRA=6,"
                "alimiter=limit=0.89:level=disabled,"
                "afade=t=in:st=0:d=0.055,"
                "areverse,afade=t=in:st=0:d=0.075,areverse"
            )
            completed = subprocess.run(
                [
                    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                    "-i", input_path, "-af", filters, "-ac", "1", "-ar", "44100",
                    "-c:a", "libmp3lame", "-b:a", "128k", output_path,
                ],
                check=False,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=20,
            )
            if completed.returncode == 0 and os.path.getsize(output_path) > 0:
                with open(output_path, "rb") as rendered:
                    return rendered.read(), True
    except (FileNotFoundError, OSError, subprocess.SubprocessError):
        pass
    return source, False


def _speech_friendly_text(text: str) -> str:
    """Remove visual formatting that makes neural speech sound mechanical."""
    spoken = re.sub(r"\[([^]]+)]\([^)]+\)", r"\1", text)
    spoken = re.sub(r"(?m)^\s*#{1,6}\s*", "", spoken)
    spoken = re.sub(r"(?m)^\s*[-•]\s+", "", spoken)
    spoken = re.sub(r"[*_`]", "", spoken)
    spoken = re.sub(r"\s+", " ", spoken)
    return spoken.strip()


def prepare_delivery(text: str, speed: float) -> tuple[str, float, bool]:
    """Shape conversational punctuation and slow only guided instructions."""
    original = text.strip()
    raw = _speech_friendly_text(text)
    segments = [
        segment.strip()
        for segment in re.split(r"(?<=[.!?])\s+", raw)
        if segment.strip()
    ]
    guided_pacing = len(segments) >= 3 or bool(
        re.search(r"(?:^|\n)\s*(?:\d+[.)]|[-•])\s+", original)
    )
    # Multi-step guidance needs audible space for the member to follow each
    # action. Ordinary conversation remains quick and responsive.
    if guided_pacing:
        cleaned = " … ".join(segments)
    elif len(segments) >= 2:
        # A restrained pause lets acknowledgment land before a suggestion or
        # question. This is closer to turn-taking than continuous narration.
        cleaned = " … ".join(segments)
    else:
        cleaned = raw
    clamped_speed = max(0.75, min(float(speed), 1.2))
    if guided_pacing:
        clamped_speed = max(0.84, clamped_speed - 0.035)
    return cleaned, clamped_speed, guided_pacing


def _delivery_tone(text: str) -> tuple[int, int, str]:
    """Return small rate/pitch changes; punctuation still drives most prosody."""
    lowered = text.lower()
    if any(word in lowered for word in ("overwhelmed", "scared", "grief", "hurt", "exhausted")):
        return -2, -1, "grounded"
    if text.rstrip().endswith("?"):
        return 0, 2, "curious"
    return 0, 0, "present"


def synthesize(
    text: str,
    speed: float = 0.94,
    voice: str = "mind_nav_companion",
) -> dict[str, object]:
    """Render a short response and return mastered MP3 bytes in base64."""
    cleaned, clamped_speed, guided_pacing = prepare_delivery(text, speed)
    if not cleaned:
        return {"error": "No speech text supplied"}
    preset = VOICE_PRESETS.get(voice, VOICE_PRESETS["mind_nav_companion"])
    tone_rate, tone_pitch, delivery_tone = _delivery_tone(cleaned)
    rate = int((clamped_speed - 1.0) * 100) + preset.rate_offset + tone_rate
    rate_str = f"{rate:+d}%"
    base_pitch = int(re.search(r"[+-]?\d+", preset.pitch).group())
    pitch_str = f"{base_pitch + tone_pitch:+d}Hz"

    try:
        import edge_tts

        audio_data = bytearray()
        error_holder: list[Exception] = []

        async def render() -> None:
            try:
                communicate = edge_tts.Communicate(
                    cleaned,
                    preset.edge_voice,
                    rate=rate_str,
                    pitch=pitch_str,
                )
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        audio_data.extend(chunk["data"])
            except Exception as error:
                error_holder.append(error)

        def run_render() -> None:
            loop = asyncio.new_event_loop()
            try:
                loop.run_until_complete(render())
            finally:
                loop.close()

        worker = threading.Thread(target=run_render, daemon=True)
        worker.start()
        worker.join(timeout=30)
        if worker.is_alive():
            return {"error": "Voice rendering timed out"}
        if error_holder:
            return {"error": "Voice rendering is temporarily unavailable"}
        if not audio_data:
            return {"error": "Voice renderer produced no audio"}

        mastered, was_mastered = _master_mp3(bytes(audio_data))
        return {
            "success": True,
            "audio_base64": base64.b64encode(mastered).decode("utf-8"),
            "audio_format": "mp3",
            "voice": voice if voice in VOICE_PRESETS else "mind_nav_companion",
            "mastered": was_mastered,
            "guided_pacing": guided_pacing,
            "delivery_tone": delivery_tone,
            "mastering": "fade, loudness normalization, and peak limiting"
            if was_mastered else "provider audio",
        }
    except Exception:
        return {"error": "Voice synthesis failed"}


def get_available_voices() -> list[dict[str, str]]:
    return [
        {"name": name, "voice": preset.edge_voice, "description": preset.description}
        for name, preset in VOICE_PRESETS.items()
    ]
