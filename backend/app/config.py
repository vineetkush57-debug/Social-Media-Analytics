import os
from typing import Dict, Any

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

X_BEARER_TOKEN = os.getenv("X_BEARER_TOKEN") or os.getenv("TWITTER_BEARER_TOKEN") or ""
INSTAGRAM_ACCESS_TOKEN = os.getenv("INSTAGRAM_ACCESS_TOKEN") or ""
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or ""

DUMMY_PLACEHOLDERS = [
    "your_x_bearer_token_here",
    "your_twitter_bearer_token_here",
    "your_instagram_access_token_here",
    "your_openai_api_key_here",
    "xxxx",
    "12345"
]

def is_valid_key(key: str) -> bool:
    if not key or not isinstance(key, str):
        return False
    k_clean = key.strip().lower()
    if not k_clean or len(k_clean) < 8:
        return False
    if any(placeholder in k_clean for placeholder in DUMMY_PLACEHOLDERS):
        return False
    return True

def get_system_mode_status() -> Dict[str, Any]:
    has_x = is_valid_key(X_BEARER_TOKEN)
    has_insta = is_valid_key(INSTAGRAM_ACCESS_TOKEN)
    has_openai = is_valid_key(OPENAI_API_KEY)

    if has_x or has_insta:
        mode_label = "LIVE API MODE"
        if has_x and has_insta:
            active_sources = ["X (Twitter) API v2", "Instagram Graph API"]
        elif has_x:
            active_sources = ["X (Twitter) API v2"]
        else:
            active_sources = ["Instagram Graph API"]
    else:
        mode_label = "DEMO MODE / SIMULATED DATA"
        active_sources = ["Simulated Demo Telemetry Engine"]

    return {
        "mode": mode_label,
        "has_x_api": has_x,
        "has_instagram_api": has_insta,
        "has_openai_api": has_openai,
        "active_sources": active_sources,
        "x_token_preview": f"{X_BEARER_TOKEN[:6]}...{X_BEARER_TOKEN[-4:]}" if has_x else None,
        "insta_token_preview": f"{INSTAGRAM_ACCESS_TOKEN[:6]}...{INSTAGRAM_ACCESS_TOKEN[-4:]}" if has_insta else None
    }
