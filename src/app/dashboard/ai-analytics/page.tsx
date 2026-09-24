'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts';
import {
  sampleNERText, sampleNEREntities, embeddingClusters,
  modelMetrics, trainingHistory, llmUsageMetrics
} from '@/data/mockData';
import { extractNER, type NEREntity, type NERResponse } from '@/lib/api';

const NER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  DRUG: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  SPECIES: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  DISEASE: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  ROUTE: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  DOSAGE: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  DURATION: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
  ORGANIZATION: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
};

const CLUSTER_COLORS: Record<string, string> = {
  'Tetracyclines': '#3b82f6',
  'Cephalosporins': '#ef4444',
  'Macrolides': '#f59e0b',
  'Fluoroquinolones': '#22c55e',
  'Penicillins': '#8b5cf6',
  'Aminoglycosides': '#ec4899',
};

const PRESETS = [
  {
    name: "Bovine Respiratory Case",
    text: "A 450kg Holstein dairy cow presenting with bovine respiratory disease was treated with Ceftiofur crystalline free acid at 6.6 mg/kg subcutaneously. Attending veterinarian at Cornell University prescribed a 13 days withdrawal period.",
  },
  {
    name: "Caprine Extra-Label Case",
    text: "In a commercial dairy goat herd, adult does exhibiting symptoms of caseous lymphadenitis were administered Oxytetracycline at 10.0 mg/kg intramuscularly for 3 days. Under FARAD guidance, an extra-label withdrawal of 35 days for meat was established.",
  },
  {
    name: "Canine Cystitis Case",
    text: "A 5-year-old canine with recurrent urinary tract infection was prescribed Amoxicillin-Clavulanate at 13.75 mg/kg oral route for 14 days following microbiological culture at UC Davis VMTH.",
  }
];

export default function AIAnalyticsPage() {
  const [selectedModel, setSelectedModel] = useState(0);
  const [inputText, setInputText] = useState(sampleNERText);
  const [entities, setEntities] = useState<NEREntity[]>(sampleNEREntities);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiResponse, setApiResponse] = useState<NERResponse | null>(null);
  const [nerError, setNerError] = useState<string | null>(null);

  const handleRunNER = async (textToAnalyze?: string) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setNerError(null);
    try {
      // Call live FastAPI POST /api/ner
      const res = await extractNER(text);
      setEntities(res.entities);
      setApiResponse(res);
    } catch (err: any) {
      console.error("NER Error:", err);
      setNerError(err.message || String(err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderAnnotatedText = () => {
    const sorted = [...entities].sort((a, b) => a.start - b.start);
    const parts: JSX.Element[] = [];
    let lastEnd = 0;

    sorted.forEach((entity, i) => {
      if (entity.start > lastEnd) {
        parts.push(<span key={`text-${i}`}>{inputText.slice(lastEnd, entity.start)}</span>);
      }
      const colors = NER_COLORS[entity.label] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
      parts.push(
        <span
          key={`entity-${i}`}
          className={`${colors.bg} ${colors.text} px-1.5 py-0.5 rounded border ${colors.border} cursor-help inline-block my-0.5 mx-0.5 font-medium`}
          title={`${entity.label} (${(entity.confidence * 100).toFixed(0)}% confidence)`}
        >
          {entity.text}
          <sup className={`${colors.text} text-[9px] ml-1 font-bold opacity-75`}>{entity.label}</sup>
        </span>
      );
      lastEnd = entity.end;
    });

    if (lastEnd < inputText.length) {
      parts.push(<span key="text-last">{inputText.slice(lastEnd)}</span>);
    }

    return parts;
  };

  const radarData = modelMetrics.slice(0, 4).map(m => ({
    model: m.model.split(' ')[0],
    accuracy: m.accuracy * 100,
    f1: m.f1Score * 100,
    precision: m.precision * 100,
    recall: m.recall * 100,
    speed: Math.min(100, (1 / m.latencyMs) * 100000),
  }));

  const radarMetrics = [
    { key: 'accuracy', name: 'Accuracy' },
    { key: 'f1', name: 'F1 Score' },
    { key: 'precision', name: 'Precision' },
    { key: 'recall', name: 'Recall' },
    { key: 'speed', name: 'Speed' },
  ];

  const RADAR_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];

  return (
    <div className="space-y-8">
      {/* Header with Live Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">AI & LLM Analytics</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live FastAPI Pipeline (/api/ner)
            </span>
          </div>
          <p className="text-gray-500 mt-1">Named Entity Recognition, embedding clusters, and model benchmarking</p>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">Q</span>
            </div>
            <span className="text-xs text-gray-500">Total Queries</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{llmUsageMetrics.totalQueries.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-emerald-600 font-bold">T</span>
            </div>
            <span className="text-xs text-gray-500">Tokens Processed</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{(llmUsageMetrics.totalTokensProcessed / 1000000).toFixed(1)}M</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">V</span>
            </div>
            <span className="text-xs text-gray-500">Vector Embeddings</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{llmUsageMetrics.embeddingsGenerated.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-amber-600 font-bold">E</span>
            </div>
            <span className="text-xs text-gray-500">NER Entities Extracted</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{llmUsageMetrics.nerEntitiesExtracted.toLocaleString()}</div>
        </div>
      </div>

      {/* Interactive NER Section (Connected to Live API) */}
      <div className="chart-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Veterinary NER Analyzer</h3>
            <p className="text-sm text-gray-500">
              Type or paste clinical notes to run live Named Entity Recognition via <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">POST /api/ner</code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {apiResponse?.is_live && (
              <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">
                ⚡ {apiResponse.processing_time_ms}ms · {apiResponse.entity_count} entities
              </span>
            )}
            <button
              onClick={() => handleRunNER()}
              disabled={isAnalyzing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <span>Extract Entities (FastAPI)</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs font-medium text-gray-400 self-center">Try presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setInputText(p.text);
                handleRunNER(p.text);
              }}
              className="text-xs px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 text-gray-700 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>

        {nerError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
            <span>⚠️ {nerError}</span>
            <span className="font-mono text-[10px]">Endpoint: /api/ner</span>
          </div>
        )}

        {/* Input Textarea */}
        <div className="mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
            placeholder="Enter clinical notes, prescription details, or pathology summaries..."
          />
        </div>

        {/* Entity Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(NER_COLORS).map(([label, colors]) => (
            <span key={label} className={`${colors.bg} ${colors.text} px-2 py-0.5 rounded text-xs font-medium border ${colors.border}`}>
              {label}
            </span>
          ))}
        </div>

        {/* Annotated Output */}
        <div className="bg-gray-50 rounded-xl p-5 text-sm leading-relaxed border border-gray-200">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Live Annotated Output:</div>
          <div className="font-mono text-gray-800">{renderAnnotatedText()}</div>
        </div>

        {/* Entity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {Object.entries(
            entities.reduce((acc, e) => {
              acc[e.label] = (acc[e.label] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([label, count]) => {
            const colors = NER_COLORS[label as keyof typeof NER_COLORS] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
            return (
              <div key={label} className={`${colors.bg} rounded-lg p-2.5 border ${colors.border}`}>
                <div className={`text-base font-bold ${colors.text}`}>{count}</div>
                <div className={`text-[11px] ${colors.text} opacity-80`}>{label} detected</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embeddings + Model Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Embedding Visualization */}
        <div className="chart-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Drug Embedding Space (t-SNE)</h3>
          <p className="text-sm text-gray-500 mb-4">2D projection of 768-dim veterinary pharmacology embeddings</p>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" dataKey="x" name="Dim 1" tick={{ fontSize: 10 }} stroke="#94a3b8" domain={[0, 100]} />
              <YAxis type="number" dataKey="y" name="Dim 2" tick={{ fontSize: 10 }} stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200 text-sm">
                        <p className="font-semibold text-gray-900">{data.label}</p>
                        <p className="text-gray-500 text-xs">{data.category}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {Object.entries(CLUSTER_COLORS).map(([category, color]) => (
                <Scatter
                  key={category}
                  name={category}
                  data={embeddingClusters.filter(e => e.category === category)}
                  fill={color}
                  fillOpacity={0.75}
                >
                  {embeddingClusters.filter(e => e.category === category).map((entry) => (
                    <Cell key={entry.id} r={entry.size} />
                  ))}
                </Scatter>
              ))}
              <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Model Comparison Radar */}
        <div className="chart-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Model Performance Benchmark</h3>
          <p className="text-sm text-gray-500 mb-4">Multi-metric comparison of candidate models on veterinary tasks</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarMetrics.map(m => {
              const point: Record<string, any> = { metric: m.name };
              radarData.forEach(r => { point[r.model] = (r as any)[m.key]; });
              return point;
            })}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
              {radarData.map((r, i) => (
                <Radar
                  key={r.model}
                  name={r.model}
                  dataKey={r.model}
                  stroke={RADAR_COLORS[i]}
                  fill={RADAR_COLORS[i]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fine-Tuning Curves */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Veterinary Domain Evaluation Trajectory</h3>
        <p className="text-sm text-gray-500 mb-4">Loss reduction and benchmark accuracy progression across training epochs</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trainingHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="epoch" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey="trainLoss" stroke="#3b82f6" strokeWidth={2} name="Training Loss" />
            <Line type="monotone" dataKey="valLoss" stroke="#ef4444" strokeWidth={2} name="Validation Loss" />
            <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} name="Accuracy" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
