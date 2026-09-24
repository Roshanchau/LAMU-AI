import time
from mongodb_vector import vector_store_instance

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

