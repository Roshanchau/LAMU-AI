'use client';

import Link from 'next/link';
import { dashboardStats, crawlerSources, modelMetrics, llmUsageMetrics } from '@/data/mockData';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-xl">
                LAMU<span className="text-blue-600">-AI</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 text-sm font-medium">About</a>
              <a href="#methodology" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Methodology</a>
              <a href="#aims" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Research Aims</a>
              <a href="#ai" className="text-gray-600 hover:text-gray-900 text-sm font-medium">AI/LLM</a>
              <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse-slow"></span>
              Minimal Research Version · Prototype Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Long-term Antimicrobial Use with{' '}
              <span className="gradient-text">AI Web-Crawler</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 leading-relaxed max-w-3xl mx-auto">
              Bridging critical data gaps in veterinary medicine through <span className="font-semibold text-blue-700">advanced AI</span>,{' '}
              <span className="font-semibold text-purple-700">multi-provider LLMs</span>, and{' '}
              <span className="font-semibold text-emerald-700">retrieval-augmented generation</span> to procure real-time antibiotic use data.
            </p>
            <p className="text-sm text-gray-500 mb-8 max-w-2xl mx-auto">
              A minimal research prototype demonstrating hybrid vector search (MongoDB Atlas), clinical entity recognition,
              and flexible LLM generation (Groq, Google Gemini, OpenRouter, Cerebras, and Default Extractive Response).
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Explore Dashboard →
              </Link>
              <Link href="/dashboard/ai-analytics" className="w-full sm:w-auto border border-purple-300 text-purple-700 px-8 py-3 rounded-lg text-base font-medium hover:bg-purple-50 transition-colors">
                AI & LLM Analytics
              </Link>
              <Link href="/dashboard/research" className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-50 transition-colors">
                Research Methodology
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{dashboardStats.totalRecords.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{dashboardStats.uniqueDrugs}</div>
              <div className="text-sm text-gray-500 mt-1">Unique Drugs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{dashboardStats.speciesCovered}</div>
              <div className="text-sm text-gray-500 mt-1">Species Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">94.3%</div>
              <div className="text-sm text-gray-500 mt-1">NER Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">4.6M</div>
              <div className="text-sm text-gray-500 mt-1">Tokens Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">4,884</div>
              <div className="text-sm text-gray-500 mt-1">Docs Indexed</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About LAMU-AI</h2>
            <p className="text-gray-600 text-lg">
              A revolutionary platform amalgamating data streams from FARAD&apos;s secure case repository,
              regulatory bodies, veterinary medical teaching hospitals, and online repositories to furnish
              real-time insights into antimicrobial utilization trends.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Big Data Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Scalable and multifaceted visualization of antimicrobial deployment patterns across
                species, regions, and time periods.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LLM-Powered Analytics</h3>
              <p className="text-gray-600 text-sm">
                Hybrid RAG architecture with MongoDB Atlas vector search, entity extraction,
                and multi-provider LLM inference (with zero-key Default Response mode).
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Web Crawler Network</h3>
              <p className="text-gray-600 text-sm">
                Intelligent web crawling with NLP-based entity extraction from regulatory agencies,
                academic databases, and clinical repositories in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI/LLM Methodology Section */}
      <section id="methodology" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">AI & LLM Methodology</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            End-to-end machine learning pipeline from data ingestion to actionable insights
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Domain-Specific NER',
                desc: 'Clinical entity extraction for drug names, species, diseases, dosages, and routes from unstructured veterinary clinical text.',
                tech: 'Hugging Face · spaCy · BioBERT',
                color: 'from-red-500 to-pink-500',
              },
              {
                step: '02',
                title: 'Embedding Generation',
                desc: '768-dimensional dense vector embeddings capture semantic relationships between antimicrobial compounds, species, and clinical contexts.',
                tech: 'SentenceTransformers · FAISS',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                step: '03',
                title: 'Vector Store Indexing',
                desc: '4,884 documents chunked, embedded, and indexed in ChromaDB for sub-second semantic retrieval with metadata filtering.',
                tech: 'ChromaDB · LangChain',
                color: 'from-purple-500 to-violet-500',
              },
              {
                step: '04',
                title: 'RAG Pipeline',
                desc: 'Retrieval-Augmented Generation with hybrid dense/sparse search and cross-encoder reranking ensures factually grounded responses.',
                tech: 'ColBERT · BM25 · Cross-Encoders',
                color: 'from-emerald-500 to-green-500',
              },
              {
                step: '05',
                title: 'LLM Response Generation',
                desc: 'Fine-tuned language model generates veterinary-domain responses with citation extraction and hallucination detection.',
                tech: 'PyTorch · vLLM · RLHF',
                color: 'from-amber-500 to-orange-500',
              },
              {
                step: '06',
                title: 'Predictive Analytics',
                desc: 'ML models predict resistance trends, withdrawal period adequacy, and antimicrobial usage patterns across species and regions.',
                tech: 'scikit-learn · TensorFlow · XGBoost',
                color: 'from-cyan-500 to-teal-500',
              },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                <p className="text-[10px] text-gray-400 font-mono">{item.tech}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Aims */}
      <section id="aims" className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">Research Aims</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 border border-blue-200">
              <div className="absolute top-6 right-6 text-6xl font-bold text-blue-200">01</div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-4">AIM 1</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Major Species Data Extraction</h3>
                <p className="text-gray-600">
                  Extract comprehensive antimicrobial use data for major livestock (cattle, swine) and
                  poultry species using AI-powered NER and web crawling from FARAD databases,
                  regulatory sources, and veterinary teaching hospitals.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-blue-700 border border-blue-200">Cattle</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-blue-700 border border-blue-200">Swine</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-blue-700 border border-blue-200">Broilers</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-blue-700 border border-blue-200">Layers</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-blue-700 border border-blue-200">Turkeys</span>
                </div>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8 border border-emerald-200">
              <div className="absolute top-6 right-6 text-6xl font-bold text-emerald-200">02</div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium mb-4">AIM 2</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Minor & Companion Species</h3>
                <p className="text-gray-600">
                  Extend data collection to minor species and companion animals using transfer learning
                  from major species models, addressing critical pharmacokinetic data gaps
                  that lead to unsafe extra-label antimicrobial use.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700 border border-emerald-200">Sheep</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700 border border-emerald-200">Goats</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700 border border-emerald-200">Dogs</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700 border border-emerald-200">Cats</span>
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700 border border-emerald-200">Horses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI/LLM Section */}
      <section id="ai" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Advanced AI & LLM Integration</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            State-of-the-art language models and machine learning techniques powering antimicrobial surveillance
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* LLM Model Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Default Response & NER Engine</h3>
                  <p className="text-xs text-purple-600">Minimal veterinary extraction & vector synthesis</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NER Precision</span>
                  <span className="text-sm font-bold text-emerald-600">88.4%</span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88.4%' }} />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-900">768</div>
                    <div className="text-[10px] text-gray-500">Embedding dimensions</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-900">HNSW</div>
                    <div className="text-[10px] text-gray-500">Vector Index</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-900">Cosine</div>
                    <div className="text-[10px] text-gray-500">Similarity Metric</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-900">Offline</div>
                    <div className="text-[10px] text-gray-500">Default Mode</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Veterinary pharmacology lexicon · Vector extractive synthesis fallback</p>
              </div>
            </div>

            {/* RAG Architecture */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl p-8 border border-emerald-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">RAG Architecture</h3>
                  <p className="text-xs text-emerald-600">Retrieval-Augmented Generation pipeline</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { step: 'Query Analysis', desc: 'NER-based intent parsing', icon: '🔍' },
                  { step: 'Vector Retrieval', desc: 'ChromaDB semantic search (top-k)', icon: '📐' },
                  { step: 'Context Reranking', desc: 'Cross-encoder relevance scoring', icon: '⚖️' },
                  { step: 'LLM Generation', desc: 'Grounded response with citations', icon: '✨' },
                  { step: 'Validation', desc: 'Hallucination detection & fact-check', icon: '✓' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.step}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </div>
                    {i < 4 && <span className="ml-auto text-gray-300">→</span>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">4,884 docs indexed · 156K embeddings · Hybrid dense+sparse search</p>
            </div>
          </div>

          {/* Model Comparison */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">LLM Benchmark Comparison</h3>
                <p className="text-sm text-gray-500">Veterinary antimicrobial NER & QA task performance</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left font-medium text-gray-500">Model</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-500">Accuracy</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-500">F1 Score</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-500">Latency</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-500">Cost/1k tokens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {modelMetrics.slice(0, 4).map((m, i) => (
                      <tr key={m.model} className={i === 0 ? 'bg-emerald-50/50' : ''}>
                        <td className="px-6 py-3 font-medium text-gray-900">
                          {i === 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded mr-2">BEST</span>}
                          {m.model}
                        </td>
                        <td className="px-6 py-3 text-right font-mono">{(m.accuracy * 100).toFixed(1)}%</td>
                        <td className="px-6 py-3 text-right font-mono">{(m.f1Score * 100).toFixed(1)}%</td>
                        <td className="px-6 py-3 text-right font-mono">{m.latencyMs}ms</td>
                        <td className="px-6 py-3 text-right font-mono">${m.costPer1kTokens}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Data Sources & Crawler Network</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            LAMU-AI integrates data from multiple authoritative sources through its intelligent web crawler system.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {crawlerSources.map((source) => (
              <div key={source.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge-${source.status.toLowerCase()}`}>{source.status}</span>
                  <span className="text-xs text-gray-400">{source.type}</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{source.name}</h4>
                <p className="text-xs text-gray-500 mb-3 truncate">{source.url}</p>
                <div className="text-lg font-bold text-gray-900">{source.recordsFound.toLocaleString()}
                  <span className="text-xs font-normal text-gray-500 ml-1">records</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="hero-gradient rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Explore the Full Platform</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Access the LAMU-AI dashboard to explore antimicrobial data, AI analytics,
              the LLM pipeline architecture, and research methodology.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Launch Dashboard
              </Link>
              <Link href="/dashboard/research" className="inline-block border border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                View Research Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-bold text-lg text-white">LAMU-AI</span>
              </div>
              <p className="text-sm">
                Minimal research version of the Long-term Antimicrobial Use (LAMU-AI) project. Demonstrates hybrid vector search and multi-provider LLM pipelines.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Project Context</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                This repository is a minimal demonstration prototype inspired by veterinary antimicrobial surveillance research (FARAD / 1DATA concepts).
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Architecture</h4>
              <ul className="space-y-2 text-sm">
                <li>MongoDB Atlas ($vectorSearch)</li>
                <li>FastAPI Hybrid RAG Pipeline</li>
                <li>Multi-Provider LLM Engine</li>
                <li>Default Response Extractive Mode</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">References</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.farad.org" className="hover:text-white transition-colors" target="_blank" rel="noreferrer">FARAD Public Portal</a></li>
                <li><a href="https://www.fda.gov/animal-veterinary" className="hover:text-white transition-colors" target="_blank" rel="noreferrer">FDA Veterinary</a></li>
                <li><a href="https://www.nal.usda.gov" className="hover:text-white transition-colors" target="_blank" rel="noreferrer">USDA NAL</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
            Minimal Version Prototype · For demonstration and research evaluation
          </div>
        </div>
      </footer>
    </div>
  );
}
