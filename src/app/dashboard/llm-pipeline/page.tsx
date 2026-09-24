'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ragPipelineSteps, processedDocuments, llmUsageMetrics } from '@/data/mockData';
import { fetchVectorStoreStatus, searchVectorStore, type VectorStoreStatus, type VectorSearchResponse } from '@/lib/api';

const architectureLayers = [
  {
    name: 'Data Ingestion Layer',
    color: 'from-blue-500 to-blue-600',
    icon: '📥',
    components: ['FARAD Database Connector', 'FDA Green Book API', 'PubMed Crawler', 'VMTH Records Parser'],
    description: 'Multi-source data collection via REST APIs, web crawlers, and direct database connectors',
    tech: 'Python · Scrapy · BeautifulSoup · aiohttp',
  },
  {
    name: 'NLP Processing Layer',
    color: 'from-purple-500 to-purple-600',
    icon: '🧠',
    components: ['Veterinary NER Pipeline', 'Clinical Lexicon & Regex', 'Entity Linking', 'Relation Extraction'],
    description: 'Domain-specific NLP pipeline for extracting structured data from unstructured veterinary text',
    tech: 'FastAPI · Biomedical NER · Lexicon Patterns',
  },
  {
    name: 'Vector Database & Embeddings',
    color: 'from-emerald-500 to-emerald-600',
    icon: '🍃',
    components: ['MongoDB Atlas Vector Search', '768-dim Dense Vectors', 'HNSW Vector Index', 'Metadata Pre-Filtering'],
    description: 'MongoDB Atlas collection with 768-dimensional dense vector embeddings and cosine similarity index',
    tech: 'MongoDB Atlas · PyMongo · $vectorSearch · NumPy',
  },
  {
    name: 'RAG Retrieval Engine',
    color: 'from-amber-500 to-amber-600',
    icon: '🔍',
    components: ['MongoDB Aggregation Pipeline', 'Context Reranking (MMR)', 'Chunk Assembly', 'Citation Tracker'],
    description: 'Retrieval-Augmented Generation using MongoDB $vectorSearch aggregation with cross-encoder reranking',
    tech: 'MongoDB Pipelines · Dense Retrieval · MMR',
  },
  {
    name: 'LLM Generation Layer',
    color: 'from-red-500 to-red-600',
    icon: '✨',
    components: ['Multi-Provider LLMs (Groq, Gemini, OpenRouter)', 'Default Response (Vector Synthesis)', 'Citation Tracker', 'Validation Engine'],
    description: 'Flexible LLM generation with domain grounding and default zero-key vector synthesis fallback',
    tech: 'Groq · Gemini · OpenRouter · Cerebras · OpenAI · Default Mode',
  },
  {
    name: 'Analytics & Visualization',
    color: 'from-cyan-500 to-cyan-600',
    icon: '📊',
    components: ['Interactive Dashboard', 'Trend Analysis Engine', 'Resistance Predictor', 'Report Generator'],
    description: 'Real-time visualization and predictive analytics for antimicrobial stewardship decisions',
    tech: 'Next.js 14 · Recharts · Tailwind CSS · TypeScript',
  },
];

export default function LLMPipelinePage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // MongoDB Vector Search state
  const [vectorStatus, setVectorStatus] = useState<VectorStoreStatus | null>(null);
  const [vectorQuery, setVectorQuery] = useState('withdrawal period for cephalosporins in cattle');
  const [speciesFilter, setSpeciesFilter] = useState('Cattle');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [isSearchingVector, setIsSearchingVector] = useState(false);
  const [vectorResults, setVectorResults] = useState<VectorSearchResponse | null>(null);

  useEffect(() => {
    // Fetch live vector database status on mount
    fetchVectorStoreStatus().then(status => setVectorStatus(status));
    // Run initial vector search
    handleVectorSearch('withdrawal period for cephalosporins in cattle', 'Cattle', 'All');
  }, []);

  const handleVectorSearch = async (q?: string, sp?: string, src?: string) => {
    const query = q !== undefined ? q : vectorQuery;
    const species = sp !== undefined ? sp : speciesFilter;
    const source = src !== undefined ? src : sourceFilter;

    if (!query.trim()) return;
    setIsSearchingVector(true);

    try {
      const res = await searchVectorStore(query, 4, species, source);
      setVectorResults(res);
    } catch (err) {
      console.error("Vector search failed:", err);
    } finally {
      setIsSearchingVector(false);
    }
  };

  const simulateRAGPipeline = async () => {
    setIsProcessing(true);
    setCompletedSteps([]);
    for (let i = 0; i < ragPipelineSteps.length; i++) {
      setActiveStep(i);
      await new Promise(resolve => setTimeout(resolve, ragPipelineSteps[i].duration! * 2 + 150));
      setCompletedSteps(prev => [...prev, i]);
    }
    setActiveStep(null);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">LLM Pipeline & Vector Database (Minimal Version)</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MongoDB Atlas Vector Search Active
            </span>
          </div>
          <p className="text-gray-500 mt-1">Minimal research prototype: end-to-end architecture with MongoDB Atlas HNSW vector search and multi-provider LLMs.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-medium">
          <span>🍃 MongoDB Database: <strong>{vectorStatus?.database || 'lamu_ai_db'}</strong></span>
        </div>
      </div>

      {/* MongoDB Vector Store Live Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Vector DB Collection</div>
          <div className="text-lg font-bold text-emerald-700 truncate">{vectorStatus?.collection || 'antimicrobial_vectors'}</div>
          <div className="text-[11px] text-gray-400 mt-1">Database: {vectorStatus?.database || 'lamu_ai_db'}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Index Definition</div>
          <div className="text-lg font-bold text-blue-700 truncate">{vectorStatus?.index_name || 'vector_index_vetbert'}</div>
          <div className="text-[11px] text-gray-400 mt-1">Type: vectorSearch (HNSW)</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Embedding Dimensions</div>
          <div className="text-2xl font-bold text-gray-900">{vectorStatus?.dimensions || 768}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Metric: {vectorStatus?.similarity || 'cosine'}</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-gray-500 mb-1">Vectors Indexed</div>
          <div className="text-2xl font-bold text-gray-900">{vectorStatus?.total_vectors || 41}</div>
          <div className="text-[11px] text-purple-600 mt-1">{vectorStatus?.engine || 'MongoDB Vector Search'}</div>
        </div>
      </div>

      {/* Interactive MongoDB Vector Search Explorer */}
      <div className="chart-card border-2 border-emerald-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🍃</span>
              <h3 className="text-lg font-bold text-gray-900">Live MongoDB Vector Search ($vectorSearch)</h3>
            </div>
            <p className="text-sm text-gray-500">
              Execute live vector similarity queries against MongoDB with metadata pre-filtering
            </p>
          </div>
          {vectorResults && (
            <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200">
              ⚡ Latency: {vectorResults.latency_ms}ms · {vectorResults.total_results} hits
            </span>
          )}
        </div>

        {/* Vector Search Form */}
        <div className="grid md:grid-cols-4 gap-3 mb-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Semantic Query</label>
            <input
              type="text"
              value={vectorQuery}
              onChange={(e) => setVectorQuery(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter search phrase..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Species Filter (Metadata)</label>
            <select
              value={speciesFilter}
              onChange={(e) => {
                setSpeciesFilter(e.target.value);
                handleVectorSearch(vectorQuery, e.target.value, sourceFilter);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Species</option>
              <option value="Cattle">Cattle</option>
              <option value="Goats">Goats</option>
              <option value="Swine">Swine</option>
              <option value="Broiler Chickens">Broiler Chickens</option>
              <option value="Dogs">Dogs</option>
              <option value="Cats">Cats</option>
              <option value="Horses">Horses</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => handleVectorSearch()}
              disabled={isSearchingVector}
              className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isSearchingVector ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <span>$vectorSearch</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results & Raw Pipeline Code */}
        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          {/* Matched Chunks */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Top Vector Matches ({vectorResults?.results?.length || 0})
            </span>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {vectorResults?.results?.map((res, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-gray-900">{res.document_title}</span>
                    <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      Score: {(res.score || 0).toFixed(4)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-2">{res.content}</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-medium border border-blue-200">
                      {res.source}
                    </span>
                    {res.species && (
                      <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-[10px]">
                        {res.species}
                      </span>
                    )}
                    {res.drug_class && (
                      <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px]">
                        {res.drug_class}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw MongoDB Aggregation Pipeline */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                MongoDB Aggregation Pipeline Executed:
              </span>
              <span className="text-[10px] text-gray-400 font-mono">db.antimicrobial_vectors.aggregate([...])</span>
            </div>
            <div className="bg-gray-900 text-gray-200 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[360px] border border-gray-800 leading-normal">
              <pre>{JSON.stringify(vectorResults?.pipeline_executed || [
                {
                  "$vectorSearch": {
                    "index": "vector_index_vetbert",
                    "path": "embedding",
                    "queryVector": "[... 768-dim dense embedding ...]",
                    "numCandidates": 50,
                    "limit": 5,
                    "filter": { "species": "Cattle" }
                  }
                },
                {
                  "$project": {
                    "_id": 0,
                    "chunk_id": 1,
                    "document_title": 1,
                    "source": 1,
                    "content": 1,
                    "score": { "$meta": "vectorSearchScore" }
                  }
                }
              ], null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">System Architecture</h3>
        <p className="text-sm text-gray-500 mb-6">End-to-end pipeline from data ingestion to visualization</p>
        <div className="space-y-4">
          {architectureLayers.map((layer, i) => (
            <div key={layer.name} className="relative">
              <div className="flex gap-4">
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center text-lg shadow-sm text-white font-bold`}>
                    {layer.icon}
                  </div>
                  {i < architectureLayers.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-2 min-h-[20px]" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{layer.name}</h4>
                      <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">{layer.tech}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{layer.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.components.map(comp => (
                        <span key={comp} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RAG Pipeline Simulation */}
      <div className="chart-card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">7-Step RAG Pipeline Execution Flow</h3>
            <p className="text-sm text-gray-500">Retrieval-augmented generation flow linking MongoDB vectors to LLM generation</p>
          </div>
          <button
            onClick={simulateRAGPipeline}
            disabled={isProcessing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Executing Pipeline...
              </>
            ) : (
              <>
                <span>Simulate Complete Flow</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </>
            )}
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {ragPipelineSteps.map((step, i) => {
            const isActive = activeStep === i;
            const isCompleted = completedSteps.includes(i);
            return (
              <div
                key={step.step}
                className={`rounded-xl p-4 border transition-all duration-300 ${
                  isActive
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? '✓' : step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-semibold ${
                        isActive ? 'text-blue-900' : isCompleted ? 'text-emerald-900' : 'text-gray-700'
                      }`}>{step.name}</h4>
                      {step.duration && (
                        <span className={`text-xs font-mono ${
                          isCompleted ? 'text-emerald-600' : 'text-gray-400'
                        }`}>{step.duration}ms</span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${
                      isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-gray-500'
                    }`}>{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
