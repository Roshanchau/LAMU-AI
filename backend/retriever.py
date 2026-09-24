"""In-memory TF-IDF retriever over the veterinary knowledge corpus."""

from __future__ import annotations

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from knowledge import flatten_chunks
from models import RetrievedChunk

EMBEDDER_NAME = "tfidf-veterinary"


class CorpusIndex:
    def __init__(self) -> None:
        self.rows = flatten_chunks()
        self.texts = [row["content"] for row in self.rows]
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
            stop_words="english",
        )
        self.matrix = self.vectorizer.fit_transform(self.texts)

    @property
    def size(self) -> int:
        return len(self.rows)

    @property
    def dimensions(self) -> int:
        return int(self.matrix.shape[1])

    def transform(self, texts: list[str]) -> np.ndarray:
        dense = self.vectorizer.transform(texts).toarray()
        return dense.astype(float)

    def query_scores(self, query: str) -> np.ndarray:
        q = self.vectorizer.transform([query])
        return cosine_similarity(q, self.matrix).ravel()


_INDEX: CorpusIndex | None = None


def get_index() -> CorpusIndex:
    global _INDEX
    if _INDEX is None:
        _INDEX = CorpusIndex()
    return _INDEX


def reset_index() -> CorpusIndex:
    """Rebuild the singleton (used in tests)."""
    global _INDEX
    _INDEX = CorpusIndex()
    return _INDEX


def mmr_rerank(query: str, candidate_indices: list[int], k: int, lambda_mult: float = 0.7) -> list[int]:
    """Maximal marginal relevance over TF-IDF vectors."""
    index = get_index()
    if not candidate_indices:
        return []
    q = index.vectorizer.transform([query])
    cand_mat = index.matrix[candidate_indices]
    query_sim = cosine_similarity(q, cand_mat).ravel()

    selected: list[int] = []
    remaining = list(range(len(candidate_indices)))
    while remaining and len(selected) < k:
        if not selected:
            pick_local = int(np.argmax(query_sim[remaining]))
            pick = remaining[pick_local]
            selected.append(pick)
            remaining.pop(pick_local)
            continue

        selected_mat = cand_mat[selected]
        rest_mat = cand_mat[remaining]
        diversify = cosine_similarity(rest_mat, selected_mat).max(axis=1)
        mmr = lambda_mult * query_sim[remaining] - (1.0 - lambda_mult) * diversify
        pick_local = int(np.argmax(mmr))
        pick = remaining[pick_local]
        selected.append(pick)
        remaining.pop(pick_local)

    return [candidate_indices[i] for i in selected]


def retrieve(query: str, top_k: int = 5) -> list[RetrievedChunk]:
    index = get_index()
    scores = index.query_scores(query)
    # Take a wider pool, then MMR down to top_k.
    pool_k = min(len(scores), max(top_k * 3, top_k))
    pool = np.argsort(scores)[::-1][:pool_k].tolist()
    ranked = mmr_rerank(query, pool, k=top_k)
    chunks: list[RetrievedChunk] = []
    for idx in ranked:
        row = index.rows[idx]
        chunks.append(
            RetrievedChunk(
                chunk_id=row["chunk_id"],
                document_title=row["document_title"],
                source=row["source"],
                content=row["content"],
                relevance_score=round(float(scores[idx]), 3),
            )
        )
    return chunks
