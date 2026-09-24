from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class SpeciesCategory(str, Enum):
    MAJOR_LIVESTOCK = "Major Livestock"
    POULTRY = "Poultry"
    MINOR_SPECIES = "Minor Species"
    COMPANION_ANIMALS = "Companion Animals"


class DrugStatus(str, Enum):
    APPROVED = "Approved"
    EXTRA_LABEL = "Extra-Label"
    PROHIBITED = "Prohibited"


class NERLabel(str, Enum):
    DRUG = "DRUG"
    SPECIES = "SPECIES"
    DISEASE = "DISEASE"
    ROUTE = "ROUTE"
    DOSAGE = "DOSAGE"
    DURATION = "DURATION"
    ORGANIZATION = "ORGANIZATION"


# --- Request Models ---

class NERRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Clinical text to analyze")
    model: str = Field(default="veterinary-ner-base", description="NER model to use")


class RAGQueryRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Natural language query")
    model: str = Field(default="auto", description="LLM model for generation")
    provider: Optional[str] = Field(default=None, description="LLM provider (groq, gemini, openrouter, cerebras, openai, ollama, default)")
    top_k: int = Field(default=5, ge=1, le=20, description="Number of chunks to retrieve")
    include_sources: bool = Field(default=True)


class EmbeddingRequest(BaseModel):
    texts: list[str] = Field(..., min_length=1, description="Texts to embed")
    model: str = Field(default="default-768", description="Embedding model")


class CrawlRequest(BaseModel):
    url: str = Field(..., description="URL to crawl")
    extract_entities: bool = Field(default=True, description="Run NER on crawled text")
    mutate_to_store: bool = Field(default=True, description="Mutate and index chunk into MongoDB vector store")


class DataQueryRequest(BaseModel):
    species: Optional[str] = None
    drug_class: Optional[str] = None
    status: Optional[str] = None
    year: Optional[int] = None
    region: Optional[str] = None
    limit: int = Field(default=50, ge=1, le=500)


# --- Response Models ---

class NEREntity(BaseModel):
    text: str
    label: NERLabel
    start: int
    end: int
    confidence: float


class NERResponse(BaseModel):
    entities: list[NEREntity]
    model: str
    processing_time_ms: float
    text_length: int
    entity_count: int


class RetrievedChunk(BaseModel):
    chunk_id: str
    document_title: str
    source: str
    content: str
    relevance_score: float


class RAGPipelineStep(BaseModel):
    step: int
    name: str
    status: str
    duration_ms: float
    details: Optional[str] = None


class RAGResponse(BaseModel):
    answer: str
    model: str
    confidence: float
    sources: list[str]
    related_drugs: list[str]
    retrieved_chunks: list[RetrievedChunk]
    pipeline_steps: list[RAGPipelineStep]
    tokens_used: dict
    processing_time_ms: float
    provider: Optional[str] = None
    llm_source: Optional[str] = None


class EmbeddingResponse(BaseModel):
    embeddings: list[list[float]]
    model: str
    dimensions: int
    processing_time_ms: float


class CrawlResult(BaseModel):
    url: str
    title: str
    text_extracted: str
    entities: list[NEREntity]
    records_found: int
    processing_time_ms: float
    mutated_to_vector_store: bool = False
    vector_chunk_id: Optional[str] = None
    target_database: Optional[str] = None
    target_collection: Optional[str] = None
    total_vectors_in_store: Optional[int] = None


class CrawlBatchResult(BaseModel):
    crawled_count: int
    mutated_count: int
    target_database: str
    target_collection: str
    total_vectors_in_store: int
    results: list[CrawlResult]


class AntimicrobialRecord(BaseModel):
    id: str
    drug_name: str
    drug_class: str
    species: str
    species_category: SpeciesCategory
    route: str
    indication: str
    dosage_mg_kg: float
    duration_days: int
    withdrawal_period_days: int
    year: int
    quarter: int
    region: str
    source: str
    status: DrugStatus


class ModelInfo(BaseModel):
    name: str
    version: str
    type: str
    accuracy: float
    f1_score: float
    parameters: str
    embedding_dims: int
    description: str


class PipelineHealth(BaseModel):
    status: str
    models_loaded: list[str]
    vector_store_docs: int
    total_embeddings: int
    uptime_seconds: float


class VectorSearchRequest(BaseModel):
    query: str = Field(..., description="Query string to search for in vector space")
    limit: int = Field(default=5, ge=1, le=20)
    species_filter: Optional[str] = Field(default=None, description="Pre-filter by species (e.g. Cattle, Swine)")
    source_filter: Optional[str] = Field(default=None, description="Pre-filter by source (e.g. FARAD, FDA)")


class VectorSearchResult(BaseModel):
    chunk_id: str
    document_title: str
    source: str
    content: str
    species: Optional[str] = None
    drug_class: Optional[str] = None
    score: float


class VectorSearchResponse(BaseModel):
    results: list[VectorSearchResult]
    total_results: int
    dimensions: int
    query: str
    pipeline_executed: list[dict]
    engine: str
    latency_ms: float


class VectorStoreStatus(BaseModel):
    database: str
    collection: str
    index_name: str
    dimensions: int
    similarity: str
    total_vectors: int
    connected_to_atlas: bool
    engine: str
    index_spec: dict


class RuntimeConfigRequest(BaseModel):
    provider: Optional[str] = None
    groq_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    openrouter_api_key: Optional[str] = None
    cerebras_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    api_key: Optional[str] = None
    model: Optional[str] = None
    base_url: Optional[str] = None
    openai_base_url: Optional[str] = None
    openai_model: Optional[str] = None
    mongodb_uri: Optional[str] = None
