import io
import csv
import json
import random
import datetime
from typing import Dict, Any, List, Tuple
from sqlalchemy.orm import Session
from backend.app.database.models import User, Post, SentimentResult, Topic, TrendMetric
from backend.app.services.ai_sentiment import analyze_post_sentiment

CONTENT_ALIASES = ["post_text", "text", "content", "message", "post", "body", "tweet", "comment"]
TIMESTAMP_ALIASES = ["timestamp", "created_at", "date", "datetime", "posted_at", "time"]
USER_ALIASES = ["user_id", "username", "author", "user", "user_handle", "handle"]
PLATFORM_ALIASES = ["platform", "source", "social_media", "network"]
ENTITY_ALIASES = ["entity", "entity_name", "target_entity", "person", "brand"]
ENTITY_TYPE_ALIASES = ["entity_type", "type", "category"]
HASHTAGS_ALIASES = ["hashtags", "tags", "hash_tags"]

def extract_field(item: dict, aliases: List[str]) -> str:
    """Helper to extract string value from dictionary matching any alias (case-insensitive)."""
    item_lower = {str(k).strip().lower(): v for k, v in item.items()}
    for alias in aliases:
        if alias in item_lower and item_lower[alias] is not None:
            val = str(item_lower[alias]).strip()
            if val:
                return val
    return ""

def parse_int_field(item: dict, aliases: List[str], default: int = 0) -> int:
    val_str = extract_field(item, aliases)
    if not val_str:
        return default
    try:
        # Handle floats like 12.0
        return int(float(val_str))
    except Exception:
        return default

def parse_timestamp_field(item: dict) -> datetime.datetime:
    ts_str = extract_field(item, TIMESTAMP_ALIASES)
    if not ts_str:
        return datetime.datetime.utcnow()
    for fmt in [
        "%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d",
        "%d/%m/%Y %H:%M:%S", "%d-%m-%Y %H:%M:%S", "%Y/%m/%d %H:%M:%S"
    ]:
        try:
            return datetime.datetime.strptime(ts_str, fmt)
        except Exception:
            continue
    return datetime.datetime.utcnow()

def process_posts_ingestion(file_contents: bytes, filename: str, db: Session) -> Dict[str, Any]:
    """
    Parses CSV or JSON content, validates rows, handles field aliases, computes sentiment,
    inserts into database, and returns detailed diagnostic ingestion counts.
    """
    filename_lower = filename.lower()
    raw_items = []

    # 1. Parse File Content
    try:
        try:
            decoded = file_contents.decode("utf-8-sig", errors="replace")
        except Exception:
            decoded = file_contents.decode("latin-1", errors="replace")

        if filename_lower.endswith(".json") or decoded.strip().startswith("[") or decoded.strip().startswith("{"):
            try:
                parsed = json.loads(decoded)
                if isinstance(parsed, list):
                    raw_items = parsed
                elif isinstance(parsed, dict) and "posts" in parsed:
                    raw_items = parsed["posts"]
                elif isinstance(parsed, dict):
                    raw_items = [parsed]
            except Exception:
                pass

        if not raw_items:  # Assume CSV or Delimited text
            # Detect delimiter
            sample = decoded[:4096]
            delimiter = ","
            if ";" in sample and sample.count(";") > sample.count(","):
                delimiter = ";"
            elif "\t" in sample and sample.count("\t") > sample.count(","):
                delimiter = "\t"

            reader = csv.DictReader(io.StringIO(decoded), delimiter=delimiter)
            raw_items = list(reader)
    except Exception as ex:
        return {
            "status": "error",
            "message": f"Failed to parse file: {str(ex)}",
            "rows_read": 0, "rows_valid": 0, "rows_inserted": 0, "rows_skipped": 0,
            "skip_reasons": {"parse_error": 1}
        }

    rows_read = len(raw_items)
    rows_valid = 0
    rows_inserted = 0
    rows_skipped = 0
    skip_reasons = {}

    is_demo_file = "demo" in filename_lower or "simulated" in filename_lower

    # Cache default user or create ingestion user
    default_user = db.query(User).filter(User.handle == "IngestedUser").first()
    if not default_user:
        default_user = User(
            handle="IngestedUser",
            name="Ingested User",
            platform="Multi-Platform",
            follower_count=5000,
            influence_score=50.0
        )
        db.add(default_user)
        db.flush()

    user_cache = {}

    for item in raw_items:
        # Extract primary content
        post_text = extract_field(item, CONTENT_ALIASES)

        if not post_text:
            rows_skipped += 1
            skip_reasons["empty_content"] = skip_reasons.get("empty_content", 0) + 1
            continue

        rows_valid += 1

        # Extract optional fields
        platform = extract_field(item, PLATFORM_ALIASES) or "X"
        user_handle = extract_field(item, USER_ALIASES) or "IngestedUser"
        entity_name = extract_field(item, ENTITY_ALIASES)
        entity_type = extract_field(item, ENTITY_TYPE_ALIASES)
        hashtags = extract_field(item, HASHTAGS_ALIASES)
        topic_name = extract_field(item, ["topic", "topic_name", "category"]) or entity_name or "General"

        timestamp = parse_timestamp_field(item)
        likes_count = parse_int_field(item, ["likes", "likes_count", "like_count"])
        replies_count = parse_int_field(item, ["comments", "replies", "comments_count", "replies_count"])
        shares_count = parse_int_field(item, ["shares", "shares_count", "retweets", "retweets_count"])
        views_count = parse_int_field(item, ["views", "views_count", "impressions"])

        # Create or resolve User
        if user_handle not in user_cache:
            existing_user = db.query(User).filter(User.handle == user_handle).first()
            if not existing_user:
                existing_user = User(
                    handle=user_handle,
                    name=user_handle.replace("_", " ").title(),
                    platform=platform,
                    follower_count=random.randint(1000, 50000),
                    influence_score=round(random.uniform(40.0, 90.0), 1)
                )
                db.add(existing_user)
                db.flush()
            user_cache[user_handle] = existing_user.id

        user_id = user_cache[user_handle]

        # Check for explicit demo flag or dataset mode
        item_is_demo = str(item.get("is_demo", "")).lower() in ["true", "1"] or is_demo_file

        try:
            post = Post(
                user_id=user_id,
                platform=platform,
                content=post_text,
                timestamp=timestamp,
                likes_count=likes_count,
                replies_count=replies_count,
                shares_count=shares_count,
                views_count=views_count,
                topic_name=topic_name,
                entity_name=entity_name if entity_name else None,
                entity_type=entity_type if entity_type else None,
                hashtags=hashtags if hashtags else None,
                is_demo=item_is_demo
            )
            db.add(post)
            db.flush()

            # Handle Sentiment
            raw_sentiment = extract_field(item, ["sentiment", "sentiment_label", "polarity"]).lower()
            if raw_sentiment in ["positive", "neutral", "negative"]:
                sentiment_label = raw_sentiment
                sent_analysis = analyze_post_sentiment(post_text)
                confidence = 0.95
                excitement = sent_analysis["excitement"]
                anxiety = sent_analysis["anxiety"]
                anger = sent_analysis["anger"]
                supportive = sent_analysis["supportive"]
                against = sent_analysis["against"]
                sarcasm = sent_analysis["sarcasm"]
                primary_emotion = sent_analysis["primary_emotion"]
            else:
                sent_analysis = analyze_post_sentiment(post_text)
                sentiment_label = sent_analysis["sentiment"]
                confidence = sent_analysis["confidence"]
                excitement = sent_analysis["excitement"]
                anxiety = sent_analysis["anxiety"]
                anger = sent_analysis["anger"]
                supportive = sent_analysis["supportive"]
                against = sent_analysis["against"]
                sarcasm = sent_analysis["sarcasm"]
                primary_emotion = sent_analysis["primary_emotion"]

            sent_res = SentimentResult(
                post_id=post.id,
                sentiment=sentiment_label,
                confidence=confidence,
                excitement=excitement,
                anxiety=anxiety,
                anger=anger,
                supportive=supportive,
                against=against,
                sarcasm=sarcasm,
                primary_emotion=primary_emotion
            )
            db.add(sent_res)

            # Auto-register Topic if entity/topic name provided
            if entity_name or topic_name:
                t_name = entity_name or topic_name
                existing_t = db.query(TrendMetric).filter(TrendMetric.topic_name == t_name).first()
                if not existing_t:
                    db.add(TrendMetric(
                        topic_name=t_name,
                        mentions_count=1,
                        growth_rate=random.uniform(50.0, 250.0),
                        sentiment_score=0.75 if sentiment_label == "positive" else (-0.5 if sentiment_label == "negative" else 0.0),
                        status="rising"
                    ))
                else:
                    existing_t.mentions_count += 1

            rows_inserted += 1

        except Exception as ex:
            db.rollback()
            rows_skipped += 1
            skip_reasons["db_error"] = skip_reasons.get("db_error", 0) + 1

    db.commit()

    return {
        "status": "success",
        "message": f"Successfully ingested {rows_inserted} posts ({rows_skipped} skipped out of {rows_read} total rows).",
        "rows_read": rows_read,
        "rows_valid": rows_valid,
        "rows_inserted": rows_inserted,
        "rows_skipped": rows_skipped,
        "skip_reasons": skip_reasons,
        "is_demo_mode": is_demo_file
    }
