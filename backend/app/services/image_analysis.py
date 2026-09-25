import re
from typing import Dict, Any, List
from backend.app.services.ai_sentiment import analyze_post_sentiment

KNOWN_ENTITIES = [
    "Virat Kohli", "Kohli", "Rohit Sharma", "Puma", "Nike", "Apple", "Tesla", "Google",
    "Microsoft", "SIH 2026", "IPL", "T20 World Cup", "AI Agents", "Cybersecurity Protocol",
    "AlexVanguard", "ElenaData", "TechResearchLab", "DevPulse_HQ", "CyberSentinel", "AIVisualizer"
]

def analyze_screenshot_text(text: str, filename: str = "screenshot.png") -> Dict[str, Any]:
    """
    Parses OCR text to detect entities, usernames, hashtags, keywords, platform, timestamp,
    and runs image-level sentiment classification.
    """
    cleaned_text = text.strip()
    text_lower = cleaned_text.lower()

    # 1. Detect Hashtags
    hashtags = list(set(re.findall(r"#\w+", cleaned_text)))

    # 2. Detect Visible Usernames
    usernames = list(set(re.findall(r"@\w+", cleaned_text)))

    # 3. Detect Entities
    detected_entities = []
    for entity in KNOWN_ENTITIES:
        if entity.lower() in text_lower:
            detected_entities.append(entity)

    # If no known entity matched, extract capitalized words or hashtag fallback
    if not detected_entities:
        cap_words = re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b", cleaned_text)
        skip_words = ["The", "A", "An", "In", "On", "At", "For", "With", "By", "Is", "Are", "Was", "Were", "Instagram", "Twitter", "Reddit", "Telegram", "YouTube"]
        valid_caps = [w for w in cap_words if w not in skip_words and len(w) > 2]
        if valid_caps:
            detected_entities = list(set(valid_caps[:3]))
        elif hashtags:
            detected_entities = [hashtags[0].replace("#", "")]
        else:
            detected_entities = ["Social Media Post"]

    # 4. Detect Keywords
    words = re.findall(r"\b[a-zA-Z]{4,}\b", text_lower)
    stopwords = {"with", "that", "this", "from", "they", "have", "were", "what", "when", "where", "about", "posted", "image", "text", "screenshot"}
    keywords = list(set([w for w in words if w not in stopwords]))[:8]

    # 5. Detect Platform
    platform = "Unknown"
    if "instagram" in text_lower or "insta" in text_lower or "like" in text_lower and "comment" in text_lower:
        platform = "Instagram"
    elif "twitter" in text_lower or "repost" in text_lower or "retweet" in text_lower or "x.com" in text_lower:
        platform = "X"
    elif "reddit" in text_lower or "subreddit" in text_lower or "r/" in text_lower or "upvote" in text_lower:
        platform = "Reddit"
    elif "telegram" in text_lower or "channel" in text_lower:
        platform = "Telegram"
    elif "youtube" in text_lower or "subscribers" in text_lower or "views" in text_lower:
        platform = "YouTube"

    # 6. Detect Timestamp if visible
    ts_match = re.search(r"\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\b", cleaned_text)
    timestamp = ts_match.group(0) if ts_match else None

    # 7. Sentiment & Emotion Analysis
    sent_res = analyze_post_sentiment(cleaned_text if cleaned_text else "Social media screenshot")

    return {
        "success": True,
        "filename": filename,
        "ocr_text": cleaned_text,
        "entities": detected_entities,
        "hashtags": hashtags,
        "usernames": usernames,
        "keywords": keywords,
        "platform": platform,
        "timestamp": timestamp,
        "sentiment": sent_res["sentiment"],
        "confidence": sent_res["confidence"],
        "primary_emotion": sent_res["primary_emotion"],
        "emotions": {
            "Excitement": sent_res["excitement"],
            "Anxiety": sent_res["anxiety"],
            "Anger": sent_res["anger"],
            "Supportive": sent_res["supportive"],
            "Against": sent_res["against"],
            "Sarcasm": sent_res["sarcasm"]
        },
        "data_mode": "image_only"
    }
