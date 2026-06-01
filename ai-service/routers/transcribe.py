import os
import tempfile
import whisper
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

_model = None


def _get_model() -> whisper.Whisper:
    global _model
    if _model is None:
        model_name = os.getenv("WHISPER_MODEL", "base")
        _model = whisper.load_model(model_name)
    return _model


@router.post("/")
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Accepts an audio file (mp3, wav, m4a, webm) and returns a transcript.
    Used by the Speaking module.
    """
    allowed = {".mp3", ".wav", ".m4a", ".webm", ".ogg", ".flac"}
    ext = os.path.splitext(audio.filename or "")[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported format: {ext}")

    content = await audio.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        model = _get_model()
        result = model.transcribe(tmp_path)
        return {
            "text": result["text"].strip(),
            "language": result.get("language", "en"),
        }
    finally:
        os.unlink(tmp_path)
