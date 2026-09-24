# LAMU-AI: Long-term Antimicrobial Use with AI & MongoDB Vector Search

> A replication and extension of the USDA NIFA / FDA CVM research initiative between the **Food Animal Residue Avoidance Databank (FARAD)** and the **1DATA Consortium**, engineered with **Python FastAPI**, **MongoDB Atlas Vector Search**, and **Next.js 14**.

---

## 🔬 Research Context & Objectives

- **AIM 1**: Extract and analyze antimicrobial use data for major livestock (cattle, swine) and poultry species (broilers, layers, turkeys).
- **AIM 2**: Extend data extraction to minor species (sheep, goats) and companion animals (dogs, cats, horses), addressing critical pharmacokinetic data lacunae.
- **Core Technology**: Domain-specific fine-tuned transformer (**LAMU-VetBERT**), **MongoDB Atlas Vector Search** (`$vectorSearch` aggregation), and a 7-stage **Retrieval-Augmented Generation (RAG)** pipeline.

---

## 🏗️ System Architecture

```
                          ┌────────────────────────────────────────────────────────┐
                          │               Next.js 14 Frontend UI                   │
                          │                 http://localhost:3000                  │
                          │   • Real-Time Query UI (RAG + Tokens + Chunks)         │
                          │   • Live Clinical NER Text Analyzer                    │
                          │   • MongoDB $vectorSearch Aggregation Inspector        │
                          │   • Data Explorer & Web Crawler                        │
                          └───────────────────────────┬────────────────────────────┘
                                                      │ REST JSON API
                                                      ▼
                          ┌────────────────────────────────────────────────────────┐
                          │               Python FastAPI Backend                   │
                          │                http://127.0.0.1:8000                   │
                          │             Interactive Docs: /docs                    │
                          └──────┬────────────────────┼────────────────────┬───────┘
                                 │                    │                    │
                   ┌─────────────▼────┐       ┌───────▼───────────┐      ┌─▼──────────────────┐
                   │   NER Pipeline   │       │   RAG Pipeline    │      │ MongoDB Vector DB  │
                   │  (LAMU-VetBERT)  │       │  (7-Stage Engine) │      │  ($vectorSearch)   │
                   │ • Drug, Species, │       │ • Query Analysis  │      │ • HNSW Index       │
                   │   Dosage, Route, │       │ • Reranking (MMR) │      │ • 768-dim Vectors  │
                   │   Duration, Org  │       │ • Grounded Answer │      │ • Cosine Metric    │
                   └──────────────────┘       └───────────────────┘      └────────────────────┘
```

---

## 🍃 MongoDB Vector Database Integration

LAMU-AI utilizes **MongoDB Atlas Vector Search** to store and query 768-dimensional dense vector embeddings alongside structured veterinary clinical metadata:

### Vector Index Definition
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
      { "type": "filter", "path": "species" },
      { "type": "filter", "path": "source" },
      { "type": "filter", "path": "drug_class" }
    ]
  }
}
```

### Live Aggregation Pipeline Executed (`POST /api/vector-store/search`)
```json
[
  {
    "$vectorSearch": {
      "index": "vector_index_vetbert",
      "path": "embedding",
      "queryVector": [0.038, -0.012, 0.081, "... 768 total dimensions ..."],
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
      "species": 1,
      "drug_class": 1,
      "score": { "$meta": "vectorSearchScore" }
    }
  }
]
```

---

## 🚀 Running the Project

Both servers run concurrently:

```bash
# 1. Start Python FastAPI Backend (Port 8000)
cd ~/Desktop/minimal-hande
PYTHONPATH=backend ./venv/bin/python3 -m uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000

# 2. Start Next.js Frontend (Port 3000)
cd ~/Desktop/minimal-hande
npm run dev
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Interactive Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **MongoDB Vector Store Status**: [http://127.0.0.1:8000/api/vector-store/status](http://127.0.0.1:8000/api/vector-store/status)

