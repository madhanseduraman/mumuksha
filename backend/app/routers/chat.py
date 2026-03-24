from fastapi import APIRouter, HTTPException

from ..models.schemas import ChatRequest, ChatResponse
from ..services.rag import retrieve_relevant_verses
from ..services.ai_orchestrator import handle_query
from ..db.database import get_song_by_number

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main AI chat endpoint.
    Retrieves relevant verses and returns dual-model (Gemini + Sarvam) responses.
    """
    if request.song_number:
        # Explain a specific verse
        song = get_song_by_number(request.song_number)
        if not song:
            raise HTTPException(status_code=404, detail="Verse not found")
        context_verses = [song]
        query = request.query or f"Explain song #{request.song_number} of Sivavakiyar"
    else:
        # Retrieve relevant verses via RAG
        context_verses = retrieve_relevant_verses(
            request.query,
            top_k=5,
            topic_id=request.topic_id,
        )

    result = await handle_query(
        query=request.query,
        context_verses=context_verses,
        mode=request.mode,
    )
    return result


@router.post("/explain/{song_number}", response_model=ChatResponse)
async def explain_verse(song_number: int):
    """Explain a specific verse — shortcut endpoint."""
    song = get_song_by_number(song_number)
    if not song:
        raise HTTPException(status_code=404, detail="Verse not found")

    query = f"Please provide a deep philosophical explanation of Sivavakiyar's song #{song_number}. What is the spiritual teaching, and how does it connect to daily life?"

    result = await handle_query(
        query=query,
        context_verses=[song],
        mode="guided",
    )
    return result
