import os
import anthropic
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


# ── Request / Response models ──────────────────────────────────────────────────

class WritingRequest(BaseModel):
    task_type: str   # "task1" | "task2"
    prompt: str
    response: str

class SpeakingRequest(BaseModel):
    transcript: str
    question: str
    part: int        # 1 | 2 | 3

class ScoreResponse(BaseModel):
    band: float
    feedback: str
    strengths: list[str]
    improvements: list[str]


# ── Helpers ────────────────────────────────────────────────────────────────────

def _get_client() -> anthropic.Anthropic:
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key:
        raise HTTPException(status_code=503, detail="ANTHROPIC_API_KEY not configured")
    return anthropic.Anthropic(api_key=key)


def _parse_band(text: str) -> float:
    """Extract the first numeric band score from LLM output."""
    import re
    match = re.search(r'\b([0-9](?:\.[05])?)\b', text)
    return float(match.group(1)) if match else 0.0


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/writing", response_model=ScoreResponse)
async def score_writing(req: WritingRequest):
    client = _get_client()

    prompt = f"""You are an expert IELTS examiner. Score this IELTS Writing {req.task_type.upper()} response.

Task prompt: {req.prompt}

Candidate response:
{req.response}

Return ONLY valid JSON in this exact shape:
{{
  "band": <0-9 in 0.5 steps>,
  "feedback": "<2-3 sentence overall comment>",
  "strengths": ["<point 1>", "<point 2>"],
  "improvements": ["<point 1>", "<point 2>"]
}}"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )

    import json
    try:
        data = json.loads(message.content[0].text)
        return ScoreResponse(**data)
    except Exception:
        return ScoreResponse(
            band=0.0,
            feedback=message.content[0].text,
            strengths=[],
            improvements=[],
        )


@router.post("/speaking", response_model=ScoreResponse)
async def score_speaking(req: SpeakingRequest):
    client = _get_client()

    prompt = f"""You are an expert IELTS examiner. Score this IELTS Speaking Part {req.part} response.

Question: {req.question}

Transcript:
{req.transcript}

Return ONLY valid JSON in this exact shape:
{{
  "band": <0-9 in 0.5 steps>,
  "feedback": "<2-3 sentence overall comment>",
  "strengths": ["<point 1>", "<point 2>"],
  "improvements": ["<point 1>", "<point 2>"]
}}"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )

    import json
    try:
        data = json.loads(message.content[0].text)
        return ScoreResponse(**data)
    except Exception:
        return ScoreResponse(
            band=0.0,
            feedback=message.content[0].text,
            strengths=[],
            improvements=[],
        )
