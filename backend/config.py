"""Configuration and presets for LLM providers and database connections.

Supports dedicated environment variables per provider:
- Groq: GROQ_API_KEY, GROQ_MODEL, GROQ_BASE_URL
- Google Gemini: GEMINI_API_KEY, GEMINI_MODEL, GEMINI_BASE_URL
- OpenRouter: OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_BASE_URL
- Cerebras: CEREBRAS_API_KEY, CEREBRAS_MODEL, CEREBRAS_BASE_URL
- OpenAI: OPENAI_API_KEY, OPENAI_MODEL, OPENAI_BASE_URL
- Ollama: OLLAMA_BASE_URL, OLLAMA_MODEL
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")
load_dotenv()

LLM_PROVIDERS = {
    "groq": {
        "id": "groq",
        "name": "Groq",
        "badge": "Free & Ultra-Fast",
        "env_key": "GROQ_API_KEY",
        "env_model": "GROQ_MODEL",
        "env_base_url": "GROQ_BASE_URL",
        "default_base_url": "https://api.groq.com/openai/v1",
        "default_model": "llama-3.1-8b-instant",
        "models": [
            {"id": "llama-3.1-8b-instant", "name": "Llama 3.1 8B Instant", "desc": "Universal Free Tier, ~560 tok/s, 128k context"},
            {"id": "llama-3.3-70b-versatile", "name": "Llama 3.3 70B Versatile", "desc": "70B high reasoning (tier dependent)"},
            {"id": "llama3-70b-8192", "name": "Llama 3 70B (8192)", "desc": "Meta Llama 3 70B flagship"},
            {"id": "llama3-8b-8192", "name": "Llama 3 8B (8192)", "desc": "Meta Llama 3 8B fast"},
            {"id": "mixtral-8x7b-32768", "name": "Mixtral 8x7B 32k", "desc": "MoE architecture, balanced reasoning"},
            {"id": "gemma2-9b-it", "name": "Gemma 2 9B IT", "desc": "Google Gemma 2 on Groq LPU"},
        ],
        "key_prefix": "gsk_",
        "key_hint": "gsk_...",
        "signup_url": "https://console.groq.com/keys",
        "free_tier_info": "Universal free tier with high rate limits (~560 tok/s on llama-3.1-8b-instant).",
    },
    "gemini": {
        "id": "gemini",
        "name": "Google Gemini",
        "badge": "Free AI Studio",
        "env_key": "GEMINI_API_KEY",
        "env_model": "GEMINI_MODEL",
        "env_base_url": "GEMINI_BASE_URL",
        "default_base_url": "https://generativelanguage.googleapis.com/v1beta/openai/",
        "default_model": "gemini-1.5-flash",
        "models": [
            {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash", "desc": "Fast, 1M token context, veterinary pharmacology"},
            {"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash", "desc": "Next-generation multimodal reasoning"},
        ],
        "key_prefix": "AIza",
        "key_hint": "AIzaSy...",
        "signup_url": "https://aistudio.google.com/app/apikey",
        "free_tier_info": "Free tier on Google AI Studio via official OpenAI-compatible endpoint.",
    },
    "openrouter": {
        "id": "openrouter",
        "name": "OpenRouter",
        "badge": "100% Free Models",
        "env_key": "OPENROUTER_API_KEY",
        "env_model": "OPENROUTER_MODEL",
        "env_base_url": "OPENROUTER_BASE_URL",
        "default_base_url": "https://openrouter.ai/api/v1",
        "default_model": "meta-llama/llama-3.3-70b-instruct:free",
        "models": [
            {"id": "meta-llama/llama-3.3-70b-instruct:free", "name": "Llama 3.3 70B (:free)", "desc": "Flagship 70B parameter open weights, 100% free"},
            {"id": "deepseek/deepseek-r1:free", "name": "DeepSeek R1 (:free)", "desc": "Chain-of-thought clinical reasoning, free"},
            {"id": "mistralai/mistral-7b-instruct:free", "name": "Mistral 7B (:free)", "desc": "Compact biomedical instructions, free"},
        ],
        "key_prefix": "sk-or-",
        "key_hint": "sk-or-v1-...",
        "signup_url": "https://openrouter.ai/keys",
        "free_tier_info": "Unified gateway with access to verified community free models (:free).",
    },
    "cerebras": {
        "id": "cerebras",
        "name": "Cerebras",
        "badge": "Free Wafer Inference",
        "env_key": "CEREBRAS_API_KEY",
        "env_model": "CEREBRAS_MODEL",
        "env_base_url": "CEREBRAS_BASE_URL",
        "default_base_url": "https://api.cerebras.ai/v1",
        "default_model": "llama3.1-8b",
        "models": [
            {"id": "llama3.1-8b", "name": "Llama 3.1 8B", "desc": "Wafer-scale hardware inference ~1800 tokens/sec"},
            {"id": "llama-3.3-70b", "name": "Llama 3.3 70B", "desc": "High capacity 70B on Cerebras CS-3 system"},
        ],
        "key_prefix": "csk-",
        "key_hint": "csk-...",
        "signup_url": "https://cloud.cerebras.ai",
        "free_tier_info": "Free tier with ultra-fast inference speeds.",
    },
    "openai": {
        "id": "openai",
        "name": "OpenAI",
        "badge": "Commercial",
        "env_key": "OPENAI_API_KEY",
        "env_model": "OPENAI_MODEL",
        "env_base_url": "OPENAI_BASE_URL",
        "default_base_url": "https://api.openai.com/v1",
        "default_model": "gpt-4o-mini",
        "models": [
            {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "desc": "Cost-effective multimodal"},
            {"id": "gpt-4o", "name": "GPT-4o", "desc": "Full flagship model"},
        ],
        "key_prefix": "sk-",
        "key_hint": "sk-proj-...",
        "signup_url": "https://platform.openai.com/api-keys",
        "free_tier_info": "Paid OpenAI API account required.",
    },
    "ollama": {
        "id": "ollama",
        "name": "Ollama (Local)",
        "badge": "100% Offline / Free",
        "env_key": None,
        "env_model": "OLLAMA_MODEL",
        "env_base_url": "OLLAMA_BASE_URL",
        "default_base_url": "http://localhost:11434/v1",
        "default_model": "llama3.2",
        "models": [
            {"id": "llama3.2", "name": "Llama 3.2 (3B)", "desc": "Local lightweight model"},
            {"id": "llama3.1:8b", "name": "Llama 3.1 (8B)", "desc": "Local standard weights"},
        ],
        "key_prefix": "ollama",
        "key_hint": "No key required",
        "signup_url": "https://ollama.ai",
        "free_tier_info": "Zero internet needed, runs locally on macOS/Linux.",
    },
    "default": {
        "id": "default",
        "name": "Default Response",
        "badge": "Vector Extractive",
        "env_key": None,
        "env_model": None,
        "env_base_url": None,
        "default_base_url": "",
        "default_model": "Default Knowledge Response",
        "models": [
            {"id": "Default Knowledge Response", "name": "Default Extractive Synthesis", "desc": "Grounded answer synthesized from retrieved MongoDB vector store chunks without external LLM API"},
        ],
        "key_prefix": "",
        "key_hint": "No API key required",
        "signup_url": "",
        "free_tier_info": "Grounded answer directly synthesized from retrieved MongoDB vector store chunks.",
    },
}


def get_active_provider() -> str:
    """Return the currently selected provider."""
    prov = os.getenv("LLM_PROVIDER", "").strip().lower()
    if prov in LLM_PROVIDERS:
        return prov

    # Auto-detect from configured provider-specific keys
    for pid in ["groq", "gemini", "openrouter", "cerebras", "openai"]:
        pdata = LLM_PROVIDERS[pid]
        if os.getenv(pdata["env_key"], "").strip():
            return pid

    return "groq"


def get_provider_api_key(provider: str) -> str | None:
    """Return API key for a specific provider."""
    pdata = LLM_PROVIDERS.get(provider.lower())
    if not pdata:
        return None
    if pdata["env_key"]:
        key = os.getenv(pdata["env_key"], "").strip()
        if key:
            return key
    # Fallback to general OPENAI_API_KEY if provider is openai
    if provider.lower() == "openai":
        key = os.getenv("OPENAI_API_KEY", "").strip()
        return key or None
    return None


def get_provider_base_url(provider: str) -> str:
    """Return base URL for a specific provider."""
    pdata = LLM_PROVIDERS.get(provider.lower(), LLM_PROVIDERS["groq"])
    if pdata.get("env_base_url"):
        url = os.getenv(pdata["env_base_url"], "").strip()
        if url:
            return url.rstrip("/")
    return pdata["default_base_url"].rstrip("/")


def get_provider_model(provider: str) -> str:
    """Return configured or default model for a specific provider."""
    pdata = LLM_PROVIDERS.get(provider.lower(), LLM_PROVIDERS["groq"])
    if pdata.get("env_model"):
        m = os.getenv(pdata["env_model"], "").strip()
        if m:
            return m
    return pdata["default_model"]


def set_provider_config(
    provider: str,
    api_key: str | None = None,
    model: str | None = None,
    base_url: str | None = None,
) -> None:
    """Set environment variables for a specific provider."""
    prov_id = provider.lower()
    if prov_id not in LLM_PROVIDERS:
        return
    pdata = LLM_PROVIDERS[prov_id]
    os.environ["LLM_PROVIDER"] = prov_id

    if api_key is not None and pdata["env_key"]:
        os.environ[pdata["env_key"]] = api_key.strip()
        # Also sync to OPENAI_API_KEY if openai
        if prov_id == "openai":
            os.environ["OPENAI_API_KEY"] = api_key.strip()

    if model is not None and pdata["env_model"]:
        os.environ[pdata["env_model"]] = model.strip()

    if base_url is not None and pdata["env_base_url"]:
        os.environ[pdata["env_base_url"]] = base_url.strip()


def get_llm_timeout() -> float:
    try:
        return float(os.getenv("LLM_TIMEOUT_SECONDS", os.getenv("OPENAI_TIMEOUT_SECONDS", "25")))
    except ValueError:
        return 25.0


def is_provider_available(provider: str) -> bool:
    if provider.lower() in ("ollama", "default"):
        return True
    return bool(get_provider_api_key(provider))


# Backward compatibility helpers
def openai_api_key() -> str | None:
    return get_provider_api_key(get_active_provider())


def openai_base_url() -> str:
    return get_provider_base_url(get_active_provider())


def openai_model() -> str:
    return get_provider_model(get_active_provider())


def openai_timeout() -> float:
    return get_llm_timeout()


def llm_available() -> bool:
    return is_provider_available(get_active_provider())
