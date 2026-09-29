from pathlib import Path

readme = r"""# LAMU-AI

### Long-term Antimicrobial Use with AI & MongoDB Vector Search

> A minimal AI prototype for veterinary medicine that combines clinical entity recognition, hybrid vector retrieval, Retrieval-Augmented Generation (RAG), and multi-provider LLM generation to retrieve and synthesize antimicrobial-use information.

LAMU-AI is a research-oriented prototype inspired by the USDA NIFA / FDA CVM research initiative involving the Food Animal Residue Avoidance Databank (FARAD) and the 1DATA Consortium. The system explores how domain-specific NLP, vector search, and LLM-based generation can help bridge data gaps in veterinary antimicrobial-use research.

**Live Demo:** https://lamu-ai.vercel.app

---

## 🔬 Research Objectives

LAMU-AI is designed around two primary research directions:

- **AIM 1:** Extract and analyze antimicrobial-use information for major livestock and poultry species, including cattle, swine, broilers, layers, and turkeys.
- **AIM 2:** Extend information extraction toward minor and companion species such as sheep, goats, dogs, cats, and horses, addressing gaps in available veterinary pharmacokinetic and antimicrobial-use information.

The prototype focuses on making heterogeneous veterinary information searchable and usable through semantic retrieval and grounded language-model responses.

---

## ✨ Key Features

- **Clinical Entity Recognition** using a domain-specific veterinary NLP model.
- **Semantic Vector Search** using MongoDB Atlas Vector Search.
- **Metadata Filtering** by species, source, and drug class.
- **Retrieval-Augmented Generation (RAG)** for grounded responses.
- **MMR-based reranking** to improve retrieval diversity.
- **Multi-provider LLM generation** with support for multiple inference providers.
- **Real-time RAG inspection** of retrieved chunks and generated responses.
- **Clinical NER analyzer** for extracting veterinary entities from text.
- **Vector-store inspector** for testing MongoDB `$vectorSearch` queries.
- **Data explorer and web-crawling workflow** for collecting and inspecting source information.
- **FastAPI interactive documentation** for backend API exploration.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────────────────────┐
                         │          Next.js Frontend            │
                         │                                      │
                         │  • RAG Query Interface               │
                         │  • Clinical NER Analyzer             │
                         │  • Vector Search Inspector           │
                         │  • Data Explorer / Crawler            │
                         └───────────────────┬──────────────────┘
                                             │
                                      REST / JSON API
                                             │
                         ┌───────────────────▼──────────────────┐
                         │          FastAPI Backend              │
                         │                                      │
                         │  • Query Processing                  │
                         │  • NER Pipeline                      │
                         │  • RAG Pipeline                      │
                         │  • Vector Store API                  │
                         └───────────┬───────────────┬──────────┘
                                     │               │
                      ┌──────────────▼─────┐   ┌────▼─────────────────┐
                      │ Veterinary NER     │   │ MongoDB Atlas         │
                      │                    │   │ Vector Search         │
                      │ LAMU-VetBERT       │   │                      │
                      │                    │   │ • HNSW index          │
                      │ • Drug             │   │ • 768-dim vectors     │
                      │ • Species          │   │ • Cosine similarity   │
                      │ • Dosage           │   │ • Metadata filters    │
                      │ • Route            │   │                      │
                      │ • Duration         │   └──────────┬───────────┘
                      │ • Organization     │              │
                      └────────────────────┘              │
                                                          │
                                              ┌───────────▼───────────┐
                                              │     RAG Pipeline      │
                                              │                       │
                                              │  Query Analysis       │
                                              │       ↓               │
                                              │  Vector Retrieval     │
                                              │       ↓               │
                                              │  Metadata Filtering   │
                                              │       ↓               │
                                              │  MMR Reranking        │
                                              │       ↓               │
                                              │  Context Assembly     │
                                              │       ↓               │
                                              │  LLM Generation       │
                                              │       ↓               │
                                              │  Grounded Response    │
                                              └───────────────────────┘
```

---

## 🧠 Retrieval & RAG Pipeline

The prototype uses a multi-stage retrieval workflow:

```text
User Query
    │
    ▼
Query Analysis
    │
    ├── Clinical Entity Extraction
    │       ├── Drug
    │       ├── Species
    │       ├── Dosage
    │       ├── Route
    │       └── Duration
    │
    ▼
Query Embedding
    │
    ▼
MongoDB Atlas Vector Search
    │
    ├── Semantic similarity
    ├── Species filtering
    ├── Source filtering
    └── Drug-class filtering
    │
    ▼
Candidate Retrieval
    │
    ▼
MMR Reranking
    │
    ▼
Context Assembly
    │
    ▼
LLM Generation
    │
    ▼
Grounded Veterinary Response
```

The retrieval layer is designed to combine semantic similarity with structured veterinary metadata. This allows a query to retrieve relevant information while narrowing results by attributes such as species or drug class.

---

## 🧬 Clinical Entity Recognition

LAMU-AI includes a domain-specific veterinary NER pipeline based around **LAMU-VetBERT**.

The system is designed to identify entities such as:

| Entity | Example |
|---|---|
| Drug | Amoxicillin |
| Species | Cattle |
| Dosage | 10 mg/kg |
| Route | Intramuscular |
| Duration | 5 days |
| Organization / Source | Veterinary research source |

Extracted entities can be used to improve query understanding and support structured filtering during retrieval.

---

## 🍃 MongoDB Atlas Vector Search

LAMU-AI stores dense embeddings together with structured veterinary metadata in MongoDB Atlas.

The current vector configuration uses:

- **Embedding dimensions:** 768
- **Similarity metric:** Cosine
- **Index type:** MongoDB Vector Search
- **Approximate search:** HNSW-based indexing
- **Metadata filters:** Species, source, drug class

### Example Vector Index

```json
{
  "name": "vector_index_vetbert",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      {
        "type": "vector",
        "path": "embedding",
        "numDimensions": 768,
        "similarity": "cosine"
      },
      {
        "type": "filter",
        "path": "species"
      },
      {
        "type": "filter",
        "path": "source"
      },
      {
        "type": "filter",
        "path": "drug_class"
      }
    ]
  }
}
```

### Example `$vectorSearch` Query

```javascript
[
  {
    $vectorSearch: {
      index: "vector_index_vetbert",
      path: "embedding",
      queryVector: [/* 768-dimensional embedding */],
      numCandidates: 50,
      limit: 5,
      filter: {
        species: "Cattle"
      }
    }
  },
  {
    $project: {
      _id: 0,
      chunk_id: 1,
      document_title: 1,
      source: 1,
      content: 1,
      species: 1,
      drug_class: 1,
      score: {
        $meta: "vectorSearchScore"
      }
    }
  }
]
```

---

## 🛠️ Technology Stack

### Frontend

- Next.js 14
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn

### AI / NLP

- Domain-specific veterinary transformer models
- Clinical Named Entity Recognition
- Text embeddings
- Retrieval-Augmented Generation
- MMR reranking
- Multi-provider LLM generation

### Data & Retrieval

- MongoDB Atlas
- MongoDB Vector Search
- HNSW approximate nearest-neighbor search
- Cosine similarity
- Structured metadata filtering

---

## 📁 Project Structure

```text
LAMU-AI/
├── backend/                 # FastAPI backend and AI/RAG services
├── src/                     # Next.js frontend
├── .agents/                 # Agent/skill configuration
├── .cursor/                 # Cursor agent configuration
├── .env.example             # Environment variable template
├── next.config.js
├── package.json
├── patch_main.py
├── patch_rag.py
├── run.sh
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Roshanchau/LAMU-AI.git
cd LAMU-AI
```

### 2. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then configure the required MongoDB, embedding, and LLM provider credentials in `.env`.

> Do not commit API keys or other secrets to the repository.

### 3. Set up the Python environment

Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

If the repository uses a different dependency installation workflow, follow the dependency files included under `backend/`.

### 4. Install frontend dependencies

```bash
npm install
```

### 5. Start the FastAPI backend

From the repository root:

```bash
PYTHONPATH=backend ./venv/bin/python3 -m uvicorn main:app \
  --app-dir backend \
  --host 127.0.0.1 \
  --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Start the Next.js frontend

In another terminal:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## 🔌 API Endpoints

The backend exposes APIs for the main AI and retrieval workflows.

### Vector Search

```text
POST /api/vector-store/search
```

Searches the MongoDB Atlas vector store using an embedding and optional metadata filters.

### Vector Store Status

```text
GET /api/vector-store/status
```

Returns the current vector-store status.

### Interactive API Documentation

```text
GET /docs
```

FastAPI automatically provides interactive Swagger documentation.

> Check the FastAPI `/docs` interface for the current complete endpoint list, request schemas, and response schemas.

---

## 🔍 Example Use Case

A user could ask a question such as:

```text
What antimicrobial-use information is available for cattle
in relation to a specific drug class?
```

The system can then:

1. Analyze the query.
2. Extract relevant veterinary entities.
3. Generate a semantic representation of the query.
4. Search the MongoDB vector index.
5. Apply structured metadata filters.
6. Rerank retrieved candidates.
7. Assemble relevant context.
8. Pass the retrieved context to an LLM.
9. Generate a grounded response based on the retrieved evidence.

---

## 🎯 Why This Architecture?

Traditional keyword search can struggle with veterinary literature because the same clinical concept can be expressed using different terminology.

LAMU-AI explores a combination of:

```text
Structured Clinical Information
            +
Semantic Retrieval
            +
Metadata Filtering
            +
Reranking
            +
LLM Generation
```

This architecture provides a foundation for investigating how domain-specific retrieval can improve access to heterogeneous antimicrobial-use information while keeping generated answers grounded in retrieved source material.

---

## 🧪 Research & Extension Opportunities

Potential directions for further development include:

- Fine-tuning and evaluating veterinary-domain embedding models.
- Comparing generic embeddings against domain-specific embeddings.
- Evaluating retrieval using Recall@K, MRR, nDCG, and Precision@K.
- Measuring the effect of metadata filtering on retrieval quality.
- Comparing vector-only, keyword-only, and hybrid retrieval.
- Evaluating different reranking strategies.
- Adding citation-aware RAG responses.
- Expanding coverage to additional animal species.
- Building structured antimicrobial-use datasets.
- Evaluating LLM responses for factuality and grounding.
- Adding human/expert evaluation from veterinary practitioners.
- Studying retrieval latency and scalability under larger collections.

---

## 📊 Evaluation Framework

A future evaluation setup can measure the system at multiple levels:

### Retrieval

```text
Recall@K
MRR
nDCG@K
Precision@K
```

### Generation

```text
Faithfulness
Answer relevance
Context relevance
Citation accuracy
```

### System Performance

```text
Query latency
Embedding latency
Vector-search latency
Reranking latency
LLM generation latency
```

This separation makes it possible to determine whether improvements come from retrieval, reranking, or generation rather than evaluating the entire pipeline as a single black box.

---

## ⚠️ Research Prototype Disclaimer

LAMU-AI is a research and engineering prototype for information retrieval and AI-assisted exploration of veterinary antimicrobial-use information.

It is **not a veterinary diagnostic system, treatment recommendation system, or substitute for professional veterinary judgment**.

Retrieved information should be independently verified against authoritative veterinary sources before being used for clinical, regulatory, or treatment decisions.

---

## 📚 Related Research Context

The project is motivated by research into antimicrobial-use data extraction and information gaps across animal species.

The system specifically explores the intersection of:

- Veterinary NLP
- Information Retrieval
- Vector Databases
- Retrieval-Augmented Generation
- Domain-specific Language Models
- Clinical Entity Recognition
- LLM-based Information Synthesis

---

## 👨‍💻 Author

**Roshan Chaudhary**

- GitHub: https://github.com/Roshanchau

---

## 📄 License

See the repository for the applicable license and usage terms.
"""

path = Path("/mnt/data/README.md")
path.write_text(readme, encoding="utf-8")
print(path)
