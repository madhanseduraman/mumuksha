from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from ..db.database import get_songs, get_song_by_number
from ..models.schemas import SongDetail, SearchResult
from ..services.rag import retrieve_relevant_verses

router = APIRouter(prefix="/verses", tags=["verses"])


@router.get("", response_model=List[SongDetail])
async def list_verses(
    topic_id: Optional[int] = Query(None),
    scripture_id: int = Query(1),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
):
    """Get verses, optionally filtered by topic."""
    return get_songs(topic_id=topic_id, scripture_id=scripture_id, limit=limit, offset=offset)


@router.get("/search", response_model=SearchResult)
async def search_verses(
    q: str = Query(..., min_length=1),
    topic_id: Optional[int] = Query(None),
    scripture_id: Optional[int] = Query(None),
    limit: int = Query(10, le=20),
):
    """Semantic search across verses."""
    results = retrieve_relevant_verses(q, top_k=limit, topic_id=topic_id)
    return {"songs": results, "total": len(results)}


@router.get("/{song_number}", response_model=SongDetail)
async def get_verse(song_number: int):
    """Get a specific verse by song number."""
    song = get_song_by_number(song_number)
    if not song:
        raise HTTPException(status_code=404, detail="Verse not found")
    return song
