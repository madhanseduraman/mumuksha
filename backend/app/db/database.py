"""
Database layer — loads Sivavakiyar data from local JSON.
When Supabase credentials are configured, switches to live DB.
"""
import json
import os
from pathlib import Path
from typing import List, Optional, Dict, Any

# Load local JSON data as the source of truth
DATA_PATH = Path(__file__).parent.parent.parent / "data" / "sivavakiyar.json"

_data: Dict[str, Any] = {}


def _load_data() -> Dict[str, Any]:
    global _data
    if not _data:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            _data = json.load(f)
    return _data


def get_scripture() -> Dict[str, Any]:
    data = _load_data()
    scripture = data["scripture"].copy()
    scripture["song_count"] = len(data["songs"])
    return scripture


def get_topics(scripture_id: int = 1) -> List[Dict[str, Any]]:
    data = _load_data()
    topics = []
    for t in data["topics"]:
        topic = t.copy()
        # count songs for this topic
        topic["song_count"] = sum(1 for s in data["songs"] if t["id"] in s["topics"])
        topics.append(topic)
    return topics


def get_topic_by_id(topic_id: int) -> Optional[Dict[str, Any]]:
    data = _load_data()
    for t in data["topics"]:
        if t["id"] == topic_id:
            topic = t.copy()
            topic["song_count"] = sum(1 for s in data["songs"] if t["id"] in s["topics"])
            return topic
    return None


def get_songs(
    topic_id: Optional[int] = None,
    scripture_id: int = 1,
    limit: int = 50,
    offset: int = 0,
) -> List[Dict[str, Any]]:
    data = _load_data()
    songs = data["songs"]
    if topic_id is not None:
        songs = [s for s in songs if topic_id in s.get("topics", [])]
    songs = songs[offset : offset + limit]
    # Enrich with topic names
    topic_map = {t["id"]: t["name"] for t in data["topics"]}
    result = []
    for s in songs:
        song = s.copy()
        song["scripture_id"] = 1
        song["topic_names"] = [topic_map.get(tid, "") for tid in s.get("topics", [])]
        result.append(song)
    return result


def get_song_by_number(song_number: int) -> Optional[Dict[str, Any]]:
    data = _load_data()
    topic_map = {t["id"]: t["name"] for t in data["topics"]}
    for s in data["songs"]:
        if s["song_number"] == song_number:
            song = s.copy()
            song["scripture_id"] = 1
            song["topic_names"] = [topic_map.get(tid, "") for tid in s.get("topics", [])]
            return song
    return None


def get_all_songs() -> List[Dict[str, Any]]:
    data = _load_data()
    topic_map = {t["id"]: t["name"] for t in data["topics"]}
    result = []
    for s in data["songs"]:
        song = s.copy()
        song["scripture_id"] = 1
        song["topic_names"] = [topic_map.get(tid, "") for tid in s.get("topics", [])]
        result.append(song)
    return result
