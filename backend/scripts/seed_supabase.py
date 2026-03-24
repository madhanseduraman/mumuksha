"""
Seed script: Load Sivavakiyar data into Supabase.
Run this after setting up your Supabase project and running schema.sql.

Usage:
    cd backend
    python -m scripts.seed_supabase
"""
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from supabase import create_client
except ImportError:
    print("Install dependencies first: pip install -r requirements.txt")
    sys.exit(1)

from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env")
    sys.exit(1)

DATA_PATH = Path(__file__).parent.parent / "data" / "sivavakiyar.json"

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def seed():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Insert scripture
    print("Seeding scripture...")
    scripture = data["scripture"]
    supabase.table("scriptures").upsert({
        "id": scripture["id"],
        "name": scripture["name"],
        "name_ta": scripture["name_ta"],
        "author": scripture["author"],
        "period": scripture["period"],
        "description": scripture["description"],
    }).execute()

    # 2. Insert topics
    print("Seeding topics...")
    for t in data["topics"]:
        supabase.table("topics").upsert({
            "id": t["id"],
            "name": t["name"],
            "name_ta": t["name_ta"],
            "description": t["description"],
            "scripture_id": 1,
        }).execute()

    # 3. Insert verses
    print("Seeding verses...")
    songs = data["songs"]
    for song in songs:
        supabase.table("verses").upsert({
            "id": song["id"],
            "song_number": song["song_number"],
            "tamil_verse": song["tamil_verse"],
            "tamil_explanation": song["tamil_explanation"],
            "scripture_id": 1,
        }).execute()

    # 4. Insert verse_topics (many-to-many)
    print("Seeding verse_topics...")
    for song in songs:
        for topic_id in song.get("topics", []):
            supabase.table("verse_topics").upsert({
                "verse_id": song["id"],
                "topic_id": topic_id,
                "confidence_score": 0.8,
            }).execute()

    print(f"Done! Seeded {len(songs)} songs into Supabase.")


if __name__ == "__main__":
    seed()
