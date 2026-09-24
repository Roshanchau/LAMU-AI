'use client';

import { useState, useRef, useEffect } from 'react';
import {
  queryRAG,
  fetchConfig,
  updateConfig,
  getBackendUrl,
  type RAGResponse,
  type RuntimeConfig,
  type LLMProviderInfo,
} from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  response?: RAGResponse;
}

const suggestedQueries = [
  { text: 'What are the withdrawal periods for common cattle antibiotics?', icon: '🐄' },
  { text: 'Show me antimicrobial resistance trends in livestock', icon: '📈' },
  { text: 'What drugs are most used in cattle for respiratory disease?', icon: '💊' },
  { text: 'Tell me about companion animal antimicrobial usage', icon: '🐕' },
  { text: 'What is the extra-label usage rate across minor species?', icon: '⚠️' },
  { text: 'Which regions have the highest antimicrobial usage?', icon: '🗺️' },
];

const PROVIDER_OPTIONS = [
  { id: 'groq', name: 'Groq', badge: 'Free & Fast', icon: '⚡' },
  { id: 'gemini', name: 'Google Gemini', badge: 'Free AI Studio', icon: '✨' },
  { id: 'openrouter', name: 'OpenRouter', badge: '100% Free', icon: '🌐' },
  { id: 'cerebras', name: 'Cerebras', badge: 'Free Wafer', icon: '🚀' },
  { id: 'openai', name: 'OpenAI', badge: 'Commercial', icon: '🟢' },
  { id: 'ollama', name: 'Ollama', badge: 'Local Offline', icon: '🦙' },
  { id: 'default', name: 'Default Response', badge: 'No Key Required', icon: '🍃' },
];

const FALLBACK_MODELS_BY_PROVIDER: Record<string, { id: string; name: string }[]> = {
  groq: [
    { id: 'llama-3.1-8b-instant', name: 'llama-3.1-8b-instant (Universal Free Tier • ~560 tok/s)' },
    { id: 'llama-3.3-70b-versatile', name: 'llama-3.3-70b-versatile (70B Reasoning)' },
    { id: 'llama3-70b-8192', name: 'llama3-70b-8192 (Meta Llama 3 70B)' },
    { id: 'llama3-8b-8192', name: 'llama3-8b-8192 (Meta Llama 3 8B)' },
    { id: 'mixtral-8x7b-32768', name: 'mixtral-8x7b-32768 (MoE Architecture)' },
    { id: 'gemma2-9b-it', name: 'gemma2-9b-it (Google Gemma 2 9B)' },
  ],
  gemini: [
    { id: 'gemini-1.5-flash', name: 'gemini-1.5-flash (1M token context)' },
    { id: 'gemini-2.0-flash', name: 'gemini-2.0-flash (Next-gen multimodal)' },
  ],
  openrouter: [
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'meta-llama/llama-3.3-70b-instruct:free (100% Free)' },
    { id: 'deepseek/deepseek-r1:free', name: 'deepseek/deepseek-r1:free (Reasoning Free)' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'mistralai/mistral-7b-instruct:free (Free)' },
  ],
  cerebras: [
    { id: 'llama3.1-8b', name: 'llama3.1-8b (~1800 tok/s Free Wafer)' },
    { id: 'llama-3.3-70b', name: 'llama-3.3-70b (Cerebras CS-3)' },
  ],
  openai: [
    { id: 'gpt-4o-mini', name: 'gpt-4o-mini' },
    { id: 'gpt-4o', name: 'gpt-4o' },
  ],
  ollama: [
    { id: 'llama3.2', name: 'llama3.2 (Local 3B)' },
    { id: 'llama3.1:8b', name: 'llama3.1:8b (Local 8B)' },
  ],
  default: [
    { id: 'Default Knowledge Response', name: 'Default Response (Vector Extractive Synthesis)' },
  ],
};

export default function QueryPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('groq');
  const [selectedModel, setSelectedModel] = useState('llama-3.1-8b-instant');
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [lastResponse, setLastResponse] = useState<RAGResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Runtime settings modal state
  const [config, setConfig] = useState<RuntimeConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Form inputs inside modal
  const [modalProvider, setModalProvider] = useState<string>('groq');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [mongoUriInput, setMongoUriInput] = useState('');
  const [baseUrlInput, setBaseUrlInput] = useState('https://api.groq.com/openai/v1');
  const [modelInput, setModelInput] = useState('llama-3.1-8b-instant');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  useEffect(() => {
    fetchConfig().then(c => {
      setConfig(c);
      if (c.active_provider) {
        setSelectedProvider(c.active_provider);
        setModalProvider(c.active_provider);
      }
      if (c.active_model) {
        setSelectedModel(c.active_model);
        setModelInput(c.active_model);
      }
      if (c.active_base_url) {
        setBaseUrlInput(c.active_base_url);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, activeStep]);

  // When changing provider directly in UI Control Bar
  const handleDirectProviderChange = (provId: string) => {
    setSelectedProvider(provId);
    setModalProvider(provId);
    const prov = config?.available_providers?.find(p => p.id === provId);
    const models = prov?.models || FALLBACK_MODELS_BY_PROVIDER[provId] || [];
    const defaultM = prov?.default_model || models[0]?.id || 'Default Knowledge Response';
    setSelectedModel(defaultM);
    setModelInput(defaultM);
    if (prov) {
      setBaseUrlInput(prov.default_base_url || prov.base_url || '');
    }
  };

  // When changing provider in modal, automatically update default base_url & model
  const handleProviderSelect = (provId: string) => {
    setModalProvider(provId);
    const prov = config?.available_providers?.find(p => p.id === provId);
    if (prov) {
      setBaseUrlInput(prov.default_base_url || prov.base_url || '');
      setModelInput(prov.default_model);
    }
  };

  const handleSubmit = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = { role: 'user', content: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setActiveStep(1);

    try {
      const ragData = await queryRAG(queryText, selectedModel, selectedProvider, 5);
      setLastResponse(ragData);

      // Smooth step visualization
      for (let i = 1; i <= (ragData.pipeline_steps?.length || 7); i++) {
        setActiveStep(i);
        await new Promise(r => setTimeout(r, 45));
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: ragData.answer,
        response: ragData,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("API error:", err);
      const errorMsg: Message = {
        role: 'assistant',
        content: `⚠️ Error contacting Python backend: ${err.message || String(err)}. Please ensure FastAPI is running at ${getBackendUrl()}.`,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setActiveStep(-1);
    }
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    setSaveSuccessMsg('');
    try {
      const updated = await updateConfig({
        provider: modalProvider,
        api_key: apiKeyInput ? apiKeyInput.trim() : undefined,
        mongodb_uri: mongoUriInput ? mongoUriInput.trim() : undefined,
        base_url: baseUrlInput ? baseUrlInput.trim() : undefined,
        model: modelInput ? modelInput.trim() : undefined,
      });
      setConfig(updated);
      setSelectedModel(updated.active_model);
      setSaveSuccessMsg(`Connected successfully to ${updated.provider_name}!`);
      setTimeout(() => {
        setShowConfigModal(false);
        setSaveSuccessMsg('');
        setApiKeyInput('');
      }, 1200);
    } catch (err) {
      alert("Failed to update settings on FastAPI backend");
    } finally {
      setIsSavingConfig(false);
    }
  };

  const activeProvInfo = config?.available_providers?.find(p => p.id === (config?.active_provider || 'groq'));
  const modalProvInfo = config?.available_providers?.find(p => p.id === modalProvider);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">AI Query Interface (Minimal Version)</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live FastAPI Pipeline (/api/query)
            </span>
          </div>
          <p className="text-gray-500 mt-1">Minimal research prototype: 7-stage RAG pipeline querying MongoDB vector store with multi-provider LLM generation.</p>
        </div>

        <button
          onClick={() => setShowConfigModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-blue-800 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
        >
          <span>⚡ Select Free LLM & Database</span>
          <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {selectedProvider.toUpperCase()}
          </span>
        </button>
      </div>

      {/* Connection & Mode Status Banner */}
      <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 border border-blue-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-5 flex-wrap">
          {/* Vector DB */}
          <div className="flex items-center gap-1.5">
            <span className="text-base">🍃</span>
            <span className="font-semibold text-gray-700">Vector Store:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
              config?.mongodb_connected
                ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {config?.mongodb_connected ? 'MongoDB Atlas (Connected)' : 'MongoDB Vector Engine (NumPy Emulated)'}
            </span>
          </div>

          {/* Active LLM Provider */}
          <div className="flex items-center gap-1.5">
            <span className="text-base">🤖</span>
            <span className="font-semibold text-gray-700">Selected Provider:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 ${
              selectedProvider === 'default'
                ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
                : config?.provider_keys_status?.[selectedProvider] || selectedProvider === 'ollama'
                ? 'bg-purple-100 text-purple-800 font-bold border border-purple-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              <span>{PROVIDER_OPTIONS.find(p => p.id === selectedProvider)?.name || selectedProvider}</span>
              <span className="text-[10px] text-gray-500 font-normal">({selectedModel})</span>
            </span>
            {selectedProvider === 'default' ? (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                Zero API Key
              </span>
            ) : config?.provider_keys_status?.[selectedProvider] ? (
              <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-200">
                Active Key
              </span>
            ) : null}
          </div>
        </div>

        <button
          onClick={() => {
            setModalProvider(selectedProvider);
            setShowConfigModal(true);
          }}
          className="text-blue-700 hover:text-blue-900 font-semibold underline text-xs flex items-center gap-1"
        >
          <span>Configure Provider / Keys</span>
          <span>→</span>
        </button>
      </div>

      {/* Control Bar: Direct Provider & Model Selection */}
      <div className="chart-card !p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* LLM Provider Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">LLM Provider:</span>
              <select
                value={selectedProvider}
                onChange={(e) => handleDirectProviderChange(e.target.value)}
                className="text-xs font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              >
                {PROVIDER_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.name} ({p.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* Model Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="text-xs font-mono border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs max-w-xs sm:max-w-md truncate"
              >
                {(config?.available_providers?.find(p => p.id === selectedProvider)?.models || FALLBACK_MODELS_BY_PROVIDER[selectedProvider] || []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name || m.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Status note */}
            {selectedProvider === 'default' ? (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
                🍃 Zero Key Needed (Vector Extractive Mode)
              </span>
            ) : selectedProvider === 'ollama' ? (
              <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md font-medium">
                🦙 Localhost:11434
              </span>
            ) : !config?.provider_keys_status?.[selectedProvider] ? (
              <button
                type="button"
                onClick={() => {
                  setModalProvider(selectedProvider);
                  setShowConfigModal(true);
                }}
                className="text-[11px] text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>⚠️ No {selectedProvider.toUpperCase()} Key</span>
                <span className="underline font-bold">Add Key</span>
              </button>
            ) : (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Ready</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Dimensions: <strong className="font-mono text-gray-700">768</strong></span>
            <span>Index: <strong className="font-mono text-gray-700">HNSW ($vectorSearch)</strong></span>
            <span>Metric: <strong className="font-mono text-gray-700">Cosine</strong></span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chart-card min-h-[520px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 space-y-6 mb-6 overflow-y-auto max-h-[600px]">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🔬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Antimicrobial Research Assistant (Minimal Version)</h3>
              <p className="text-gray-600 text-sm max-w-lg mx-auto mb-2">
                Minimal demonstration prototype connected to <span className="font-semibold text-blue-700">FastAPI</span> with multi-provider
                LLM inference and <span className="font-semibold text-emerald-700">MongoDB Atlas Vector Search</span>.
              </p>
              <p className="text-gray-400 text-xs mb-8">
                Select your LLM provider above, or use Default Response without an API key. Click any research question below:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
                {suggestedQueries.map((q) => (
                  <button
                    key={q.text}
                    onClick={() => handleSubmit(q.text)}
                    className="text-left p-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-blue-400 hover:bg-blue-50 transition-all hover:shadow-sm group"
                  >
                    <span className="text-lg mr-2">{q.icon}</span>
                    <span className="group-hover:text-blue-700">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-2xl rounded-br-md px-5 py-3 shadow-sm'
                  : 'bg-white rounded-2xl rounded-bl-md px-5 py-4 border border-gray-200 shadow-sm'
              }`}>
                {/* Assistant header */}
                {msg.role === 'assistant' && msg.response && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-700">
                        {msg.response.llm_source || msg.response.model}
                      </span>
                      {msg.response.is_live && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          LIVE FASTAPI
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                      <span>{msg.response.processing_time_ms}ms</span>
                      <span>{msg.response.tokens_used.total} tokens</span>
                      <span className="text-emerald-600 font-semibold">
                        {(msg.response.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                )}

                <div className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                  {msg.content}
                </div>

                {/* Retrieved Knowledge Chunks & Metadata */}
                {msg.role === 'assistant' && msg.response && (
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                    {/* Sources & Related Drugs */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 font-medium">Citations:</span>
                        {msg.response.sources.map(s => (
                          <span key={s} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400 font-medium">Identified Drugs:</span>
                        {msg.response.related_drugs.map(d => (
                          <span key={d} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Vector Search Chunks */}
                    {msg.response.retrieved_chunks && msg.response.retrieved_chunks.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            Retrieved from MongoDB Vector Store ({msg.response.retrieved_chunks.length} chunks)
                          </span>
                        </div>
                        <div className="space-y-2">
                          {msg.response.retrieved_chunks.slice(0, 3).map((chunk, cIdx) => (
                            <div key={cIdx} className="bg-white p-2.5 rounded-lg border border-gray-200 text-xs">
                              <div className="flex items-center justify-between text-gray-500 mb-1">
                                <span className="font-semibold text-gray-800">{chunk.document_title}</span>
                                <span className="font-mono text-emerald-600">
                                  Score: {(chunk.score || chunk.relevance_score || 0).toFixed(3)}
                                </span>
                              </div>
                              <p className="text-gray-600 leading-normal">{chunk.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Live Pipeline Execution Progress */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl rounded-bl-md p-4 max-w-[85%]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                  <span className="text-xs font-bold text-blue-900">
                    Executing FastAPI RAG Pipeline (POST /api/query)...
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "1. Query Analysis (NER Intent)",
                    "2. Embedding Generation (768-dim)",
                    "3. MongoDB Vector Search ($vectorSearch)",
                    "4. Context Reranking (MMR)",
                    `5. LLM Grounded Generation (${selectedModel})`,
                    "6. Citation Extraction",
                    "7. Confidence Validation"
                  ].map((stepLabel, sIdx) => (
                    <div
                      key={stepLabel}
                      className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                        activeStep >= sIdx + 1
                          ? 'bg-emerald-100 text-emerald-800 font-medium'
                          : 'bg-white/60 text-gray-400'
                      }`}
                    >
                      {activeStep > sIdx + 1 ? '✓ ' : activeStep === sIdx + 1 ? '▶ ' : '○ '}
                      {stepLabel}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-100 pt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(input);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any question about veterinary antimicrobial data, withdrawal times, or resistance..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              <span>Send Query</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
            <span>Directly wired to FastAPI backend (`{getBackendUrl()}/api/query`)</span>
            <span>Vector Engine: MongoDB Atlas ($vectorSearch)</span>
          </div>
        </div>
      </div>

      {/* Settings Modal (Configuring Free-Tier LLMs and MongoDB URI) */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>⚡ Free-Tier LLM & Vector DB Setup</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select a free hosted OpenAI-compatible provider (Groq, Gemini, OpenRouter, Cerebras).
                </p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Provider Quick Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                1. Select Hosted LLM Provider:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'groq', name: 'Groq', badge: 'Free & Fast', icon: '⚡' },
                  { id: 'gemini', name: 'Google Gemini', badge: 'Free AI Studio', icon: '✨' },
                  { id: 'openrouter', name: 'OpenRouter', badge: '100% Free', icon: '🌐' },
                  { id: 'cerebras', name: 'Cerebras', badge: 'Free Wafer', icon: '🚀' },
                  { id: 'openai', name: 'OpenAI', badge: 'Commercial', icon: '🟢' },
                  { id: 'ollama', name: 'Ollama', badge: 'Offline', icon: '🦙' },
                  { id: 'default', name: 'Default Response', badge: 'No Key Needed', icon: '🍃' },
                ].map((prov) => {
                  const isConfigured = config?.provider_keys_status?.[prov.id];
                  return (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => handleProviderSelect(prov.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        modalProvider === prov.id
                          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{prov.icon}</span>
                        <div className="flex items-center gap-1">
                          {isConfigured && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Key Configured"></span>
                          )}
                          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                            {prov.badge}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-gray-900">{prov.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Provider Details & Free Tier Signup Link */}
            {modalProvInfo && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-900">{modalProvInfo.name}</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                      {modalProvInfo.env_key || 'Local'}
                    </span>
                  </div>
                  {modalProvInfo.signup_url && (
                    <a
                      href={modalProvInfo.signup_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold underline text-[11px] flex items-center gap-1"
                    >
                      <span>Get Free API Key</span>
                      <span className="text-[9px]">↗</span>
                    </a>
                  )}
                </div>
                <p className="text-gray-600 text-[11px]">{modalProvInfo.free_tier_info}</p>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700">
                    API Key for {modalProvInfo?.name || modalProvider}
                  </label>
                  {modalProvInfo?.env_key && (
                    <span className="text-[10px] font-mono text-gray-400">
                      Env: {modalProvInfo.env_key}
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={modalProvInfo?.key_hint || "Enter API Key..."}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  {config?.provider_keys_status?.[modalProvider]
                    ? `✓ Active key detected for ${modalProvInfo?.name || modalProvider}. Enter a new key to update.`
                    : `No key set yet for ${modalProvInfo?.name || modalProvider}. Enter one above or leave blank for extractive vector mode.`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {modalProvInfo?.name || 'Provider'} Base URL
                  </label>
                  <input
                    type="text"
                    value={baseUrlInput}
                    onChange={(e) => setBaseUrlInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  />
                  {modalProvInfo?.env_base_url && (
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Env: {modalProvInfo.env_base_url}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Model Identifier
                  </label>
                  <input
                    type="text"
                    value={modelInput}
                    onChange={(e) => setModelInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                  />
                  {modalProvInfo?.env_model && (
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      Env: {modalProvInfo.env_model}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  MongoDB Atlas Connection URI
                </label>
                <input
                  type="text"
                  value={mongoUriInput}
                  onChange={(e) => setMongoUriInput(e.target.value)}
                  placeholder="mongodb+srv://<username>:<password>@cluster.mongodb.net/..."
                  className="w-full px-3 py-2 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Connects live MongoDB Atlas cluster for official <code className="text-gray-600">$vectorSearch</code> pipeline execution.
                </span>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
                ✓ {saveSuccessMsg}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={isSavingConfig}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {isSavingConfig ? "Saving to FastAPI..." : "Save & Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
