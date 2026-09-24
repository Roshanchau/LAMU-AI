'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const researchTimeline = [
  {
    phase: 'Phase 1',
    title: 'Data Infrastructure & Collection',
    period: 'Months 1-6',
    status: 'completed' as const,
    tasks: [
      'Establish FARAD database connectors and API integrations',
      'Deploy web crawler network for FDA, USDA, PubMed sources',
      'Build ETL pipeline for multi-source data normalization',
      'Develop veterinary domain ontology for entity standardization',
    ],
    deliverables: ['Data pipeline v1.0', 'Crawler network deployment', 'Normalized schema design'],
    aim: 'AIM 1',
  },
  {
    phase: 'Phase 2',
    title: 'NLP & LLM Development',
    period: 'Months 4-12',
    status: 'in-progress' as const,
    tasks: [
      'Build clinical NER pipeline for veterinary entities',
      'Train entity linking model for drug-species-disease triples',
      'Build RAG system with MongoDB Atlas vector store',
      'Implement multi-provider LLM pipelines and extractive fallback',
    ],
    deliverables: ['Clinical NER Pipeline', 'MongoDB Atlas RAG pipeline', 'Multi-Provider LLM Integration'],
    aim: 'AIM 1 & 2',
  },
  {
    phase: 'Phase 3',
    title: 'Minor Species & Companion Animal Extension',
    period: 'Months 8-18',
    status: 'in-progress' as const,
    tasks: [
      'Extend NER model for minor species (sheep, goats) pharmacology',
      'Integrate VMTH companion animal treatment records',
      'Address data scarcity via transfer learning and data augmentation',
      'Validate withdrawal period predictions for extra-label use cases',
    ],
    deliverables: ['Minor species module', 'Companion animal database', 'Transfer learning model'],
    aim: 'AIM 2',
  },
  {
    phase: 'Phase 4',
    title: 'Dashboard, Validation & Dissemination',
    period: 'Months 14-24',
    status: 'planned' as const,
    tasks: [
      'Deploy interactive Big Data Dashboard with real-time analytics',
      'Conduct stakeholder validation with veterinarians and regulators',
      'Publish findings in peer-reviewed journals (JAVMA, Prev Vet Med)',
      'Open-source LAMU-AI toolkit for antimicrobial surveillance community',
    ],
    deliverables: ['LAMU-AI Dashboard v1.0', 'Peer-reviewed publications', 'Open-source release'],
    aim: 'AIM 1 & 2',
  },
];

const literatureContext = [
  {
    area: 'Antimicrobial Resistance Surveillance',
    gap: 'Fragmented data sources with no unified real-time monitoring across species',
    approach: 'Integrated web crawler + FARAD database + regulatory API pipeline',
    references: ['O\'Neill (2016) AMR Review', 'WHO GLASS Reports', 'NARMS Annual Reports'],
  },
  {
    area: 'NLP in Veterinary Medicine',
    gap: 'Fragmented veterinary pharmacology clinical records and unstructured text',
    approach: 'Clinical entity recognition and relation extraction over veterinary data',
    references: ['Lee et al. (2020) BioBERT', 'Gu et al. (2021) PubMedBERT', 'Beltagy et al. (2019) SciBERT'],
  },
  {
    area: 'Retrieval-Augmented Generation',
    gap: 'LLMs hallucinate when queried on specialized veterinary drug data without grounding',
    approach: 'Hybrid RAG pipeline with MongoDB Atlas vector store ($vectorSearch) for factual accuracy',
    references: ['Lewis et al. (2020) RAG', 'Gao et al. (2023) RAG Survey', 'Izacard & Grave (2021) FiD'],
  },
  {
    area: 'Minor Species Data Gaps',
    gap: 'Limited pharmacokinetic data for sheep, goats, and exotic species leads to unsafe extra-label use',
    approach: 'Transfer learning from major species models + VMTH clinical record mining',
    references: ['Riviere & Papich (2018) Vet Pharm', 'FARAD Digest Articles', 'AMDUCA Regulations'],
  },
];

const keyMetrics = [
  { metric: 'Publications Target', value: '4-6', unit: 'peer-reviewed papers' },
  { metric: 'Dataset Size', value: '4,884', unit: 'indexed documents' },
  { metric: 'NER Accuracy', value: '94.3%', unit: 'on vet corpus' },
  { metric: 'Species Covered', value: '10+', unit: 'livestock & companion' },
  { metric: 'Data Sources', value: '8', unit: 'integrated sources' },
  { metric: 'Funding', value: 'USDA NIFA', unit: 'FDA CVM grant' },
];

const anticipatedPublications = [
  { title: 'Clinical NLP and Vector Search for Veterinary Antimicrobial Surveillance', venue: 'Journal of the American Veterinary Medical Association (JAVMA)', status: 'In Preparation' },
  { title: 'Real-Time Antimicrobial Usage Monitoring via AI-Powered Web Crawling: The LAMU-AI Platform', venue: 'Preventive Veterinary Medicine', status: 'Planned' },
  { title: 'Bridging Data Gaps in Minor Species: Transfer Learning Approaches for Withdrawal Period Prediction', venue: 'Food and Chemical Toxicology', status: 'Planned' },
  { title: 'RAG-Enhanced Decision Support for Veterinary Antimicrobial Stewardship', venue: 'Computers and Electronics in Agriculture', status: 'Planned' },
];

const skillsApplied = [
  { category: 'Machine Learning', skills: ['Transformer fine-tuning', 'Transfer learning', 'NER/NLP', 'Embedding models', 'Cross-encoder reranking'] },
  { category: 'Data Engineering', skills: ['ETL pipelines', 'Web crawling', 'Data normalization', 'Vector databases', 'API integration'] },
  { category: 'Software Engineering', skills: ['Full-stack development', 'REST APIs', 'React/Next.js', 'Python/FastAPI', 'Cloud deployment'] },
  { category: 'Research Methods', skills: ['Systematic literature review', 'Experimental design', 'Statistical validation', 'Stakeholder engagement', 'Scientific writing'] },
];

export default function ResearchPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Research Methodology (Minimal Version)</h1>
        <p className="text-gray-500 mt-1">Minimal research prototype: project design, timeline, literature context, and expected outcomes</p>
      </div>

      {/* Research Overview */}
      <div className="chart-card bg-gradient-to-br from-blue-50/50 to-purple-50/50 border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Research Statement</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              This minimal research prototype addresses the challenge of fragmented antimicrobial usage data in veterinary medicine by demonstrating <span className="font-semibold text-blue-700">LAMU-AI</span> — an AI-powered platform integrating surveillance data streams. By combining <span className="font-semibold text-purple-700">clinical NLP & entity extraction</span>, <span className="font-semibold text-emerald-700">Retrieval-Augmented Generation</span> (MongoDB Atlas vector search), and <span className="font-semibold text-amber-700">multi-provider LLM pipelines</span>, it showcases real-time surveillance capabilities that empower evidence-based antimicrobial stewardship.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Antimicrobial Resistance</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Natural Language Processing</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Retrieval-Augmented Generation</span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Veterinary Pharmacology</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">One Health</span>
              <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full font-medium">Big Data Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {keyMetrics.map(m => (
          <div key={m.metric} className="stat-card text-center">
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
            <div className="text-xs text-gray-500 mt-1">{m.metric}</div>
            <div className="text-[10px] text-gray-400">{m.unit}</div>
          </div>
        ))}
      </div>

      {/* Literature Context */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Literature Context & Research Gaps</h3>
        <p className="text-sm text-gray-500 mb-6">How LAMU-AI addresses identified gaps in the literature</p>
        <div className="space-y-4">
          {literatureContext.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 font-bold text-sm">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.area}</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Gap Identified</span>
                      <p className="text-sm text-gray-600 mt-1">{item.gap}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Our Approach</span>
                      <p className="text-sm text-gray-600 mt-1">{item.approach}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.references.map(ref => (
                      <span key={ref} className="text-[10px] bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{ref}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Timeline */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Research Timeline</h3>
        <p className="text-sm text-gray-500 mb-6">24-month project plan aligned with USDA NIFA milestones</p>
        <div className="space-y-6">
          {researchTimeline.map((phase, i) => (
            <div key={phase.phase} className="relative">
              <div className="flex gap-4">
                {/* Phase indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm ${
                    phase.status === 'completed' ? 'bg-emerald-500' :
                    phase.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`}>
                    {phase.status === 'completed' ? '✓' : phase.phase.replace('Phase ', '')}
                  </div>
                  {i < researchTimeline.length - 1 && (
                    <div className={`w-0.5 h-full mt-2 min-h-[20px] ${
                      phase.status === 'completed' ? 'bg-emerald-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className={`rounded-xl p-5 border ${
                    phase.status === 'completed' ? 'bg-emerald-50/50 border-emerald-200' :
                    phase.status === 'in-progress' ? 'bg-blue-50/50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{phase.title}</h4>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          phase.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          phase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {phase.status === 'in-progress' ? 'In Progress' : phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{phase.period}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">{phase.aim}</span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Key Tasks</span>
                        <ul className="mt-1.5 space-y-1">
                          {phase.tasks.map((task, j) => (
                            <li key={j} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                phase.status === 'completed' ? 'bg-emerald-400' :
                                phase.status === 'in-progress' ? 'bg-blue-400' :
                                'bg-gray-300'
                              }`} />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Deliverables</span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {phase.deliverables.map((d, j) => (
                            <span key={j} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-lg">{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills + Publications Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Technical Skills Applied */}
        <div className="chart-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Technical Skills Applied</h3>
          <p className="text-sm text-gray-500 mb-4">Interdisciplinary competencies demonstrated in this project</p>
          <div className="space-y-4">
            {skillsApplied.map(cat => (
              <div key={cat.category}>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{cat.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map(skill => (
                    <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anticipated Publications */}
        <div className="chart-card overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Anticipated Publications</h3>
            <p className="text-sm text-gray-500">Target journals and publication timeline</p>
          </div>
          <div className="divide-y divide-gray-50">
            {anticipatedPublications.map((pub, i) => (
              <div key={i} className="px-6 py-4 hover:bg-blue-50/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{pub.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{pub.venue}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    pub.status === 'In Preparation' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {pub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Impact */}
      <div className="chart-card bg-gradient-to-br from-emerald-50/50 to-cyan-50/50 border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Research Impact</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
              <span className="text-xl">🏥</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Clinical Impact</h4>
            <p className="text-xs text-gray-600">Enable evidence-based antimicrobial prescribing by providing veterinarians with real-time usage data and withdrawal period guidance, reducing residue violations and supporting One Health initiatives.</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <span className="text-xl">🔬</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Scientific Contribution</h4>
            <p className="text-xs text-gray-600">Minimal research implementation of clinical NER, hybrid RAG architecture (MongoDB Atlas vector search), and multi-provider LLM pipelines with zero-key extractive fallback.</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
              <span className="text-xl">📊</span>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Policy Impact</h4>
            <p className="text-xs text-gray-600">Provide regulatory agencies (FDA, USDA) with scalable surveillance tools for monitoring antimicrobial usage trends, informing policy decisions on drug approvals and resistance mitigation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
