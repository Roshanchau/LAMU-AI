import os
import time
from pathlib import Path
from dotenv import load_dotenv
import pymongo
import numpy as np
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

# Load environment variables
load_dotenv(Path(__file__).resolve().parent / ".env")
load_dotenv()

from knowledge import flatten_chunks
from embeddings import generate_embedding
from ner_pipeline import extract_entities

class MongoDBVectorStore:
    def __init__(self):
        self.db_name = os.environ.get("MONGODB_DATABASE", "minimal-hande-db")
        self.collection_name = os.environ.get("MONGODB_COLLECTION", "antimicrobial_vectors")
        self.index_name = "vector_index_vetbert"
        self.dimensions = 768
        self.similarity = "cosine"
        self.engine = "in-memory"
        self.connected_to_atlas = False
        self.client = None
        self.db = None
        self.collection = None
        
        # In-memory fallback
        self.in_memory_docs = []
        self.reconnect(os.environ.get("MONGODB_URI"))
        self._initialize_store()

    def reconnect(self, uri: str | None = None) -> bool:
        """Attempt connecting to MongoDB Atlas with the given URI."""
        mongo_uri = uri or os.environ.get("MONGODB_URI", "")
        if not mongo_uri.strip():
            self.client = None
            self.db = None
            self.collection = None
            self.connected_to_atlas = False
            self.engine = "in-memory"
            return False

        try:
            client = pymongo.MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            client.admin.command('ping')
            self.client = client

            # Auto-detect target database from connection URI if present
            target_db = os.environ.get("MONGODB_DATABASE", "").strip()
            if not target_db:
                try:
                    default_db = client.get_default_database()
                    if default_db is not None and default_db.name:
                        target_db = default_db.name
                except Exception:
                    pass
            if not target_db:
                target_db = "minimal-hande-db"
            self.db_name = target_db
            self.db = self.client[self.db_name]

            # Auto-detect target collection
            target_coll = os.environ.get("MONGODB_COLLECTION", "").strip()
            if not target_coll:
                existing_colls = self.db.list_collection_names()
                if "antimicrobial_vectors" in existing_colls:
                    target_coll = "antimicrobial_vectors"
                elif "vector_store" in existing_colls:
                    target_coll = "vector_store"
                else:
                    target_coll = "antimicrobial_vectors"
            self.collection_name = target_coll
            self.collection = self.db[self.collection_name]
            self.connected_to_atlas = True
            self.engine = "mongodb"
            return True
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            print(f"MongoDB connection notice: {e}. Falling back to in-memory vector store.")
            self.client = None
            self.db = None
            self.collection = None
            self.connected_to_atlas = False
            self.engine = "in-memory"
            return False

    def _initialize_store(self):
        chunks = flatten_chunks()
        for doc in chunks:
            species = None
            drug_class = None
            entities, _ = extract_entities(doc["content"])
            for e in entities:
                if e.label.value == "SPECIES" and species is None:
                    species = e.text
                if e.label.value == "DRUG" and drug_class is None:
                    drug_class = e.text
            
            self.insert_vector(
                chunk_id=doc["chunk_id"],
                title=doc["document_title"],
                source=doc["source"],
                content=doc["content"],
                species=species,
                drug_class=drug_class
            )
            
    def insert_vector(self, chunk_id: str, title: str, source: str, content: str, species: str | None, drug_class: str | None) -> dict:
        emb = generate_embedding(content)
        doc = {
            "chunk_id": chunk_id,
            "document_title": title,
            "source": source,
            "content": content,
            "species": species,
            "drug_class": drug_class,
            "embedding": emb,
            "updated_at": time.time()
        }
        # Maintain in-memory docs
        idx = next((i for i, d in enumerate(self.in_memory_docs) if d["chunk_id"] == chunk_id), None)
        if idx is not None:
            self.in_memory_docs[idx] = doc
        else:
            self.in_memory_docs.append(doc)

        atlas_mutated = False
        if self.connected_to_atlas and self.collection is not None:
            try:
                self.collection.update_one({"chunk_id": chunk_id}, {"$set": doc}, upsert=True)
                atlas_mutated = True
            except Exception as e:
                print(f"MongoDB Atlas insert warning ({e}); saved in local memory store.")

        total_count = len(self.in_memory_docs)
        if self.connected_to_atlas and self.collection is not None:
            try:
                total_count = self.collection.count_documents({})
            except Exception:
                pass

        return {
            "chunk_id": chunk_id,
            "atlas_mutated": atlas_mutated,
            "database": self.db_name,
            "collection": self.collection_name,
            "total_vectors": total_count
        }

    def status(self) -> dict:
        total = len(self.in_memory_docs)
        if self.connected_to_atlas and self.collection is not None:
            try:
                total = self.collection.count_documents({})
            except Exception:
                pass

        index_spec = {
            "name": self.index_name,
            "type": "vectorSearch",
            "definition": {
                "fields": [
                    {"type": "vector", "path": "embedding", "numDimensions": self.dimensions, "similarity": self.similarity}
                ]
            }
        }
        return {
            "database": self.db_name,
            "collection": self.collection_name,
            "index_name": self.index_name,
            "dimensions": self.dimensions,
            "similarity": self.similarity,
            "total_vectors": total,
            "connected_to_atlas": self.connected_to_atlas,
            "engine": self.engine,
            "index_spec": index_spec
        }

    def search(self, query_text: str, limit: int = 5, species_filter: str | None = None, source_filter: str | None = None) -> dict:
        query_vector = generate_embedding(query_text)
        
        filter_doc = {}
        if species_filter:
            filter_doc["species"] = species_filter
        if source_filter:
            filter_doc["source"] = source_filter

        pipeline = []
        search_stage = {
            "$vectorSearch": {
                "index": self.index_name,
                "path": "embedding",
                "queryVector": query_vector if self.connected_to_atlas else "[...]",
                "numCandidates": limit * 10,
                "limit": limit
            }
        }
        if filter_doc:
            search_stage["$vectorSearch"]["filter"] = filter_doc
            
        pipeline.append(search_stage)
        pipeline.append({
            "$project": {
                "_id": 0,
                "chunk_id": 1,
                "document_title": 1,
                "source": 1,
                "content": 1,
                "species": 1,
                "drug_class": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        })
        
        hits = []
        if self.connected_to_atlas and self.collection is not None:
            try:
                # Re-inject the actual query vector for execution
                search_stage["$vectorSearch"]["queryVector"] = query_vector
                cursor = self.collection.aggregate(pipeline)
                hits = list(cursor)
            except Exception as e:
                print(f"MongoDB Atlas $vectorSearch aggregate error ({e}); using vector memory fallback.")
                hits = []

        # If Atlas search returned 0 hits (e.g. index not created or empty), fall back to in-memory cosine similarity
        if not hits:
            results = []
            q_emb = np.array(query_vector)
            for d in self.in_memory_docs:
                if species_filter and d.get("species") != species_filter:
                    continue
                if source_filter and d.get("source") != source_filter:
                    continue
                
                d_emb = np.array(d["embedding"])
                norm_q = np.linalg.norm(q_emb)
                norm_d = np.linalg.norm(d_emb)
                score = np.dot(q_emb, d_emb) / (norm_q * norm_d) if norm_q > 0 and norm_d > 0 else 0.0
                results.append({
                    "chunk_id": d["chunk_id"],
                    "document_title": d["document_title"],
                    "source": d["source"],
                    "content": d["content"],
                    "species": d.get("species"),
                    "drug_class": d.get("drug_class"),
                    "score": float(score)
                })
            results.sort(key=lambda x: x["score"], reverse=True)
            hits = results[:limit]

        return {
            "hits": hits,
            "pipeline": pipeline
        }

vector_store_instance = MongoDBVectorStore()
