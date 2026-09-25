import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.database.session import get_db
from backend.app.database.models import (
    User, Post, Comment, Interaction, SentimentResult,
    DemographicResult, Topic, TrendMetric, NetworkEdge, Alert
)
from backend.app.schemas.schemas import (
    DashboardSummary, SentimentSummaryResponse, DemographicSummaryResponse,
    NetworkResponse, PropagationResponse, SearchResponse
)
from backend.app.services.ai_sentiment import analyze_post_sentiment
from backend.app.services.topic_extractor import extract_hashtags_and_keywords
from backend.app.services.network_analytics import compute_network_graph
from backend.app.services.propagation_service import trace_information_propagation
from backend.app.services.demo_seeder import seed_database
from backend.app.services.entity_service import generate_entity_intelligence
from backend.app.services.ingestion_service import process_posts_ingestion

router = APIRouter(prefix="/api")

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    posts_count = db.query(Post).count()
    return {
        "status": "online",
        "system": "SIH 2026 Social Media Analytics Platform",
        "database": "connected",
        "demo_mode": True,
        "total_posts_indexed": posts_count
    }

@router.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_posts = db.query(Post).count()
    active_users = db.query(User).count()
    total_interactions = db.query(func.sum(Post.likes_count + Post.replies_count + Post.shares_count)).scalar() or 0
    trending_topics_count = db.query(TrendMetric).filter(TrendMetric.status == "trending").count()

    # Sentiment breakdown
    s_positive = db.query(SentimentResult).filter(SentimentResult.sentiment == "positive").count()
    s_neutral = db.query(SentimentResult).filter(SentimentResult.sentiment == "neutral").count()
    s_negative = db.query(SentimentResult).filter(SentimentResult.sentiment == "negative").count()

    # Platform distribution
    platform_rows = db.query(Post.platform, func.count(Post.id)).group_by(Post.platform).all()
    platform_dist = {p[0]: p[1] for p in platform_rows}

    # Top Influencers
    top_inf_users = db.query(User).order_by(User.influence_score.desc()).limit(5).all()
    top_influencers = [
        {
            "id": u.id,
            "handle": u.handle,
            "name": u.name,
            "platform": u.platform,
            "influence_score": u.influence_score,
            "follower_count": u.follower_count,
            "community_id": u.community_id
        } for u in top_inf_users
    ]

    # Recent activity timeline
    recent_posts = db.query(Post).order_by(Post.timestamp.desc()).limit(6).all()
    recent_activity = [
        {
            "id": p.id,
            "user": p.user.handle if p.user else "User",
            "platform": p.platform,
            "content": p.content[:90] + "..." if len(p.content) > 90 else p.content,
            "timestamp": p.timestamp.strftime("%H:%M:%S"),
            "sentiment": p.sentiment.sentiment if p.sentiment else "neutral",
            "likes": p.likes_count,
            "topic": p.topic_name
        } for p in recent_posts
    ]

    # Trending topics
    trending_rows = db.query(TrendMetric).order_by(TrendMetric.mentions_count.desc()).all()
    trending_topics = [
        {
            "topic": t.topic_name,
            "mentions": t.mentions_count,
            "growth": t.growth_rate,
            "sentiment": "Positive" if t.sentiment_score > 0.2 else ("Negative" if t.sentiment_score < -0.2 else "Neutral"),
            "status": t.status
        } for t in trending_rows
    ]

    return {
        "total_posts": total_posts,
        "active_users": active_users,
        "total_interactions": total_interactions,
        "trending_topics_count": trending_topics_count,
        "sentiment_breakdown": {
            "positive": s_positive,
            "neutral": s_neutral,
            "negative": s_negative
        },
        "platform_distribution": platform_dist,
        "top_influencers": top_influencers,
        "recent_activity": recent_activity,
        "trending_topics": trending_topics
    }

@router.get("/posts")
def get_posts(skip: int = 0, limit: int = 20, platform: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Post)
    if platform and platform != "all":
        query = query.filter(Post.platform == platform)
    
    posts = query.order_by(Post.timestamp.desc()).offset(skip).limit(limit).all()
    result = []
    for p in posts:
        result.append({
            "id": p.id,
            "user_handle": p.user.handle if p.user else "User",
            "user_name": p.user.name if p.user else "User",
            "user_avatar": p.user.avatar_url if p.user else None,
            "platform": p.platform,
            "content": p.content,
            "timestamp": p.timestamp.isoformat(),
            "likes": p.likes_count,
            "replies": p.replies_count,
            "shares": p.shares_count,
            "views": p.views_count,
            "topic": p.topic_name,
            "sentiment": p.sentiment.sentiment if p.sentiment else "neutral",
            "confidence": p.sentiment.confidence if p.sentiment else 0.8,
            "primary_emotion": p.sentiment.primary_emotion if p.sentiment else "Supportive",
            "is_demo": p.is_demo
        })
    return {"total": query.count(), "posts": result}

@router.post("/posts/upload")
async def upload_posts_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Accepts CSV or JSON upload of social media posts, runs sentiment AI, and stores in database.
    Supports post_text, content, text, message, entity, entity_type, hashtags, likes, comments, etc.
    """
    contents = await file.read()
    filename = file.filename or "upload.csv"
    res = process_posts_ingestion(contents, filename, db)
    if res.get("status") == "error":
        raise HTTPException(status_code=400, detail=res.get("message"))
    return res

@router.get("/sentiment")
def get_sentiment_analytics(db: Session = Depends(get_db)):
    results = db.query(SentimentResult).all()

    dist = {"positive": 0, "neutral": 0, "negative": 0}
    emotions_sum = {"Excitement": 0.0, "Anxiety": 0.0, "Anger": 0.0, "Supportive": 0.0, "Against": 0.0, "Sarcasm": 0.0}

    for r in results:
        dist[r.sentiment] = dist.get(r.sentiment, 0) + 1
        emotions_sum["Excitement"] += r.excitement
        emotions_sum["Anxiety"] += r.anxiety
        emotions_sum["Anger"] += r.anger
        emotions_sum["Supportive"] += r.supportive
        emotions_sum["Against"] += r.against
        emotions_sum["Sarcasm"] += r.sarcasm

    total = len(results) or 1
    avg_emotions = {k: round((v / total) * 100, 1) for k, v in emotions_sum.items()}

    timeline = [
        {"time": "00:00", "positive": 45, "neutral": 30, "negative": 10},
        {"time": "04:00", "positive": 60, "neutral": 40, "negative": 15},
        {"time": "08:00", "positive": 140, "neutral": 75, "negative": 25},
        {"time": "12:00", "positive": 320, "neutral": 110, "negative": 45},
        {"time": "16:00", "positive": 480, "neutral": 160, "negative": 70},
        {"time": "20:00", "positive": 590, "neutral": 190, "negative": 85},
    ]

    platform_wise = {
        "X": {"positive": 420, "neutral": 180, "negative": 95},
        "Telegram": {"positive": 190, "neutral": 70, "negative": 30},
        "Instagram": {"positive": 340, "neutral": 90, "negative": 20},
        "Reddit": {"positive": 180, "neutral": 110, "negative": 140},
        "YouTube": {"positive": 510, "neutral": 130, "negative": 40},
    }

    topic_wise = {
        "AI Autonomous Agents": {"positive": 310, "neutral": 80, "negative": 25},
        "Cybersecurity Protocol Alpha": {"positive": 45, "neutral": 60, "negative": 180},
        "Green Tech Energy Grid": {"positive": 190, "neutral": 50, "negative": 20},
        "Quantum Computing Paradigm": {"positive": 140, "neutral": 70, "negative": 30},
        "DeCentralized FinTech": {"positive": 95, "neutral": 65, "negative": 85},
    }

    recent_posts = db.query(Post).order_by(Post.timestamp.desc()).limit(8).all()
    recent_analyzed = []
    for p in recent_posts:
        s = p.sentiment
        recent_analyzed.append({
            "id": p.id,
            "text": p.content,
            "platform": p.platform,
            "user": p.user.handle if p.user else "User",
            "sentiment": s.sentiment if s else "positive",
            "primary_emotion": s.primary_emotion if s else "Supportive",
            "confidence": s.confidence if s else 0.92,
            "ai_label": "AI-generated estimate"
        })

    return {
        "distribution": dist,
        "emotions": avg_emotions,
        "timeline": timeline,
        "platform_wise": platform_wise,
        "topic_wise": topic_wise,
        "recent_analyzed": recent_analyzed
    }

@router.get("/demographics")
def get_demographic_analytics(db: Session = Depends(get_db)):
    rows = db.query(DemographicResult).all()

    age_brackets = {}
    geographic_distribution = {}
    languages = {}
    professional_interests = {}

    age_distribution = []
    geographic_reach = []
    language_distribution = []
    interest_domains = []

    for r in rows:
        if r.category_type == "age_group":
            age_brackets[r.label] = r.percentage
            age_distribution.append({"label": r.label, "value": r.percentage, "count": r.count})
        elif r.category_type == "geographic_region":
            geographic_distribution[r.label] = r.percentage
            geographic_reach.append({"label": r.label, "value": r.percentage, "count": r.count})
        elif r.category_type == "language":
            languages[r.label] = r.percentage
            language_distribution.append({"label": r.label, "value": r.percentage, "count": r.count})
        elif r.category_type == "professional_interest":
            professional_interests[r.label] = r.percentage
            interest_domains.append({"label": r.label, "value": r.percentage, "count": r.count})

    # Fallback to defaults if DB rows were empty
    if not age_brackets:
        age_brackets = {"18-24": 32.0, "25-34": 28.0, "35-44": 18.0, "45-54": 12.0, "55+": 10.0}
        age_distribution = [{"label": k, "value": v} for k, v in age_brackets.items()]
    if not geographic_distribution:
        geographic_distribution = {"Central India": 31.0, "North India": 24.0, "West India": 19.0, "South India": 16.0, "East India": 10.0}
        geographic_reach = [{"label": k, "value": v} for k, v in geographic_distribution.items()]
    if not languages:
        languages = {"English": 38.0, "Hindi": 34.0, "Hinglish": 18.0, "Other": 10.0}
        language_distribution = [{"label": k, "value": v} for k, v in languages.items()]
    if not professional_interests:
        professional_interests = {"Technology": 30.0, "Sports": 24.0, "Business": 18.0, "Education": 16.0, "Entertainment": 12.0}
        interest_domains = [{"label": k, "value": v} for k, v in professional_interests.items()]

    has_uploaded = db.query(Post).filter(Post.is_demo == False).count() > 0

    return {
        "age_brackets": age_brackets,
        "geographic_distribution": geographic_distribution,
        "languages": languages,
        "professional_interests": professional_interests,
        "age_distribution": age_distribution,
        "geographic_reach": geographic_reach,
        "language_distribution": language_distribution,
        "interest_domains": interest_domains,
        "total_audience": 45000,
        "source_mode": "UPLOADED DATA" if has_uploaded else "DEMO",
        "disclaimer": "Demographic values are aggregated estimates based on available public/demo signals."
    }

@router.get("/trends")
def get_trends(db: Session = Depends(get_db)):
    metrics = db.query(TrendMetric).order_by(TrendMetric.mentions_count.desc()).all()
    posts_text = [p.content for p in db.query(Post.content).all()]
    extracted = extract_hashtags_and_keywords(posts_text)

    topics_list = []
    for m in metrics:
        topics_list.append({
            "topic": m.topic_name,
            "category": "Sports" if "Kohli" in m.topic_name or "Cricket" in m.topic_name else ("Technology" if "AI" in m.topic_name else ("Security" if "Cyber" in m.topic_name else "Innovation")),
            "mentions": m.mentions_count,
            "growth": m.growth_rate,
            "sentiment": "Positive" if m.sentiment_score > 0.2 else ("Negative" if m.sentiment_score < -0.2 else "Neutral"),
            "status": m.status,
            "first_detected": "2 hours ago",
            "forecast_score": round(min(99.0, m.growth_rate * 0.35 + 25), 1)
        })

    trend_timeline = [
        {"hour": "06:00", "Virat Kohli": 1200, "AI Autonomous Agents": 400, "Cybersecurity Protocol": 200, "Green Tech": 150},
        {"hour": "09:00", "Virat Kohli": 3400, "AI Autonomous Agents": 1200, "Cybersecurity Protocol": 450, "Green Tech": 380},
        {"hour": "12:00", "Virat Kohli": 6800, "AI Autonomous Agents": 2800, "Cybersecurity Protocol": 980, "Green Tech": 720},
        {"hour": "15:00", "Virat Kohli": 8200, "AI Autonomous Agents": 3950, "Cybersecurity Protocol": 1850, "Green Tech": 1400},
        {"hour": "18:00", "Virat Kohli": 8940, "AI Autonomous Agents": 4280, "Cybersecurity Protocol": 2150, "Green Tech": 1840},
    ]

    return {
        "topics": topics_list,
        "hashtags": extracted["hashtags"],
        "keywords": extracted["keywords"],
        "trend_timeline": trend_timeline,
        "projection_label": "Estimated trend projection"
    }

@router.get("/network")
def get_network_analytics(db: Session = Depends(get_db)):
    return compute_network_graph(db)

@router.get("/network/influencers")
def get_network_influencers(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.influence_score.desc()).all()
    result = []
    for u in users:
        result.append({
            "id": u.id,
            "handle": u.handle,
            "name": u.name,
            "platform": u.platform,
            "influence_score": u.influence_score,
            "followers": u.follower_count,
            "verified": u.verified,
            "community_id": u.community_id,
            "bio": u.bio
        })
    return result

@router.get("/propagation")
def get_propagation_analytics(topic: str = "AI Autonomous Agents"):
    return trace_information_propagation(topic)

@router.get("/timeline")
def get_timeline_events(
    topic: Optional[str] = None,
    platform: Optional[str] = None,
    sentiment: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Post)
    if platform and platform != "all":
        query = query.filter(Post.platform == platform)
    if topic and topic.strip():
        q_clean = f"%{topic.strip()}%"
        query = query.filter(Post.topic_name.ilike(q_clean) | Post.content.ilike(q_clean) | Post.entity_name.ilike(q_clean))
    if sentiment and sentiment != "all":
        query = query.join(SentimentResult).filter(SentimentResult.sentiment == sentiment)

    posts = query.order_by(Post.timestamp.desc()).limit(30).all()
    events = []
    for idx, p in enumerate(posts):
        events.append({
            "id": str(p.id),
            "timestamp": p.timestamp.strftime("%Y-%m-%d %H:%M UTC"),
            "topic": p.topic_name or p.entity_name or "General",
            "platform": p.platform,
            "user_handle": p.user.handle if p.user else "@User",
            "event_type": "Viral Spike" if (p.likes_count > 10000 or idx % 3 == 0) else "Post Published",
            "content": p.content,
            "sentiment": p.sentiment.sentiment if p.sentiment else "positive",
            "engagement": (p.likes_count + p.replies_count + p.shares_count),
            "reach": p.views_count or ((p.likes_count or 1) * 15),
            "description": f"Published on {p.platform} by @{p.user.handle if p.user else 'User'}"
        })
    return events

@router.get("/alerts")
def get_alerts(severity: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Alert)
    if severity and severity != "all":
        query = query.filter(Alert.severity == severity)
    
    alerts = query.order_by(Alert.timestamp.desc()).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "severity": a.severity,
            "platform": a.platform,
            "topic_name": a.topic_name,
            "description": a.description,
            "timestamp": a.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "is_read": a.is_read
        } for a in alerts
    ]

@router.post("/demo/seed")
def trigger_seed_demo(db: Session = Depends(get_db)):
    success = seed_database(db)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to seed database.")
    return {"status": "success", "message": "Demo database successfully re-seeded with consistent social intelligence dataset."}

@router.get("/search")
def global_search(query: str, db: Session = Depends(get_db)):
    if not query:
        return {"matching_posts": [], "related_topics": [], "influencers": [], "sentiment_overview": {}}

    q_lower = f"%{query}%"

    matching_posts_objs = db.query(Post).filter(Post.content.ilike(q_lower)).limit(5).all()
    matching_posts = [
        {
            "id": p.id,
            "text": p.content,
            "platform": p.platform,
            "user": p.user.handle if p.user else "User",
            "sentiment": p.sentiment.sentiment if p.sentiment else "positive"
        } for p in matching_posts_objs
    ]

    related_topics_objs = db.query(TrendMetric).filter(TrendMetric.topic_name.ilike(q_lower)).all()
    related_topics = [{"topic": t.topic_name, "growth": t.growth_rate, "mentions": t.mentions_count} for t in related_topics_objs]

    influencers_objs = db.query(User).filter(User.handle.ilike(q_lower) | User.name.ilike(q_lower)).all()
    influencers = [{"handle": u.handle, "name": u.name, "platform": u.platform, "score": u.influence_score} for u in influencers_objs]

    return {
        "query": query,
        "matching_posts": matching_posts,
        "related_topics": related_topics,
        "influencers": influencers,
        "sentiment_overview": {"positive": len(matching_posts), "neutral": 1, "negative": 0}
    }

@router.get("/entity/{query}")
def get_entity_intelligence(query: str, db: Session = Depends(get_db)):
    if not query or not query.strip():
        raise HTTPException(status_code=400, detail="Entity query string cannot be empty.")
    return generate_entity_intelligence(query, db)
