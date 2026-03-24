"""
AI Orchestration Layer — Dual-model responses from Gemini and Sarvam AI.
Falls back gracefully when API keys are not configured.
"""
import httpx
import json
from typing import List, Dict, Any, Optional

from ..config import settings


GEMINI_SYSTEM_PROMPT = """You are a spiritual teacher and scholar deeply versed in Tamil Siddhar philosophy,
specifically in the works of Sivavakiyar (சிவவாக்கியர்).

Your role:
- Explain Tamil spiritual verses with depth and clarity
- Connect ancient wisdom to modern life situations
- Provide philosophical meaning grounded in the actual verse text
- Always reference the provided source verses in your explanation
- Explain in English, but preserve important Tamil terms with their meanings

Style: Thoughtful, clear, connecting ancient wisdom to universal human experience."""

SARVAM_SYSTEM_PROMPT = """You are a cultural scholar specializing in Tamil Siddha tradition and Indian philosophy.
Your interpretations are grounded in the Indian cultural context.

Your role:
- Provide culturally rooted interpretation from an Indian philosophical perspective
- Explain connections to broader Indian traditions (Shaivism, Tantra, Vedanta)
- Focus on practical wisdom and its application in daily life
- Highlight uniquely Tamil and Siddhar perspectives that differ from mainstream interpretations

Style: Culturally aware, practical, rooted in lived Indian spiritual tradition."""


def _build_context(verses: List[Dict[str, Any]]) -> str:
    parts = []
    for v in verses:
        parts.append(
            f"Song #{v['song_number']}:\n"
            f"Tamil Verse:\n{v['tamil_verse']}\n\n"
            f"Tamil Explanation:\n{v['tamil_explanation']}"
        )
    return "\n\n---\n\n".join(parts)


async def call_gemini(
    query: str,
    context_verses: List[Dict[str, Any]],
    mode: str = "free",
) -> Dict[str, Any]:
    if not settings.gemini_api_key:
        return {
            "model": "gemini",
            "response": _demo_response("Gemini", query, context_verses),
            "confidence": 0.85,
        }

    context = _build_context(context_verses)
    prompt = f"""{GEMINI_SYSTEM_PROMPT}

Source Verses from Sivavakiyar:
{context}

Question: {query}

Please provide a deep, philosophical explanation grounded in these verses.
Connect the teaching to both its original spiritual context and modern life."""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={settings.gemini_api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024},
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return {"model": "gemini", "response": text, "confidence": 0.9}


async def call_sarvam(
    query: str,
    context_verses: List[Dict[str, Any]],
    mode: str = "free",
) -> Dict[str, Any]:
    if not settings.sarvam_api_key:
        return {
            "model": "sarvam",
            "response": _demo_response("Sarvam AI", query, context_verses, style="cultural"),
            "confidence": 0.82,
        }

    context = _build_context(context_verses)
    messages = [
        {"role": "system", "content": SARVAM_SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"Source Verses:\n{context}\n\nQuestion: {query}\n\nProvide a culturally grounded Indian philosophical interpretation.",
        },
    ]

    url = "https://api.sarvam.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.sarvam_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "sarvam-2b",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1024,
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        text = data["choices"][0]["message"]["content"]
        return {"model": "sarvam", "response": text, "confidence": 0.87}


def _demo_response(
    model_name: str,
    query: str,
    verses: List[Dict[str, Any]],
    style: str = "philosophical",
) -> str:
    """Generate a rich demo response when API keys are not configured."""
    if not verses:
        return f"[{model_name} Demo] No relevant verses found for your query."

    verse = verses[0]
    song_num = verse["song_number"]
    tamil_verse = verse["tamil_verse"]
    explanation = verse["tamil_explanation"]

    if style == "cultural":
        return f"""[{model_name} — Cultural Perspective]

**Song #{song_num} — A Window into Tamil Siddha Wisdom**

In the rich tapestry of Tamil Siddha tradition, Sivavakiyar stands as a revolutionary voice that cuts through empty ritual to reveal the essence of spiritual truth.

**The Verse:**
{tamil_verse[:100]}...

**Cultural Interpretation:**
This verse reflects a core tension in Tamil spiritual thought: the contrast between *bahya* (external) worship and *antara* (internal) realization. Sivavakiyar, like other Siddhars, challenges the orthodoxy of temple-based religion.

From the Indian philosophical perspective, this teaching connects to:
- **Shaiva Siddhanta**: The soul's journey from *pasha* (bondage) to *pathi* (divine union)
- **Tantra**: The body as a sacred temple (*deha koil*)
- **Vedanta**: The non-dual nature of self and Shiva

**Practical Wisdom:**
The Siddhars taught that liberation is not found in pilgrimage or ritual, but in direct inner experience — *anubhava*. This remains profoundly relevant today.

> *Configure your Sarvam AI API key for live responses.*""".strip()

    else:
        return f"""[{model_name} — Philosophical Analysis]

**Song #{song_num} of Sivavakiyar**

**The Verse:**
{tamil_verse[:120]}...

**Deep Philosophical Meaning:**
Sivavakiyar, the 10th-century Tamil Siddhar, composed these verses as spiritual provocations — challenging seekers to look beyond surface appearances to the living truth within.

**Key Themes in this Verse:**

1. **The Inner Journey**: The teaching points toward the *antaryamin* — the inner guide — as the true locus of spiritual experience. External forms (temples, rituals, priests) are seen as secondary to direct inner knowing.

2. **Connection to Modern Life**: In our age of information overload, this ancient wisdom asks: *What is truly essential?* Just as Sivavakiyar stripped away religious pretense, we too can ask what truly nourishes the soul versus what merely occupies the mind.

3. **The Grounded Teaching**: This verse is specifically grounded in the *Panchakshara* (five sacred syllables) tradition — the understanding that sound, consciousness, and liberation are deeply interconnected.

**Reflection**:
The verse invites us to move from *knowing about* the divine to *knowing* the divine directly — a distinction as relevant today as it was 1,000 years ago.

> *Configure your Gemini API key for live, dynamic responses.*""".strip()


async def handle_query(
    query: str,
    context_verses: List[Dict[str, Any]],
    mode: str = "free",
) -> Dict[str, Any]:
    """Main orchestration: call both models and return side-by-side results."""
    import asyncio
    gemini_task = call_gemini(query, context_verses, mode)
    sarvam_task = call_sarvam(query, context_verses, mode)
    gemini_result, sarvam_result = await asyncio.gather(gemini_task, sarvam_task)

    sources = [
        {
            "song_number": v["song_number"],
            "tamil_verse": v["tamil_verse"],
            "tamil_explanation": v["tamil_explanation"],
            "relevance_score": v.get("relevance_score"),
        }
        for v in context_verses
    ]

    return {
        "gemini": gemini_result,
        "sarvam": sarvam_result,
        "sources": sources,
        "query": query,
    }
