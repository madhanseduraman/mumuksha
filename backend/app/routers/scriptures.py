from fastapi import APIRouter, HTTPException
from typing import List

from ..db.database import get_scripture, get_topics, get_topic_by_id
from ..models.schemas import Scripture, Topic

router = APIRouter(prefix="/scriptures", tags=["scriptures"])


@router.get("", response_model=List[Scripture])
async def list_scriptures():
    """Get all available scriptures."""
    scripture = get_scripture()
    return [scripture]


@router.get("/{scripture_id}", response_model=Scripture)
async def get_scripture_detail(scripture_id: int):
    """Get a specific scripture by ID."""
    if scripture_id != 1:
        raise HTTPException(status_code=404, detail="Scripture not found")
    return get_scripture()


@router.get("/{scripture_id}/topics", response_model=List[Topic])
async def get_scripture_topics(scripture_id: int):
    """Get all topics for a scripture."""
    if scripture_id != 1:
        raise HTTPException(status_code=404, detail="Scripture not found")
    return get_topics(scripture_id)
