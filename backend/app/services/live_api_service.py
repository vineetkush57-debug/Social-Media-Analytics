import urllib.request
import urllib.parse
import json
import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.config import X_BEARER_TOKEN, INSTAGRAM_ACCESS_TOKEN, is_valid_key
from backend.app.database.models import User, Post, SentimentResult, TrendMetric
from backend.app.services.ai_sentiment import analyze_post_sentiment

def fetch_live_x_tweets(query: str, limit: int = 10) -> List[dict]:
    """
    Fetches real live tweets from X (Twitter) v2 API endpoint search/recent.
    Requires X_BEARER_TOKEN.
    """
    if not is_valid_key(X_BEARER_TOKEN):
        return []

    encoded_query = urllib.parse.quote(query)
    url = f"https://api.twitter.com/2/tweets/search/recent?query={encoded_query}&max_results={min(limit, 100)}&tweet.fields=created_at,public_metrics,lang,author_id"

    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {X_BEARER_TOKEN.strip()}",
            "User-Agent": "SIH2026-SocialAnalytics/1.0"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            tweets = res_data.get("data", [])
            return tweets
    except Exception as ex:
        print(f"X API Live Fetch Exception: {ex}")
        return []

def ingest_live_tweets_to_db(query: str, db: Session, limit: int = 10) -> int:
    """
    Calls X API, ingests real live tweets into SQLite database as non-demo posts.
    """
    tweets = fetch_live_x_tweets(query, limit)
    if not tweets:
        return 0

    inserted_count = 0
    # Resolve default Live X User
    x_user = db.query(User).filter(User.handle == "X_LiveUser").first()
    if not x_user:
        x_user = User(
            handle="X_LiveUser",
            name="Live X Stream",
            platform="X",
            follower_count=50000,
            influence_score=85.0
        )
        db.add(x_user)
        db.flush()

    for tw in tweets:
        content = tw.get("text", "")
        if not content:
            continue

        metrics = tw.get("public_metrics", {})
        likes_count = metrics.get("like_count", 0)
        replies_count = metrics.get("reply_count", 0)
        shares_count = metrics.get("retweet_count", 0)
        views_count = metrics.get("impression_count", (likes_count * 12) + 100)

        # Parse timestamp
        created_str = tw.get("created_at")
        ts = datetime.datetime.utcnow()
        if created_str:
            try:
                ts = datetime.datetime.strptime(created_str.split(".")[0], "%Y-%m-%dT%H:%M:%S")
            except Exception:
                pass

        post = Post(
            user_id=x_user.id,
            platform="X",
            content=content,
            timestamp=ts,
            likes_count=likes_count,
            replies_count=replies_count,
            shares_count=shares_count,
            views_count=views_count,
            topic_name=query,
            entity_name=query,
            entity_type="Live Stream",
            is_demo=False
        )
        db.add(post)
        db.flush()

        # Run AI Sentiment Analysis
        sent_analysis = analyze_post_sentiment(content)
        sent_res = SentimentResult(
            post_id=post.id,
            sentiment=sent_analysis["sentiment"],
            confidence=sent_analysis["confidence"],
            excitement=sent_analysis["excitement"],
            anxiety=sent_analysis["anxiety"],
            anger=sent_analysis["anger"],
            supportive=sent_analysis["supportive"],
            against=sent_analysis["against"],
            sarcasm=sent_analysis["sarcasm"],
            primary_emotion=sent_analysis["primary_emotion"]
        )
        db.add(sent_res)
        inserted_count += 1

    db.commit()
    return inserted_count
