// API client configured with Next.js proxy rewrites (/api/py) and direct fallback (http://127.0.0.1:8000/api)

function getApiEndpoints(path: string): string[] {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser) {
    // In browser: prefer same-origin proxy /api/py (zero CORS issues), with direct 8000 fallback
    return [`/api/py${path}`, `http://127.0.0.1:8000/api${path}`, `http://localhost:8000/api${path}`];
  }
  // Server-side (Node.js)
  return [`http://127.0.0.1:8000/api${path}`, `http://localhost:8000/api${path}`];
}

async function requestBackend<T>(path: string, options: RequestInit = {}): Promise<{ data: T; isLive: boolean; error?: string }> {
  const endpoints = getApiEndpoints(path);
  let lastError: any = null;

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });
      if (res.ok) {
        const json = await res.json();
        return { data: json, isLive: true };
      }
    } catch (err) {
      lastError = err;
    }
  }

  return {
    data: null as any,
    isLive: false,
    error: lastError ? String(lastError) : "Failed to connect to Python FastAPI backend at http://127.0.0.1:8000",
  };
}

export interface NEREntity {
  text: string;
  label: 'DRUG' | 'SPECIES' | 'DISEASE' | 'ROUTE' | 'DOSAGE' | 'DURATION' | 'ORGANIZATION';
  start: number;
  end: number;
  confidence: number;
}

export interface NERResponse {
  entities: NEREntity[];
  model: string;
  processing_time_ms: number;
  text_length: number;
  entity_count: number;
  is_live: boolean;
}

export interface RetrievedChunk {
  chunk_id: string;
  document_title: string;
  source: string;
  content: string;
  species?: string;
  drug_class?: string;
  relevance_score?: number;
  score?: number;
}

export interface RAGPipelineStep {
  step: number;
  name: string;
  status: string;
  duration_ms: number;
  details?: string;
}

export interface RAGResponse {
  answer: string;
  model: string;
  confidence: number;
  sources: string[];
  related_drugs: string[];
  retrieved_chunks: RetrievedChunk[];
  pipeline_steps: RAGPipelineStep[];
  tokens_used: { input: number; output: number; total: number };
  processing_time_ms: number;
  is_live: boolean;
  provider?: string;
  llm_source?: string;
}

export interface VectorStoreStatus {
  database: string;
  collection: string;
  index_name: string;
  dimensions: number;
  similarity: string;
  total_vectors: number;
  connected_to_atlas: boolean;
  engine: string;
  index_spec: Record<string, any>;
  is_live: boolean;
}

export interface VectorSearchResponse {
  results: RetrievedChunk[];
  total_results: number;
  dimensions: number;
  query: string;
  pipeline_executed: Record<string, any>[];
  engine: string;
  latency_ms: number;
  is_live: boolean;
}

export interface BackendHealth {
  status: string;
  models_loaded: string[];
  vector_store_docs: number;
  total_embeddings: number;
  uptime_seconds: number;
  is_live: boolean;
}

// 1. Health Check
export async function checkBackendHealth(): Promise<BackendHealth> {
  const { data, isLive } = await requestBackend<any>('/health', { cache: 'no-store' });
  if (isLive && data) {
    return { ...data, is_live: true };
  }
  return {
    status: "offline",
    models_loaded: [],
    vector_store_docs: 0,
    total_embeddings: 0,
    uptime_seconds: 0,
    is_live: false,
  };
}

// 2. Named Entity Recognition
export async function extractNER(text: string, model: string = "auto"): Promise<NERResponse> {
  const { data, isLive, error } = await requestBackend<any>('/ner', {
    method: 'POST',
    body: JSON.stringify({ text, model }),
  });

  if (isLive && data) {
    return { ...data, is_live: true };
  }

  throw new Error(error || "Failed to reach Python backend /api/ner");
}

// 3. RAG Query
export async function queryRAG(
  query: string,
  model: string = "auto",
  provider?: string,
  top_k: number = 5
): Promise<RAGResponse> {
  const { data, isLive, error } = await requestBackend<any>('/query', {
    method: 'POST',
    body: JSON.stringify({ query, model, provider, top_k, include_sources: true }),
  });

  if (isLive && data) {
    return { ...data, is_live: true };
  }

  throw new Error(error || "Failed to reach Python backend /api/query");
}

// 4. Vector Store Status (MongoDB)
export async function fetchVectorStoreStatus(): Promise<VectorStoreStatus> {
  const { data, isLive } = await requestBackend<any>('/vector-store/status', { cache: 'no-store' });
  if (isLive && data) {
    return { ...data, is_live: true };
  }
  return {
    database: "lamu_db",
    collection: "vector_store",
    index_name: "vector_index_vetbert",
    dimensions: 768,
    similarity: "cosine",
    total_vectors: 0,
    connected_to_atlas: false,
    engine: "FastAPI Vector Engine",
    index_spec: {},
    is_live: false,
  };
}

// 5. Vector Search (MongoDB $vectorSearch)
export async function searchVectorStore(
  query: string,
  limit: number = 5,
  species_filter?: string,
  source_filter?: string
): Promise<VectorSearchResponse> {
  const { data, isLive, error } = await requestBackend<any>('/vector-store/search', {
    method: 'POST',
    body: JSON.stringify({
      query,
      limit,
      species_filter: species_filter && species_filter !== 'All' ? species_filter : null,
      source_filter: source_filter && source_filter !== 'All' ? source_filter : null,
    }),
  });

  if (isLive && data) {
    return { ...data, is_live: true };
  }

  throw new Error(error || "Failed to reach Python backend /api/vector-store/search");
}

// 6. Fetch Records
export async function fetchRecords(params: {
  species?: string;
  drug_class?: string;
  status?: string;
  year?: number;
  region?: string;
  limit?: number;
} = {}) {
  const query = new URLSearchParams();
  if (params.species && params.species !== 'All') query.append('species', params.species);
  if (params.drug_class && params.drug_class !== 'All') query.append('drug_class', params.drug_class);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.year) query.append('year', String(params.year));
  if (params.region && params.region !== 'All') query.append('region', params.region);
  if (params.limit) query.append('limit', String(params.limit));

  const { data, isLive } = await requestBackend<any[]>(`/data/records?${query.toString()}`, { cache: 'no-store' });
  return { data, is_live: isLive };
}

// 7. Crawl URL & Mutate to Vector Store
export async function crawlUrl(url: string, mutateToStore: boolean = true) {
  const { data, isLive, error } = await requestBackend<any>('/crawl', {
    method: 'POST',
    body: JSON.stringify({ url, extract_entities: true, mutate_to_store: mutateToStore }),
  });

  if (isLive && data) {
    return { ...data, is_live: true };
  }

  throw new Error(error || "Failed to reach Python backend /api/crawl");
}

export async function crawlAllSources() {
  const { data, isLive, error } = await requestBackend<any>('/crawl/all', {
    method: 'POST',
    body: JSON.stringify({}),
  });

  if (isLive && data) {
    return { ...data, is_live: true };
  }

  throw new Error(error || "Failed to reach Python backend /api/crawl/all");
}

// 8. Runtime Config (MongoDB URI + Multi-provider LLMs)
export interface LLMModelOption {
  id: string;
  name: string;
  desc: string;
}

export interface LLMProviderInfo {
  id: string;
  name: string;
  badge: string;
  env_key?: string;
  env_model?: string;
  env_base_url?: string;
  default_base_url?: string;
  base_url?: string;
  default_model: string;
  models: LLMModelOption[];
  key_prefix: string;
  key_hint: string;
  signup_url: string;
  free_tier_info: string;
}

export interface RuntimeConfig {
  mongodb_connected: boolean;
  mongodb_uri_set: boolean;
  mongodb_engine: string;
  llm_connected: boolean;
  active_provider: string;
  provider_name: string;
  provider_badge: string;
  provider_env_key?: string;
  active_model: string;
  active_base_url: string;
  openai_model?: string;
  openai_base_url?: string;
  has_api_key: boolean;
  api_key_masked?: string | null;
  provider_keys_status?: Record<string, boolean>;
  available_providers: LLMProviderInfo[];
}

export async function fetchConfig(): Promise<RuntimeConfig> {
  const { data, isLive } = await requestBackend<RuntimeConfig>('/config', { cache: 'no-store' });
  if (isLive && data) {
    return data;
  }
  return {
    mongodb_connected: false,
    mongodb_uri_set: false,
    mongodb_engine: "in-memory",
    llm_connected: false,
    active_provider: "groq",
    provider_name: "Groq",
    provider_badge: "Free & Ultra-Fast",
    provider_env_key: "GROQ_API_KEY",
    active_model: "llama-3.1-8b-instant",
    active_base_url: "https://api.groq.com/openai/v1",
    has_api_key: false,
    available_providers: [],
  };
}

export async function updateConfig(payload: {
  provider?: string;
  groq_api_key?: string;
  gemini_api_key?: string;
  openrouter_api_key?: string;
  cerebras_api_key?: string;
  openai_api_key?: string;
  api_key?: string;
  model?: string;
  base_url?: string;
  mongodb_uri?: string;
}): Promise<RuntimeConfig> {
  const { data, isLive, error } = await requestBackend<RuntimeConfig>('/config', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (isLive && data) {
    return data;
  }
  throw new Error(error || "Failed to update configuration");
}
