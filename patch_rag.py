from mongodb_vector import vector_store_instance

def _retrieve_chunks(query: str, top_k: int = 5) -> list[RetrievedChunk]:
    """Retrieve top-k relevant document chunks from MongoDB vector store."""
    search_res = vector_store_instance.search(query_text=query, limit=top_k)
    all_chunks = []
    for hit in search_res["hits"]:
        all_chunks.append(RetrievedChunk(
            chunk_id=hit["chunk_id"],
            document_title=hit["document_title"],
            source=hit["source"],
            content=hit["content"],
            relevance_score=hit["score"]
        ))
    return all_chunks
