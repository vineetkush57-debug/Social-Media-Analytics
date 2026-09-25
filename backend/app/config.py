import os
from typing import Dict, Any

from pathlib import Path

try:
    from dotenv import load_dotenv
    base_dir = Path(__file__).resolve().parent.parent.parent
    load_dotenv(base_dir / ".env")
    load_dotenv(base_dir / "backend" / ".env")
    load_dotenv()
except Exception:
    pass

X_BEARER_TOKEN = os.getenv("X_BEARER_TOKEN") or os.getenv("TWITTER_BEARER_TOKEN") or ""
INSTAGRAM_ACCESS_TOKEN = os.getenv("INSTAGRAM_ACCESS_TOKEN") or ""
TELEGRAM_API_ID = os.getenv("TELEGRAM_API_ID") or ""
TELEGRAM_API_HASH = os.getenv("TELEGRAM_API_HASH") or os.getenv("TELEGRAM_BOT_TOKEN") or ""
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or ""

DUMMY_PLACEHOLDERS = [
    "your_x_bearer_token_here",
    "your_twitter_bearer_token_here",
    "your_instagram_access_token_here",
    "your_telegram_api_id_here",
    "your_telegram_api_hash_here",
    "your_openai_api_key_here",
    "xxxx"
]

def is_valid_key(key: str) -> bool:
    if not key or not isinstance(key, str):
        return False
    k_clean = key.strip()
    if not k_clean or len(k_clean) < 4:
        return False
    k_lower = k_clean.lower()
    if any(placeholder in k_lower for placeholder in DUMMY_PLACEHOLDERS):
        return False
    if k_lower in ["dummy", "placeholder", "test", "sample"]:
        return False
    return True

def get_system_mode_status() -> Dict[str, Any]:
    has_x = is_valid_key(X_BEARER_TOKEN)
    has_insta = is_valid_key(INSTAGRAM_ACCESS_TOKEN)
    has_telegram = is_valid_key(TELEGRAM_API_ID) or is_valid_key(TELEGRAM_API_HASH)
    has_openai = is_valid_key(OPENAI_API_KEY)

    active_sources = []
    if has_x:
        active_sources.append("X (Twitter) API v2")
    if has_insta:
        active_sources.append("Instagram Graph API")
    if has_telegram:
        active_sources.append("Telegram Live Channel Client")

    if active_sources:
        mode_label = "LIVE API MODE"
    else:
        mode_label = "DEMO MODE / SIMULATED DATA"
        active_sources = ["Simulated Demo Telemetry Engine"]

    return {
        "mode": mode_label,
        "has_x_api": has_x,
        "has_instagram_api": has_insta,
        "has_telegram_api": has_telegram,
        "has_openai_api": has_openai,
        "active_sources": active_sources,
        "x_token_preview": f"{X_BEARER_TOKEN[:6]}...{X_BEARER_TOKEN[-4:]}" if has_x else None,
        "insta_token_preview": f"{INSTAGRAM_ACCESS_TOKEN[:6]}...{INSTAGRAM_ACCESS_TOKEN[-4:]}" if has_insta else None,
        "telegram_id_preview": f"{TELEGRAM_API_ID[:4]}..." if has_telegram else None
    }

