from fastapi import FastAPI
from routers import transcribe, scoring

app = FastAPI(title="IELTS AI Service", version="1.0.0")

app.include_router(transcribe.router, prefix="/transcribe", tags=["Transcription"])
app.include_router(scoring.router, prefix="/score", tags=["Scoring"])


@app.get("/health")
def health():
    return {"status": "ok"}
