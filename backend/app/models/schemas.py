from pydantic import BaseModel
from typing import List, Optional


class Topic(BaseModel):
    id: int
    name: str
    name_ta: str
    description: str
    song_count: Optional[int] = 0


class Scripture(BaseModel):
    id: int
    name: str
    name_ta: str
    author: str
    period: str
    description: str
    song_count: Optional[int] = 0


class Song(BaseModel):
    id: int
    song_number: int
    tamil_verse: str
    tamil_explanation: str
    topics: List[int] = []
    scripture_id: int = 1


class SongDetail(Song):
    topic_names: List[str] = []


class ChatRequest(BaseModel):
    query: str
    topic_id: Optional[int] = None
    scripture_id: Optional[int] = 1
    mode: str = "free"  # "guided" | "free"
    song_number: Optional[int] = None  # for explain-verse mode


class AIModelResponse(BaseModel):
    model: str
    response: str
    confidence: Optional[float] = None


class SourceVerse(BaseModel):
    song_number: int
    tamil_verse: str
    tamil_explanation: str
    relevance_score: Optional[float] = None


class ChatResponse(BaseModel):
    gemini: AIModelResponse
    sarvam: AIModelResponse
    sources: List[SourceVerse]
    query: str


class SearchRequest(BaseModel):
    query: str
    scripture_id: Optional[int] = None
    topic_id: Optional[int] = None
    limit: int = 10


class SearchResult(BaseModel):
    songs: List[SongDetail]
    total: int
