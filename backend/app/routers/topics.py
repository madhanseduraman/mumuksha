from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from ..db.database import get_topics, get_topic_by_id
from ..models.schemas import Topic

router = APIRouter(prefix="/topics", tags=["topics"])


@router.get("", response_model=List[Topic])
async def list_topics(scripture_id: Optional[int] = Query(None)):
    """Get all topics, optionally filtered by scripture."""
    return get_topics(scripture_id or 1)


@router.get("/{topic_id}", response_model=Topic)
async def get_topic(topic_id: int):
    """Get a specific topic by ID."""
    topic = get_topic_by_id(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic
