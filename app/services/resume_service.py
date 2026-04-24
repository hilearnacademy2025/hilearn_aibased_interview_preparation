"""
HiLearn AI Interview Prep - Resume Service
=============================================
Extract text from PDF, DOCX, and TXT resume files.
Parse structured information (skills, experience, companies, tech stack)
using Groq AI for context-aware question generation.
"""
import io
import json
from typing import Any, Dict, Optional

from loguru import logger


# ─────────────────────────────────────────────────────────
# Text Extraction
# ─────────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text content from a PDF file.

    Args:
        file_bytes: Raw bytes of the PDF file.

    Returns:
        Extracted text string. Empty string on failure.
    """
    try:
        from PyPDF2 import PdfReader

        reader = PdfReader(io.BytesIO(file_bytes))
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        full_text = "\n".join(text_parts).strip()
        logger.info("[RESUME] PDF extracted | pages={} | chars={}", len(reader.pages), len(full_text))
        return full_text

    except Exception as exc:
        logger.error("[RESUME] PDF extraction failed | error={}", exc)
        return ""


def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extract text content from a DOCX file.

    Args:
        file_bytes: Raw bytes of the DOCX file.

    Returns:
        Extracted text string. Empty string on failure.
    """
    try:
        from docx import Document

        doc = Document(io.BytesIO(file_bytes))
        text_parts = [para.text for para in doc.paragraphs if para.text.strip()]
        full_text = "\n".join(text_parts).strip()
        logger.info("[RESUME] DOCX extracted | paragraphs={} | chars={}", len(text_parts), len(full_text))
        return full_text

    except Exception as exc:
        logger.error("[RESUME] DOCX extraction failed | error={}", exc)
        return ""


def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """
    Auto-detect file type and extract text.

    Args:
        file_bytes: Raw file bytes.
        filename: Original filename (used for extension detection).

    Returns:
        Extracted text string.
    """
    ext = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""

    if ext == "pdf":
        return extract_text_from_pdf(file_bytes)
    elif ext in ("docx", "doc"):
        return extract_text_from_docx(file_bytes)
    elif ext == "txt":
        try:
            return file_bytes.decode("utf-8", errors="ignore").strip()
        except Exception:
            return file_bytes.decode("latin-1", errors="ignore").strip()
    else:
        logger.warning("[RESUME] Unsupported file extension: {}", ext)
        return ""


# ─────────────────────────────────────────────────────────
# Structured Resume Parsing (via Groq)
# ─────────────────────────────────────────────────────────

async def parse_resume_structured(resume_text: str) -> Dict[str, Any]:
    """
    Use Groq AI to extract structured information from resume text.

    Args:
        resume_text: Raw text extracted from resume.

    Returns:
        Dict with keys: skills, experience_years, companies,
        tech_stack, education, summary.
    """
    default_result = {
        "skills": [],
        "experience_years": 0,
        "companies": [],
        "tech_stack": [],
        "education": "",
        "summary": resume_text[:300] if resume_text else "",
    }

    if not resume_text or len(resume_text.strip()) < 20:
        logger.debug("[RESUME] Text too short for structured parsing")
        return default_result

    try:
        from groq import AsyncGroq
        from app.core.config import get_settings

        settings = get_settings()
        client = AsyncGroq(api_key=settings.groq_api_key, timeout=30)

        prompt = (
            "Extract structured information from this resume text. "
            "Return ONLY valid JSON with these exact keys:\n"
            '{"skills": ["skill1", "skill2"], '
            '"experience_years": <number>, '
            '"companies": ["company1", "company2"], '
            '"tech_stack": ["tech1", "tech2"], '
            '"education": "degree from university", '
            '"summary": "one line summary"}\n\n'
            f"Resume text:\n{resume_text[:2000]}"
        )

        response = await client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a resume parser. Extract structured data from resumes. "
                        "Always respond with valid JSON only — no markdown, no explanation."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=500,
            temperature=0.1,
        )

        raw = response.choices[0].message.content.strip()

        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        result = json.loads(raw)
        logger.success("[RESUME] Structured parsing OK | skills={} | companies={}", 
                       len(result.get("skills", [])), len(result.get("companies", [])))

        # Merge with defaults to ensure all keys exist
        for key in default_result:
            if key not in result:
                result[key] = default_result[key]

        return result

    except Exception as exc:
        logger.error("[RESUME] Structured parsing failed | error={} | using fallback", exc)
        return default_result


def build_resume_context_prompt(parsed_resume: Dict[str, Any]) -> str:
    """
    Build a context string from parsed resume data for Groq prompts.

    Args:
        parsed_resume: Dict from parse_resume_structured().

    Returns:
        Formatted resume context string for LLM prompts.
    """
    skills = ", ".join(parsed_resume.get("skills", [])) or "Not specified"
    experience = parsed_resume.get("experience_years", 0)
    companies = ", ".join(parsed_resume.get("companies", [])) or "Not specified"
    tech_stack = ", ".join(parsed_resume.get("tech_stack", [])) or "Not specified"
    education = parsed_resume.get("education", "Not specified")

    return (
        f"\nCandidate Resume Context:\n"
        f"- Skills: {skills}\n"
        f"- Experience: {experience} years\n"
        f"- Previous Companies: {companies}\n"
        f"- Technologies: {tech_stack}\n"
        f"- Education: {education}\n"
        f"\nGenerate a specific interview question that tests their actual experience "
        f"and skills mentioned in their resume. Make it relevant to their background."
    )
