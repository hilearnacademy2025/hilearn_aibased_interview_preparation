"""
HiLearn AI Interview Prep - Voice Analysis Service
====================================================
Day 3: Speech-to-Text (Google Cloud STT) + Voice Analytics (Librosa).

Public API
----------
transcribe_audio(audio_bytes, filename) -> TranscribeResult
analyze_voice(audio_bytes, filename)    -> VoiceAnalysisResult
process_audio_url(url)                  -> (TranscribeResult, VoiceAnalysisResult)

All functions are safe to call independently; they never raise — errors
are logged and a sensible fallback is returned instead.
"""
from __future__ import annotations

import asyncio
import os
import re
import tempfile
import uuid
from dataclasses import dataclass, field
from typing import List, Optional, Tuple

import aiohttp
import numpy as np
from loguru import logger
from google.cloud import speech
from google.oauth2 import service_account

from app.core.config import get_settings

settings = get_settings()

# ─────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────

AUDIO_DOWNLOAD_TIMEOUT_SECONDS = 10
WHISPER_TIMEOUT_SECONDS = 60

# Filler words to detect (case-insensitive, word-boundary matched)
FILLER_WORDS: List[str] = [
    "um", "uh", "ah", "er", "hmm", "hm",
    "like", "you know", "sort of", "kind of",
    "basically", "literally", "actually",
    "right", "okay", "so",
]

# Pacing thresholds (words per minute)
WPM_TOO_SLOW = 100
WPM_IDEAL_LOW = 120
WPM_IDEAL_HIGH = 160
WPM_TOO_FAST = 180

# ─────────────────────────────────────────────────────────
# Google Cloud Client (singleton)
# ─────────────────────────────────────────────────────────

_speech_client: Optional[speech.SpeechAsyncClient] = None

def _get_speech_client() -> speech.SpeechAsyncClient:
    """Return a cached Google Cloud SpeechAsyncClient instance."""
    global _speech_client
    if _speech_client is None:
        try:
            if os.path.exists(settings.google_cloud_credentials_json):
                creds = service_account.Credentials.from_service_account_file(
                    settings.google_cloud_credentials_json
                )
                _speech_client = speech.SpeechAsyncClient(credentials=creds)
                logger.info("Google Cloud Speech client initialised with credentials file")
            else:
                _speech_client = speech.SpeechAsyncClient()
                logger.info("Google Cloud Speech client initialised (fallback ADC)")
        except Exception as e:
            logger.warning(f"Failed to initialise Google Cloud client: {e}")
            _speech_client = speech.SpeechAsyncClient()
            
    return _speech_client


# ─────────────────────────────────────────────────────────
# 1. Google Cloud STT Transcription
# ─────────────────────────────────────────────────────────

async def transcribe_audio(
    audio_bytes: bytes,
    filename: str = "audio.wav",
) -> TranscribeResult:
    """
    Transcribe raw audio bytes using Google Cloud Speech-to-Text.

    Parameters
    ----------
    audio_bytes : raw audio content
    filename    : original filename

    Returns
    -------
    TranscribeResult  (never raises)
    """
    logger.info(
        "GoogleSTT | transcribe | file={} | size={:.1f} KB",
        filename, len(audio_bytes) / 1024,
    )

    try:
        client = _get_speech_client()

        # Build audio configuration
        audio = speech.RecognitionAudio(content=audio_bytes)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS if "webm" in filename else speech.RecognitionConfig.AudioEncoding.LINEAR16,
            language_code="en-US",
            enable_automatic_punctuation=True,
        )

        response = await client.recognize(config=config, audio=audio)

        if not response.results:
            return TranscribeResult(
                transcription="",
                confidence=0.0,
                success=False,
                error="No results returned from Google Cloud STT",
            )

        # Aggregate transcript and average confidence
        full_transcript = []
        confidences = []
        
        for result in response.results:
            alt = result.alternatives[0]
            full_transcript.append(alt.transcript)
            confidences.append(alt.confidence)

        avg_confidence = float(np.mean(confidences)) if confidences else 0.85
        text = " ".join(full_transcript).strip()

        logger.success(
            "GoogleSTT | transcribe | OK | words={} | confidence={:.2f}",
            len(text.split()), avg_confidence,
        )

        return TranscribeResult(
            transcription=text,
            confidence=round(avg_confidence, 3),
            language="en-US",
            duration_seconds=0.0, # duration will be derived by librosa later
            success=True,
        )

    except Exception as exc:
        logger.error("GoogleSTT | transcribe | FAILED | error={}", exc)
        return TranscribeResult(
            transcription="",
            confidence=0.0,
            success=False,
            error=str(exc),
        )


# ─────────────────────────────────────────────────────────
# 2. Librosa Voice Analysis
# ─────────────────────────────────────────────────────────

def _count_filler_words(text: str) -> Tuple[int, List[str]]:
    """
    Detect filler words in transcription text.

    Returns (total_count, unique_fillers_detected).
    """
    text_lower = text.lower()
    detected: List[str] = []
    total = 0

    for filler in FILLER_WORDS:
        # Use word-boundary regex for single-word fillers; simple 'in' for phrases
        if " " in filler:
            count = text_lower.count(filler)
        else:
            pattern = rf"\b{re.escape(filler)}\b"
            matches = re.findall(pattern, text_lower)
            count = len(matches)

        if count > 0:
            detected.append(filler)
            total += count

    return total, detected


def _calculate_wpm(word_count: int, duration_seconds: float) -> int:
    """Compute words-per-minute; returns 0 if duration unknown."""
    if duration_seconds <= 0:
        return 0
    minutes = duration_seconds / 60.0
    return int(round(word_count / minutes))


def _score_from_filler_and_pacing(
    filler_count: int,
    wpm: int,
    word_count: int,
) -> Tuple[float, float]:
    """
    Heuristic scoring (0–10) from filler words and speaking pace.

    Returns (confidence_score, clarity_score).
    """
    # ── Confidence score (based on filler word rate) ──────────────────
    if word_count == 0:
        filler_rate = 0.0
    else:
        filler_rate = filler_count / word_count  # fraction of words that are fillers

    # Perfect = 0 fillers  → 10.0
    # Heavy   = >20% fillers → floor at 3.0
    confidence_score = max(3.0, 10.0 - (filler_rate * 40))
    confidence_score = round(min(10.0, confidence_score), 1)

    # ── Clarity score (based on pacing) ───────────────────────────────
    if wpm == 0:
        clarity_score = 7.0  # neutral default when no timing info
    elif WPM_IDEAL_LOW <= wpm <= WPM_IDEAL_HIGH:
        clarity_score = 9.5
    elif WPM_TOO_SLOW < wpm < WPM_IDEAL_LOW or WPM_IDEAL_HIGH < wpm < WPM_TOO_FAST:
        clarity_score = 7.5
    else:
        # Too slow or too fast
        clarity_score = 5.5

    clarity_score = round(clarity_score, 1)
    return confidence_score, clarity_score


async def analyze_voice(
    audio_bytes: bytes,
    filename: str = "audio.mp3",
    transcription: str = "",
    duration_seconds: float = 0.0,
) -> VoiceAnalysisResult:
    """
    Analyse audio using Librosa for energy/silence and the transcription
    text for filler words and pacing.

    Parameters
    ----------
    audio_bytes      : raw audio bytes
    filename         : original filename (used to detect format)
    transcription    : pre-computed Whisper transcription (optional; if empty,
                       voice metrics are derived from audio alone)
    duration_seconds : audio duration from Whisper (used for WPM calc)

    Returns
    -------
    VoiceAnalysisResult  (never raises)
    """
    logger.info(
        "Librosa | analyze_voice | file={} | size={:.1f} KB | transcription_len={}",
        filename, len(audio_bytes) / 1024, len(transcription),
    )

    tmp_path: Optional[str] = None
    try:
        import librosa  # lazy import — heavy package
        import soundfile as sf  # noqa: F401  (needed by librosa for some formats)

        suffix = os.path.splitext(filename)[-1] or ".mp3"
        with tempfile.NamedTemporaryFile(
            suffix=suffix, delete=False, prefix="hilearn_va_"
        ) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        # Run librosa in a thread pool to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        y, sr = await loop.run_in_executor(
            None,
            lambda: librosa.load(tmp_path, sr=None, mono=True),
        )

        # ── Silence / energy analysis ──────────────────────────────────
        # RMS energy frame-by-frame
        frame_length = 2048
        hop_length = 512
        rms = librosa.feature.rms(y=y, frame_length=frame_length, hop_length=hop_length)[0]
        silence_threshold = 0.01  # frames below this are considered silence
        silence_frames = np.sum(rms < silence_threshold)
        total_frames = len(rms)
        silence_ratio = float(silence_frames / total_frames) if total_frames > 0 else 0.0

        # ── Derive audio duration (if Whisper didn't give us one) ─────
        if duration_seconds <= 0:
            duration_seconds = float(len(y) / sr)

        logger.debug(
            "Librosa | analyze_voice | duration={:.1f}s | silence_ratio={:.2f}",
            duration_seconds, silence_ratio,
        )

    except Exception as exc:
        logger.warning(
            "Librosa | analyze_voice | audio analysis failed ({}), "
            "continuing with text-only metrics",
            exc,
        )
        silence_ratio = 0.0

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass

    # ── Text-based metrics (always computed) ──────────────────────────
    word_count = len(transcription.split()) if transcription else 0
    filler_count, fillers_detected = _count_filler_words(transcription)
    wpm = _calculate_wpm(word_count, duration_seconds)
    confidence_score, clarity_score = _score_from_filler_and_pacing(
        filler_count, wpm, word_count
    )

    logger.success(
        "Librosa | analyze_voice | OK | fillers={} | wpm={} | "
        "confidence={} | clarity={}",
        filler_count, wpm, confidence_score, clarity_score,
    )

    return VoiceAnalysisResult(
        filler_count=filler_count,
        filler_words_detected=fillers_detected,
        wpm=wpm,
        confidence_score=confidence_score,
        clarity_score=clarity_score,
        silence_ratio=round(silence_ratio, 3),
        success=True,
    )


# ─────────────────────────────────────────────────────────
# 3. Audio URL Downloader
# ─────────────────────────────────────────────────────────

async def download_audio(url: str) -> Tuple[bytes, str]:
    """
    Download audio from a URL with a hard timeout.

    Returns (audio_bytes, filename).
    Raises aiohttp.ClientError / asyncio.TimeoutError on failure.
    """
    logger.info("Audio | download | url={}", url)
    timeout = aiohttp.ClientTimeout(total=AUDIO_DOWNLOAD_TIMEOUT_SECONDS)

    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.get(url) as resp:
            resp.raise_for_status()
            audio_bytes = await resp.read()

    # Try to get the filename from the URL path
    filename = url.split("?")[0].rstrip("/").split("/")[-1] or "audio.mp3"
    if "." not in filename:
        content_type = resp.headers.get("Content-Type", "")
        ext_map = {
            "audio/mpeg": ".mp3",
            "audio/wav": ".wav",
            "audio/ogg": ".ogg",
            "audio/webm": ".webm",
            "audio/mp4": ".m4a",
        }
        ext = next((v for k, v in ext_map.items() if k in content_type), ".mp3")
        filename = f"audio{ext}"

    logger.success(
        "Audio | download | OK | size={:.1f} KB | filename={}",
        len(audio_bytes) / 1024, filename,
    )
    return audio_bytes, filename


# ─────────────────────────────────────────────────────────
# 4. Combined Pipeline (download → transcribe → analyse)
# ─────────────────────────────────────────────────────────

async def process_audio_url(
    audio_url: str,
) -> Tuple[TranscribeResult, VoiceAnalysisResult]:
    """
    Full pipeline: download → Whisper STT → Librosa analysis.

    Returns (TranscribeResult, VoiceAnalysisResult).
    Never raises — failures produce fallback objects with success=False.
    """
    logger.info("VoicePipeline | start | url={}", audio_url)

    # ── Step 1: Download ──────────────────────────────────────────────
    try:
        audio_bytes, filename = await download_audio(audio_url)
    except Exception as exc:
        logger.error("VoicePipeline | download FAILED | error={}", exc)
        return (
            TranscribeResult(success=False, error=f"Download failed: {exc}"),
            VoiceAnalysisResult(success=False, error=f"Download failed: {exc}"),
        )

    # ── Step 2: Google Cloud STT Transcription ────────────────────────
    transcribe_result = await transcribe_audio(audio_bytes, filename)

    # ── Step 3: Librosa Voice Analysis ───────────────────────────────
    voice_result = await analyze_voice(
        audio_bytes=audio_bytes,
        filename=filename,
        transcription=transcribe_result.transcription,
        duration_seconds=transcribe_result.duration_seconds,
    )

    logger.success("VoicePipeline | complete | transcription_ok={} | voice_ok={}",
                   transcribe_result.success, voice_result.success)
    return transcribe_result, voice_result
