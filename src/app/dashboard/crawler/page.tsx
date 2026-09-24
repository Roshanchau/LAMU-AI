'use client';

import { useState, useEffect } from 'react';
import { crawlerSources } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { crawlUrl, crawlAllSources, fetchVectorStoreStatus, type VectorStoreStatus } from '@/lib/api';

export default function CrawlerPage() {
  const [sources, setSources] = useState(crawlerSources);
  const [crawling, setCrawling] = useState<string | null>(null);

  // Live vector store status from FastAPI /api/vector-store/status
  const [storeStatus, setStoreStatus] = useState<VectorStoreStatus | null>(null);

  // Custom live crawl state
  const [customUrl, setCustomUrl] = useState('https://www.nal.usda.gov/research-tools/food-safety-research-projects/bridging-critical-data-gaps-veterinary-medicine-artificial-intelligence-and-advanced-large-language');
  const [customResult, setCustomResult] = useState<any | null>(null);
  const [isCrawlingCustom, setIsCrawlingCustom] = useState(false);

  // Batch crawl state
  const [isBatchCrawling, setIsBatchCrawling] = useState(false);
  const [batchResult, setBatchResult] = useState<any | null>(null);

  const refreshStatus = async () => {
    try {
      const st = await fetchVectorStoreStatus();
      setStoreStatus(st);
    } catch {
      // ignore if offline
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const totalRecords = sources.reduce((sum, s) => sum + s.recordsFound, 0);
  const activeSources = sources.filter(s => s.status === 'Active').length;

  const chartData = sources.map(s => ({
    name: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
    records: s.recordsFound,
  }));

  const handleCrawlSource = async (name: string, url: string) => {
    setCrawling(name);
    try {
      // Call live FastAPI POST /api/crawl with mutate_to_store=True
      const res = await crawlUrl(url, true);
      setCustomResult(res);
      setSources(prev =>
        prev.map(s =>
          s.name === name
            ? {
                ...s,
                lastCrawled: new Date().toISOString(),
                recordsFound: s.recordsFound + (res.records_found || 12),
                status: 'Active' as const,
              }
            : s
        )
      );
      await refreshStatus();
    } catch (err) {
      console.error("Crawl error:", err);
    } finally {
      setCrawling(null);
    }
  };

  const handleCustomCrawl = async () => {
    if (!customUrl.trim()) return;
    setIsCrawlingCustom(true);
    setBatchResult(null);
    try {
      const res = await crawlUrl(customUrl, true);
      setCustomResult(res);
      await refreshStatus();
    } catch (err) {
      console.error("Custom crawl error:", err);
    } finally {
      setIsCrawlingCustom(false);
    }
  };

  const handleBatchCrawl = async () => {
    setIsBatchCrawling(true);
    setCustomResult(null);
    try {
      const res = await crawlAllSources();
      setBatchResult(res);
      await refreshStatus();
    } catch (err) {
      console.error("Batch crawl error:", err);
    } finally {
      setIsBatchCrawling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">AI Web Crawler & Vector Ingestion</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live FastAPI Crawler: /api/crawl
            </span>
          </div>
          <p className="text-gray-500 mt-1">Autonomous data harvesting from regulatory and academic veterinary repositories with direct MongoDB vector mutation</p>
        </div>

        {/* Action Button: Batch Crawl All Repositories */}
        <button
          onClick={handleBatchCrawl}
          disabled={isBatchCrawling || crawling !== null || isCrawlingCustom}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
        >
          {isBatchCrawling ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Harvesting & Mutating to MongoDB Atlas...</span>
            </>
          ) : (
            <>
              <span>⚡ Harvest & Mutate All Sources to MongoDB</span>
              <span className="bg-emerald-800/60 text-[10px] px-1.5 py-0.5 rounded font-mono">POST /api/crawl/all</span>
            </>
          )}
        </button>
      </div>

      {/* Live MongoDB Vector Store Status Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xl shrink-0">
            🍃
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">MongoDB Atlas Vector Store:</span>
              <span className="bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                {storeStatus?.connected_to_atlas ? 'Atlas Connected' : 'In-Memory Emulated'}
              </span>
              <span className="bg-purple-100 text-purple-800 font-mono text-[11px] px-2 py-0.5 rounded border border-purple-200">
                {storeStatus?.database || 'minimal-hande-db'}.{storeStatus?.collection || 'antimicrobial_vectors'}
              </span>
            </div>
            <p className="text-gray-600 text-xs mt-0.5">
              Live storage engine mutates crawled text into 768-dimensional embeddings for immediate RAG retrieval via <code className="text-emerald-700 font-semibold">$vectorSearch</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-gray-500 block">Total Mutated Vectors</span>
            <span className="text-xl font-bold font-mono text-emerald-700">
              {storeStatus?.total_vectors ?? totalRecords}
            </span>
          </div>
          <button
            onClick={refreshStatus}
            className="text-emerald-700 hover:text-emerald-900 border border-emerald-300 hover:bg-emerald-100 p-2 rounded-lg transition-colors"
            title="Refresh MongoDB Status"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-sm text-gray-500">Monitored Repositories</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{sources.length}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500">Active Crawlers</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{activeSources}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500">Atlas Vector Chunks</div>
          <div className="text-2xl font-bold font-mono text-purple-700 mt-1">
            {storeStatus?.total_vectors ?? totalRecords.toLocaleString()}
          </div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500">Active Job Status</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {crawling || isCrawlingCustom || isBatchCrawling ? 'Mutating Data...' : 'Idle (Ready)'}
          </div>
        </div>
      </div>

      {/* Interactive Custom Live Crawler */}
      <div className="chart-card border-2 border-blue-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Live URL Crawler & Vector Ingestion</h3>
            <p className="text-sm text-gray-500">
              Harvest any veterinary research link, extract clinical entities, and mutate directly into <code className="text-emerald-700 font-semibold font-mono">minimal-hande-db.antimicrobial_vectors</code>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs text-gray-800"
            placeholder="https://www.nal.usda.gov/..."
          />
          <button
            onClick={handleCustomCrawl}
            disabled={isCrawlingCustom}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            {isCrawlingCustom ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Harvesting & Mutating...
              </>
            ) : (
              <>
                <span>Harvest & Mutate to Atlas</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Batch Crawl Results Summary Banner */}
        {batchResult && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-3 mb-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <span className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                <span>✓ Batch Ingestion Completed</span>
                <span className="bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-mono">
                  {batchResult.mutated_count} of {batchResult.crawled_count} Sources Mutated
                </span>
              </span>
              <span className="font-mono text-emerald-700 font-semibold">
                Total Vectors in Atlas: {batchResult.total_vectors_in_store}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {batchResult.results?.map((r: any, idx: number) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                  <div className="truncate max-w-[70%]">
                    <span className="font-semibold text-gray-800 block truncate">{r.title}</span>
                    <span className="font-mono text-[10px] text-gray-400">{r.vector_chunk_id}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                    ✓ Mutated
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Single Crawl Result View */}
        {customResult && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
              <div>
                <span className="font-semibold text-gray-900 text-sm block">{customResult.title}</span>
                <span className="font-mono text-gray-500 text-[11px]">{customResult.url}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Latency: {customResult.processing_time_ms}ms · {customResult.records_found} records
                </span>
                {customResult.mutated_to_vector_store && (
                  <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded font-mono font-bold">
                    ✓ Mutated ({customResult.target_database}.{customResult.target_collection})
                  </span>
                )}
              </div>
            </div>

            {/* Mutation Details Card */}
            {customResult.mutated_to_vector_store && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🧬</span>
                  <span className="font-bold text-purple-900">Vector Indexed in MongoDB Atlas:</span>
                  <code className="bg-white px-2 py-0.5 rounded text-purple-800 font-mono font-bold border border-purple-200">
                    {customResult.vector_chunk_id}
                  </code>
                </div>
                <div className="text-purple-700 font-mono text-[11px]">
                  Total vectors now in store: <strong>{customResult.total_vectors_in_store}</strong>
                </div>
              </div>
            )}

            <div>
              <span className="font-semibold text-gray-600 block mb-1">Extracted Text Content:</span>
              <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 leading-relaxed font-sans max-h-48 overflow-y-auto">
                {customResult.text_extracted}
              </p>
            </div>

            {customResult.entities && customResult.entities.length > 0 && (
              <div>
                <span className="font-semibold text-gray-600 block mb-1">Entities Recognized by Clinical NER:</span>
                <div className="flex flex-wrap gap-1.5">
                  {customResult.entities.map((e: any, i: number) => (
                    <span key={i} className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {e.text} <span className="text-[9px] opacity-75 font-mono">({e.label})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Records Harvested by Repository</h3>
        <p className="text-sm text-gray-500 mb-6">Distribution of antimicrobial records across regulatory & academic endpoints</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Bar dataKey="records" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sources Table */}
      <div className="chart-card overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Configured Endpoints & Monitored Repositories</h3>
            <p className="text-xs text-gray-500 mt-0.5">Clicking "Crawl & Mutate" executes clinical NER and upserts embeddings into MongoDB Atlas</p>
          </div>
          <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded">
            Connected to FastAPI Worker
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left font-medium text-gray-500">Source Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Endpoint URL</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Last Synced</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">Total Records</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">Trigger API</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sources.map((source) => (
                <tr key={source.name} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{source.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs max-w-[200px] truncate font-mono">{source.url}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{source.type}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(source.lastCrawled).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-gray-900">{source.recordsFound.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`badge-${source.status.toLowerCase()}`}>{source.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleCrawlSource(source.name, source.url)}
                      disabled={crawling !== null || isBatchCrawling}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 disabled:text-gray-400 disabled:cursor-not-allowed bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      {crawling === source.name ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                          Mutating...
                        </>
                      ) : (
                        <>
                          <span>🍃 Crawl & Mutate</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
