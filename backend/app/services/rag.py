"""
RAG (Retrieval-Augmented Generation) service.

Uses TF-IDF for local similarity search (no GPU needed for MVP).
When Supabase pgvector is configured, switches to semantic embeddings.
"""
from typing import List, Dict, Any, Optional
import math
import re
from collections import defaultdict

from ..db.database import get_all_songs


class SimpleRAG:
    """
    Lightweight TF-IDF based retrieval for Sivavakiyar songs.
    Works entirely locally — no external API calls needed for retrieval.
    """

    def __init__(self):
        self._songs: List[Dict[str, Any]] = []
        self._tfidf_matrix: List[Dict[str, float]] = []
        self._vocabulary: Dict[str, int] = {}
        self._idf: Dict[str, float] = {}
        self._initialized = False

    def _tokenize(self, text: str) -> List[str]:
        # Simple whitespace + punctuation tokenizer for Tamil + English
        text = text.lower()
        tokens = re.findall(r'[\w\u0B80-\u0BFF]+', text)
        return tokens

    def _build_index(self):
        self._songs = get_all_songs()
        documents = []
        for song in self._songs:
            combined = f"{song['tamil_verse']} {song['tamil_explanation']}"
            documents.append(self._tokenize(combined))

        # Build vocabulary and IDF
        df: Dict[str, int] = defaultdict(int)
        N = len(documents)
        for doc_tokens in documents:
            for token in set(doc_tokens):
                df[token] += 1

        self._idf = {
            term: math.log((N + 1) / (freq + 1)) + 1
            for term, freq in df.items()
        }

        # Build TF-IDF vectors
        self._tfidf_matrix = []
        for doc_tokens in documents:
            tf: Dict[str, float] = defaultdict(float)
            for token in doc_tokens:
                tf[token] += 1
            total = len(doc_tokens) or 1
            tfidf = {
                term: (count / total) * self._idf.get(term, 1)
                for term, count in tf.items()
            }
            self._tfidf_matrix.append(tfidf)

        self._initialized = True

    def _cosine_similarity(self, vec_a: Dict[str, float], vec_b: Dict[str, float]) -> float:
        common = set(vec_a.keys()) & set(vec_b.keys())
        dot = sum(vec_a[k] * vec_b[k] for k in common)
        norm_a = math.sqrt(sum(v ** 2 for v in vec_a.values()))
        norm_b = math.sqrt(sum(v ** 2 for v in vec_b.values()))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        topic_id: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        if not self._initialized:
            self._build_index()

        query_tokens = self._tokenize(query)
        query_vec: Dict[str, float] = defaultdict(float)
        for token in query_tokens:
            query_vec[token] += self._idf.get(token, 1)

        scores = []
        for i, song in enumerate(self._songs):
            if topic_id and topic_id not in song.get("topics", []):
                continue
            sim = self._cosine_similarity(query_vec, self._tfidf_matrix[i])
            scores.append((sim, i))

        scores.sort(reverse=True)
        results = []
        for sim, idx in scores[:top_k]:
            song = self._songs[idx].copy()
            song["relevance_score"] = round(sim, 4)
            results.append(song)

        return results


# Singleton instance
rag = SimpleRAG()


def retrieve_relevant_verses(
    query: str,
    top_k: int = 5,
    topic_id: Optional[int] = None,
) -> List[Dict[str, Any]]:
    return rag.retrieve(query, top_k=top_k, topic_id=topic_id)
