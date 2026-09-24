"""Embedding Generation Service for LAMU-AI.

Generates dense vector embeddings for text using deterministic hashing (minimal version).
In production, this would use:
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('pritamdekate/BioBERT-Animal')
"""

import time
import hashlib
import numpy as np
from models import EmbeddingResponse


# Embedding dimension (matches BERT-base)
EMBEDDING_DIM = 768


def _text_to_seed(text: str) -> int:
    """Convert text to a deterministic seed for reproducible embeddings."""
    return int(hashlib.md5(text.encode()).hexdigest(), 16) % (2**32)


def generate_embedding(text: str) -> list[float]:
    """Generate a single 768-dim embedding for input text.

    In production:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('lamu-vetbert-embeddings-v2')
        embedding = model.encode(text).tolist()

    For demo: generates a deterministic pseudo-embedding based on
    text content, producing semantically meaningful clusters.
    """
    seed = _text_to_seed(text)
    rng = np.random.RandomState(seed)

    # Generate base embedding
    embedding = rng.randn(EMBEDDING_DIM).astype(float)

    # Apply domain-specific bias based on drug class keywords
    drug_class_biases = {
        "tetracycline": (0, 100),
        "cephalosporin": (100, 200),
        "macrolide": (200, 300),
        "fluoroquinolone": (300, 400),
        "penicillin": (400, 500),
        "aminoglycoside": (500, 600),
    }

    text_lower = text.lower()
    for drug_class, (start, end) in drug_class_biases.items():
        if drug_class in text_lower:
            embedding[start:end] += rng.uniform(0.5, 1.5, end - start)

    # Normalize to unit vector
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = embedding / norm

    return embedding.tolist()


def generate_embeddings(
    texts: list[str],
    model: str = "lamu-vetbert"
) -> EmbeddingResponse:
    """Generate embeddings for multiple texts.

    Args:
        texts: List of text strings to embed.
        model: Model identifier.

    Returns:
        EmbeddingResponse with embeddings and metadata.
    """
    start_time = time.time()

    embeddings = [generate_embedding(text) for text in texts]

    processing_time = (time.time() - start_time) * 1000

    return EmbeddingResponse(
        embeddings=embeddings,
        model=model,
        dimensions=EMBEDDING_DIM,
        processing_time_ms=round(processing_time, 1),
    )


def compute_similarity(text_a: str, text_b: str) -> float:
    """Compute cosine similarity between two text embeddings."""
    emb_a = np.array(generate_embedding(text_a))
    emb_b = np.array(generate_embedding(text_b))
    return float(np.dot(emb_a, emb_b))
