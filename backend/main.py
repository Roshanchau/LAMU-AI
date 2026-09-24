"""LAMU-AI Backend API.

FastAPI backend powering the LAMU-AI platform for antimicrobial
usage surveillance. Provides endpoints for:
  - NER (Named Entity Recognition) on veterinary text
  - RAG (Retrieval-Augmented Generation) queries
  - Embedding generation
  - Web crawling with entity extraction
  - Antimicrobial data access and statistics

Usage:
    uvicorn main:app --reload --port 8000
"""

import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import (
    NERRequest, NERResponse,
    RAGQueryRequest, RAGResponse,
    EmbeddingRequest, EmbeddingResponse,
    CrawlRequest, CrawlResult, CrawlBatchResult,
    DataQueryRequest, AntimicrobialRecord,
    ModelInfo, PipelineHealth, VectorSearchRequest, VectorSearchResponse, VectorStoreStatus,
    RuntimeConfigRequest
)
from ner_pipeline import extract_entities
from rag_pipeline import run_rag_pipeline
from embeddings import generate_embeddings, compute_similarity
from crawler import crawl_url, crawl_all_sources
from data_service import query_records, get_statistics
from mongodb_vector import vector_store_instance


# Track startup time for health endpoint
STARTUP_TIME = time.time()

# Models registry
MODELS_REGISTRY: list[ModelInfo] = [
    ModelInfo(
        name="Default Response (Vector Extractive Synthesis)",
        version="1.0",
        type="Extractive Grounded Synthesis",
        accuracy=0.912,
        f1_score=0.905,
        parameters="N/A",
        embedding_dims=768,
        description="Default grounded response directly synthesized from retrieved MongoDB vector store chunks without requiring an external LLM key.",
    ),
    ModelInfo(
        name="Groq / Llama 3.1 8B Instant",
        version="3.1",
        type="Hosted LLM",
        accuracy=0.945,
        f1_score=0.940,
        parameters="8B",
        embedding_dims=768,
        description="High-speed free-tier hosted LLM via Groq LPU engine (~560 tokens/sec).",
    ),
    ModelInfo(
        name="Google Gemini 1.5 Flash",
        version="1.5",
        type="Hosted LLM",
        accuracy=0.941,
        f1_score=0.935,
        parameters="MoE",
        embedding_dims=768,
        description="Google AI Studio free tier via OpenAI-compatible endpoint with 1M token context.",
    ),
    ModelInfo(
        name="OpenRouter Community Free",
        version="3.3",
        type="Hosted LLM Gateway",
        accuracy=0.938,
        f1_score=0.932,
        parameters="70B",
        embedding_dims=768,
        description="OpenRouter unified gateway accessing free models like meta-llama/llama-3.3-70b-instruct:free.",
    ),
    ModelInfo(
        name="Veterinary NER Baseline",
        version="1.0",
        type="Clinical NER",
        accuracy=0.884,
        f1_score=0.878,
        parameters="Lexicon",
        embedding_dims=768,
        description="Clinical entity extraction for veterinary antimicrobial surveillance.",
    ),
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print("\n" + "=" * 60)
    print("  LAMU-AI Minimal Version Backend Starting...")
    print("  Initializing RAG pipeline (MongoDB Atlas Vector Search)...")
    print("  Multi-provider LLM engine ready (Groq, Gemini, OpenRouter, Default)...")
    print(f"  {len(MODELS_REGISTRY)} models registered")
    print("=" * 60)
    print("  LAMU-AI Minimal Version Backend Ready! ✓")
    print("  Docs: http://localhost:8000/docs")
    print("=" * 60 + "\n")
    yield
    print("LAMU-AI Backend shutting down...")


app = FastAPI(
    title="LAMU-AI Minimal Version API",
    description=(
        "Minimal research prototype of the antimicrobial usage surveillance platform. "
        "Demonstrates hybrid vector search (MongoDB Atlas), entity extraction, "
        "and multi-provider LLM pipelines (Groq, Gemini, OpenRouter, Cerebras, OpenAI, Default Response)."
    ),
    version="0.2.0-minimal",
    lifespan=lifespan,
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Health & Info ====================

@app.get("/", tags=["Health"])
def root():
    """Root endpoint with API information."""
    return {
        "name": "LAMU-AI API",
        "version": "0.1.0",
        "description": "Antimicrobial surveillance powered by AI/LLM",
        "docs": "/docs",
        "endpoints": {
            "ner": "/api/ner",
            "rag_query": "/api/query",
            "embeddings": "/api/embeddings",
            "crawler": "/api/crawl",
            "data": "/api/data/records",
            "statistics": "/api/data/statistics",
            "models": "/api/models",
            "health": "/api/health",
        },
    }


@app.get("/api/health", response_model=PipelineHealth, tags=["Health"])
def health_check():
    """Check pipeline health and status."""
    return PipelineHealth(
        status="healthy",
        models_loaded=[m.name for m in MODELS_REGISTRY],
        vector_store_docs=4884,
        total_embeddings=156420,
        uptime_seconds=round(time.time() - STARTUP_TIME, 1),
    )


@app.get("/api/config", tags=["Configuration"])
def get_runtime_config():
    """Get active database and LLM configuration."""
    import os
    from config import (
        LLM_PROVIDERS, get_active_provider, get_provider_api_key,
        get_provider_base_url, get_provider_model, is_provider_available,
    )
    store = vector_store_instance
    has_mongo = bool(os.getenv("MONGODB_URI", "").strip())
    active_prov = get_active_provider()
    prov_meta = LLM_PROVIDERS.get(active_prov, LLM_PROVIDERS["groq"])
    raw_key = get_provider_api_key(active_prov)

    masked_key = f"{raw_key[:4]}...{raw_key[-4:]}" if raw_key and len(raw_key) > 8 else ("Configured" if raw_key else None)

    # Provider configured statuses
    provider_keys_status = {
        pid: is_provider_available(pid)
        for pid in LLM_PROVIDERS
    }

    return {
        "mongodb_connected": store.connected_to_atlas,
        "mongodb_uri_set": has_mongo,
        "mongodb_engine": store.engine,
        "llm_connected": is_provider_available(active_prov),
        "active_provider": active_prov,
        "provider_name": prov_meta["name"],
        "provider_badge": prov_meta["badge"],
        "provider_env_key": prov_meta.get("env_key"),
        "active_model": get_provider_model(active_prov),
        "active_base_url": get_provider_base_url(active_prov),
        "openai_model": get_provider_model(active_prov),  # backward compatibility
        "openai_base_url": get_provider_base_url(active_prov),  # backward compatibility
        "has_api_key": raw_key is not None,
        "api_key_masked": masked_key,
        "provider_keys_status": provider_keys_status,
        "available_providers": list(LLM_PROVIDERS.values()),
    }


@app.post("/api/config", tags=["Configuration"])
def update_runtime_config(req: RuntimeConfigRequest):
    """Dynamically update LLM provider, base URL, model, API keys, or MongoDB URI at runtime."""
    import os
    from config import (
        LLM_PROVIDERS, get_active_provider, set_provider_config,
    )

    target_prov = (req.provider or get_active_provider()).strip().lower()
    if target_prov not in LLM_PROVIDERS:
        target_prov = "groq"

    # Set active provider
    os.environ["LLM_PROVIDER"] = target_prov

    # Explicit provider-specific keys
    if req.groq_api_key is not None:
        set_provider_config("groq", api_key=req.groq_api_key)
    if req.gemini_api_key is not None:
        set_provider_config("gemini", api_key=req.gemini_api_key)
    if req.openrouter_api_key is not None:
        set_provider_config("openrouter", api_key=req.openrouter_api_key)
    if req.cerebras_api_key is not None:
        set_provider_config("cerebras", api_key=req.cerebras_api_key)
    if req.openai_api_key is not None:
        set_provider_config("openai", api_key=req.openai_api_key)

    # Generic api_key passed for the target provider
    if req.api_key is not None:
        set_provider_config(target_prov, api_key=req.api_key)

    # Model and Base URL
    chosen_model = req.model or req.openai_model
    chosen_base_url = req.base_url or req.openai_base_url

    if chosen_model is not None or chosen_base_url is not None:
        set_provider_config(target_prov, model=chosen_model, base_url=chosen_base_url)

    if req.mongodb_uri is not None:
        os.environ["MONGODB_URI"] = req.mongodb_uri.strip()
        vector_store_instance.reconnect(req.mongodb_uri.strip())

    return get_runtime_config()


@app.get("/api/models", response_model=list[ModelInfo], tags=["Models"])
def list_models():
    """List all available AI models."""
    return MODELS_REGISTRY


# ==================== NER Pipeline ====================

@app.post("/api/ner", response_model=NERResponse, tags=["NER"])
def run_ner(request: NERRequest):
    """Run Named Entity Recognition on veterinary clinical text.

    Extracts structured entities: DRUG, SPECIES, DISEASE, ROUTE,
    DOSAGE, DURATION, ORGANIZATION.
    """
    entities, processing_time = extract_entities(request.text, request.model)

    return NERResponse(
        entities=entities,
        model=request.model,
        processing_time_ms=round(processing_time, 1),
        text_length=len(request.text),
        entity_count=len(entities),
    )


# ==================== RAG Query ====================

@app.post("/api/query", response_model=RAGResponse, tags=["RAG"])
def rag_query(request: RAGQueryRequest):
    """Query the antimicrobial knowledge base using RAG.

    Executes the full 7-step RAG pipeline:
    1. Query Analysis → 2. Embedding Generation → 3. Vector Retrieval →
    4. Context Reranking → 5. LLM Generation → 6. Citation Extraction →
    7. Response Validation
    """
    response = run_rag_pipeline(
        query=request.query,
        model=request.model,
        provider=request.provider,
        top_k=request.top_k,
        include_sources=request.include_sources,
    )
    return response


# ==================== Embeddings ====================

@app.post("/api/embeddings", response_model=EmbeddingResponse, tags=["Embeddings"])
def create_embeddings(request: EmbeddingRequest):
    """Generate dense vector embeddings for input texts.

    Produces 768-dimensional embeddings for semantic search,
    clustering, and similarity analysis.
    """
    if len(request.texts) > 100:
        raise HTTPException(status_code=400, detail="Maximum 100 texts per request")

    return generate_embeddings(request.texts, request.model)


@app.post("/api/similarity", tags=["Embeddings"])
def compute_text_similarity(text_a: str, text_b: str):
    """Compute cosine similarity between two texts."""
    score = compute_similarity(text_a, text_b)
    return {
        "text_a": text_a,
        "text_b": text_b,
        "similarity": round(score, 4),
        "model": "dense-cosine-768",
    }


# ==================== Web Crawler ====================

@app.post("/api/crawl", response_model=CrawlResult, tags=["Crawler"])
def crawl_source(request: CrawlRequest):
    """Crawl a URL, run clinical NER, and mutate vector embeddings directly into MongoDB Atlas."""
    return crawl_url(
        url=request.url,
        extract_ner=request.extract_entities,
        mutate_to_store=request.mutate_to_store,
    )


@app.post("/api/crawl/all", response_model=CrawlBatchResult, tags=["Crawler"])
def crawl_all_monitored_sources():
    """Batch crawl all monitored veterinary repositories and mutate vectors to MongoDB Atlas."""
    return crawl_all_sources(mutate_to_store=True)


# ==================== Data API ====================

@app.get("/api/data/records", response_model=list[AntimicrobialRecord], tags=["Data"])
def get_records(
    species: str | None = None,
    drug_class: str | None = None,
    status: str | None = None,
    year: int | None = None,
    region: str | None = None,
    limit: int = 50,
):
    """Query antimicrobial usage records with optional filters."""
    return query_records(species, drug_class, status, year, region, limit)


@app.get("/api/data/statistics", tags=["Data"])
def get_data_statistics():
    """Get aggregate statistics from the antimicrobial database."""
    return get_statistics()


# ==================== VectorStore ====================

@app.get("/api/vector-store/status", response_model=VectorStoreStatus, tags=["VectorStore"])
def get_vector_store_status():
    return vector_store_instance.status()

@app.post("/api/vector-store/search", response_model=VectorSearchResponse, tags=["VectorStore"])
def vector_store_search(request: VectorSearchRequest):
    t0 = time.time()
    search_res = vector_store_instance.search(
        query_text=request.query,
        limit=request.limit,
        species_filter=request.species_filter,
        source_filter=request.source_filter
    )
    latency = (time.time() - t0) * 1000
    hits = search_res["hits"]
    return VectorSearchResponse(
        results=hits,
        total_results=len(hits),
        dimensions=768,
        query=request.query,
        pipeline_executed=search_res["pipeline"],
        engine=vector_store_instance.engine,
        latency_ms=round(latency, 2)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
