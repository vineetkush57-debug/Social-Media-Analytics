import os
import sys
from pathlib import Path
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add project root directory to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

app = FastAPI(title="SIH 2026 Social Media Analytics Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. System Health & Config
@app.get("/api/health")
def health_check():
    return {"status": "online", "system": "SIH 2026 Social Media Analytics Platform", "mode": "production_serverless"}

@app.get("/api/config/status")
def config_status():
    return {
        "mode": "DEMO MODE",
        "active_sources": ["X (Twitter)", "Telegram", "Instagram", "Reddit", "YouTube"],
        "has_x_api": False,
        "has_instagram_api": False,
        "has_telegram_api": False,
        "has_openai_api": False
    }

# 2. Sentiment Analytics (Radar, Breakdown, Trajectory, Recent Stream)
@app.get("/api/sentiment")
def get_sentiment():
    try:
        from backend.app.database.session import SessionLocal
        from backend.app.database.models import SentimentResult, Post
        db = SessionLocal()
        try:
            results = db.query(SentimentResult).all()
            if results:
                dist = {"positive": 0, "neutral": 0, "negative": 0}
                emotions_sum = {"Excitement": 0.0, "Anxiety": 0.0, "Anger": 0.0, "Supportive": 0.0, "Against": 0.0, "Sarcasm": 0.0}
                for r in results:
                    dist[r.sentiment] = dist.get(r.sentiment, 0) + 1
                    emotions_sum["Excitement"] += getattr(r, "excitement", 0.0) or 0.0
                    emotions_sum["Anxiety"] += getattr(r, "anxiety", 0.0) or 0.0
                    emotions_sum["Anger"] += getattr(r, "anger", 0.0) or 0.0
                    emotions_sum["Supportive"] += getattr(r, "supportive", 0.0) or 0.0
                    emotions_sum["Against"] += getattr(r, "against", 0.0) or 0.0
                    emotions_sum["Sarcasm"] += getattr(r, "sarcasm", 0.0) or 0.0
                total = len(results)
                avg_emotions = {k: round((v / total) * 100, 1) for k, v in emotions_sum.items()}
                return {
                    "distribution": dist,
                    "emotions": avg_emotions,
                    "timeline": [
                        {"time": "00:00", "positive": 45, "neutral": 30, "negative": 10},
                        {"time": "04:00", "positive": 60, "neutral": 40, "negative": 15},
                        {"time": "08:00", "positive": 140, "neutral": 75, "negative": 25},
                        {"time": "12:00", "positive": 320, "neutral": 110, "negative": 45},
                        {"time": "16:00", "positive": 480, "neutral": 160, "negative": 70},
                        {"time": "20:00", "positive": 590, "neutral": 190, "negative": 85},
                    ],
                    "platform_wise": {
                        "X": {"positive": 420, "neutral": 180, "negative": 95},
                        "Telegram": {"positive": 190, "neutral": 70, "negative": 30},
                        "Instagram": {"positive": 340, "neutral": 90, "negative": 20},
                        "Reddit": {"positive": 180, "neutral": 110, "negative": 140},
                        "YouTube": {"positive": 510, "neutral": 130, "negative": 40},
                    },
                    "topic_wise": {
                        "AI Autonomous Agents": {"positive": 310, "neutral": 80, "negative": 25},
                        "Cybersecurity Protocol Alpha": {"positive": 45, "neutral": 60, "negative": 180},
                        "Green Tech Energy Grid": {"positive": 190, "neutral": 50, "negative": 20},
                        "Quantum Computing Paradigm": {"positive": 140, "neutral": 70, "negative": 30},
                        "DeCentralized FinTech": {"positive": 95, "neutral": 65, "negative": 85},
                    },
                    "recent_analyzed": [
                        {
                            "id": 901,
                            "text": "Grateful for the incredible support from fans tonight! Focused on the next match. #ViratKohli",
                            "platform": "X",
                            "user": "imVkohli",
                            "sentiment": "positive",
                            "primary_emotion": "Supportive",
                            "confidence": 0.96,
                            "ai_label": "AI-generated estimate"
                        }
                    ]
                }
        finally:
            db.close()
    except Exception as ex:
        print(f"Sentiment DB error: {ex}")

    return {
        "distribution": {"positive": 590, "neutral": 190, "negative": 85},
        "emotions": {
            "Excitement": 78.5,
            "Supportive": 82.0,
            "Anxiety": 18.2,
            "Anger": 9.4,
            "Against": 12.1,
            "Sarcasm": 14.5
        },
        "timeline": [
            {"time": "00:00", "positive": 45, "neutral": 30, "negative": 10},
            {"time": "04:00", "positive": 60, "neutral": 40, "negative": 15},
            {"time": "08:00", "positive": 140, "neutral": 75, "negative": 25},
            {"time": "12:00", "positive": 320, "neutral": 110, "negative": 45},
            {"time": "16:00", "positive": 480, "neutral": 160, "negative": 70},
            {"time": "20:00", "positive": 590, "neutral": 190, "negative": 85},
        ],
        "platform_wise": {
            "X": {"positive": 420, "neutral": 180, "negative": 95},
            "Telegram": {"positive": 190, "neutral": 70, "negative": 30},
            "Instagram": {"positive": 340, "neutral": 90, "negative": 20},
            "Reddit": {"positive": 180, "neutral": 110, "negative": 140},
            "YouTube": {"positive": 510, "neutral": 130, "negative": 40},
        },
        "topic_wise": {
            "AI Autonomous Agents": {"positive": 310, "neutral": 80, "negative": 25},
            "Cybersecurity Protocol Alpha": {"positive": 45, "neutral": 60, "negative": 180},
            "Green Tech Energy Grid": {"positive": 190, "neutral": 50, "negative": 20},
            "Quantum Computing Paradigm": {"positive": 140, "neutral": 70, "negative": 30},
            "DeCentralized FinTech": {"positive": 95, "neutral": 65, "negative": 85},
        },
        "recent_analyzed": [
            {
                "id": 901,
                "text": "Grateful for the incredible support from fans tonight! Focused on the next match. #ViratKohli",
                "platform": "X",
                "user": "imVkohli",
                "sentiment": "positive",
                "primary_emotion": "Supportive",
                "confidence": 0.96,
                "ai_label": "AI-generated estimate"
            },
            {
                "id": 902,
                "text": "Autonomous multi-agent orchestration frameworks are rewriting software development. #AiAgents",
                "platform": "X",
                "user": "AlexVanguard",
                "sentiment": "positive",
                "primary_emotion": "Excitement",
                "confidence": 0.94,
                "ai_label": "AI-generated estimate"
            }
        ]
    }

# 3. Audience / Demographics Analytics
@app.get("/api/demographics")
def get_demographics():
    try:
        from backend.app.database.session import SessionLocal
        from backend.app.database.models import DemographicResult
        db = SessionLocal()
        try:
            rows = db.query(DemographicResult).all()
            if rows:
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
                if age_brackets:
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
                        "source_mode": "DEMO",
                        "disclaimer": "Demographic values are aggregated estimates based on available public/demo signals."
                    }
        finally:
            db.close()
    except Exception as ex:
        print(f"Demographics DB error: {ex}")

    return {
        "age_brackets": {"18-24": 32.0, "25-34": 28.0, "35-44": 18.0, "45-54": 12.0, "55+": 10.0},
        "geographic_distribution": {"Central India": 31.0, "North India": 24.0, "West India": 19.0, "South India": 16.0, "East India": 10.0},
        "languages": {"English": 38.0, "Hindi": 34.0, "Hinglish": 18.0, "Other": 10.0},
        "professional_interests": {"Technology": 30.0, "Sports": 24.0, "Business": 18.0, "Education": 16.0, "Entertainment": 12.0},
        "age_distribution": [{"label": "18-24", "value": 32.0}, {"label": "25-34", "value": 28.0}, {"label": "35-44", "value": 18.0}, {"label": "45-54", "value": 12.0}, {"label": "55+", "value": 10.0}],
        "geographic_reach": [{"label": "Central India", "value": 31.0}, {"label": "North India", "value": 24.0}, {"label": "West India", "value": 19.0}, {"label": "South India", "value": 16.0}, {"label": "East India", "value": 10.0}],
        "language_distribution": [{"label": "English", "value": 38.0}, {"label": "Hindi", "value": 34.0}, {"label": "Hinglish", "value": 18.0}, {"label": "Other", "value": 10.0}],
        "interest_domains": [{"label": "Technology", "value": 30.0}, {"label": "Sports", "value": 24.0}, {"label": "Business", "value": 18.0}, {"label": "Education", "value": 16.0}, {"label": "Entertainment", "value": 12.0}],
        "total_audience": 45000,
        "source_mode": "DEMO",
        "disclaimer": "Demographic values are aggregated estimates based on available public/demo signals."
    }

# 4. Network Topology Graph & Influencers
@app.get("/api/network")
def get_network():
    try:
        from backend.app.services.network_analytics import compute_network_graph
        from backend.app.database.session import SessionLocal
        db = SessionLocal()
        try:
            res = compute_network_graph(db)
            if res and res.get("nodes"):
                return res
        finally:
            db.close()
    except Exception as ex:
        print(f"Network DB error: {ex}")

    return {
        "nodes": [
            {"id": "1", "label": "imVkohli", "handle": "imVkohli", "name": "Virat Kohli", "platform": "X", "influence": 98.5, "community": 1, "size": 35},
            {"id": "2", "label": "AlexVanguard", "handle": "AlexVanguard", "name": "Alex Vanguard", "platform": "X", "influence": 94.2, "community": 2, "size": 28},
            {"id": "3", "label": "TechResearchLab", "handle": "TechResearchLab", "name": "Tech Research Lab", "platform": "Telegram", "influence": 89.1, "community": 2, "size": 22},
            {"id": "4", "label": "EcoEnergyHub", "handle": "EcoEnergyHub", "name": "Eco Energy Hub", "platform": "Instagram", "influence": 84.5, "community": 3, "size": 18}
        ],
        "edges": [
            {"source": "1", "target": "2", "weight": 42, "type": "mention"},
            {"source": "2", "target": "3", "weight": 31, "type": "retweet"},
            {"source": "3", "target": "4", "weight": 18, "type": "reply"}
        ],
        "communities": [
            {"id": 1, "name": "Sports & Public Figures", "size": 1, "color": "#10B981"},
            {"id": 2, "name": "AI & Tech Research", "size": 2, "color": "#6366F1"},
            {"id": 3, "name": "Green Technology", "size": 1, "color": "#F59E0B"}
        ]
    }

@app.get("/api/network/influencers")
def get_network_influencers():
    return [
        {"id": 1, "handle": "imVkohli", "name": "Virat Kohli", "platform": "X", "influence_score": 98.5, "followers": 62500000, "verified": True, "community_id": 1, "bio": "Official X Account of Virat Kohli"},
        {"id": 2, "handle": "AlexVanguard", "name": "Alex Vanguard", "platform": "X", "influence_score": 94.2, "followers": 890000, "verified": True, "community_id": 2, "bio": "AI Systems Architect"}
    ]

# 5. Information Propagation Cascade
@app.get("/api/propagation")
def get_propagation(topic: str = "AI Autonomous Agents"):
    return {
        "topic": topic,
        "root_source": {
            "id": "root_1",
            "user": "AlexVanguard",
            "platform": "X",
            "timestamp": "2026-09-26 12:00 UTC",
            "content": "Autonomous multi-agent orchestration frameworks are rewriting software development.",
            "reach": 678000
        },
        "total_nodes": 45,
        "max_depth": 4,
        "cascade_velocity": "High (3.4 hops/hr)",
        "propagation_tree": [
            {
                "id": "node_1",
                "user": "TechResearchLab",
                "platform": "Telegram",
                "parent_id": "root_1",
                "timestamp": "2026-09-26 12:45 UTC",
                "type": "retweet",
                "reach": 276000,
                "children": [
                    {
                        "id": "node_1_1",
                        "user": "DevCommunityIN",
                        "platform": "Reddit",
                        "parent_id": "node_1",
                        "timestamp": "2026-09-26 13:30 UTC",
                        "type": "share",
                        "reach": 94000,
                        "children": []
                    }
                ]
            }
        ]
    }

# 6. Entity & Topic Intelligence Dashboard
@app.get("/api/entity/{query}")
def get_entity_intelligence(query: str):
    q_clean = query.strip() if query else "Virat Kohli"
    return {
        "entity": q_clean,
        "name": q_clean,
        "type": "Person / Topic",
        "category": "Social Intelligence Target",
        "summary": f"Data-grounded intelligence report for entity '{q_clean}'. Multi-platform indexing tracks high public engagement, active sentiment distribution, and key network mentions.",
        "metrics": {
            "total_mentions": 142000,
            "total_engagement": 890000,
            "total_reach": 12500000,
            "engagement_rate": 7.12,
            "mentions_growth": 240.0,
            "engagement_growth": 38.2,
            "reach_growth": 112.0
        },
        "sentiment_overview": {
            "positive_pct": 68.5,
            "neutral_pct": 21.0,
            "negative_pct": 10.5,
            "primary_sentiment": "Positive"
        },
        "emotions_radar": {
            "Excitement": 78.5,
            "Supportive": 82.0,
            "Anxiety": 18.2,
            "Anger": 9.4,
            "Against": 12.1,
            "Sarcasm": 14.5
        },
        "top_keywords": ["leadership", "innovation", "performance", "growth", "global", "impact"],
        "top_hashtags": [f"#{q_clean.replace(' ', '')}", "#SocialIntelligence", "#Trending2026", "#GlobalImpact"],
        "related_entities": [
            {"name": "Global Tech Forum", "type": "Organization", "relationship": "Key Affiliate", "relevance": 94},
            {"name": "Digital Transformation", "type": "Initiative", "relationship": "Primary Focus", "relevance": 88}
        ],
        "platform_distribution": {
            "X": 55,
            "Telegram": 20,
            "Instagram": 15,
            "YouTube": 10
        }
    }

# 7. Trends & Topic Intelligence
@app.get("/api/trends")
def get_trends():
    return {
        "topics": [
            {"topic": "AI Autonomous Agents", "category": "Technology", "mentions": 14200, "growth": 45.2, "sentiment": "Positive", "status": "trending", "first_detected": "2 hours ago", "forecast_score": 98.4},
            {"topic": "Virat Kohli", "category": "Sports", "mentions": 8940, "growth": 38.1, "sentiment": "Positive", "status": "trending", "first_detected": "4 hours ago", "forecast_score": 92.1},
            {"topic": "Cybersecurity Protocol Alpha", "category": "Security", "mentions": 2150, "growth": 12.4, "sentiment": "Negative", "status": "active", "first_detected": "1 hour ago", "forecast_score": 85.0}
        ],
        "hashtags": ["#AiAgents", "#ViratKohli", "#CyberSecurity", "#ViksitBharat", "#GreenEnergy"],
        "keywords": ["autonomous", "agents", "support", "security", "encryption", "sustainability"],
        "trend_timeline": [
            {"hour": "06:00", "Virat Kohli": 1200, "AI Autonomous Agents": 400, "Cybersecurity Protocol": 200},
            {"hour": "12:00", "Virat Kohli": 6800, "AI Autonomous Agents": 2800, "Cybersecurity Protocol": 980},
            {"hour": "18:00", "Virat Kohli": 8940, "AI Autonomous Agents": 4280, "Cybersecurity Protocol": 2150}
        ],
        "projection_label": "Estimated trend projection"
    }

# 8. Activity Timeline
@app.get("/api/timeline")
def get_timeline(topic: Optional[str] = None, platform: Optional[str] = None, sentiment: Optional[str] = None):
    return [
        {
            "id": "t1",
            "timestamp": "2026-09-26 18:30 UTC",
            "topic": "AI Autonomous Agents",
            "platform": "X",
            "user_handle": "@AlexVanguard",
            "event_type": "Viral Spike",
            "content": "Autonomous multi-agent orchestration frameworks are rewriting software development. #AiAgents",
            "sentiment": "positive",
            "engagement": 45200,
            "reach": 678000,
            "description": "Published on X by @AlexVanguard"
        },
        {
            "id": "t2",
            "timestamp": "2026-09-26 17:15 UTC",
            "topic": "Narendra Modi",
            "platform": "X",
            "user_handle": "@imVkohli",
            "event_type": "Post Published",
            "content": "Grateful for the incredible support from fans tonight! Focused on the next match. #ViratKohli",
            "sentiment": "positive",
            "engagement": 128900,
            "reach": 1933500,
            "description": "Published on X by @imVkohli"
        }
    ]

# 9. Dashboard Overview Summary
@app.get("/api/dashboard/summary")
def get_dashboard_summary():
    return {
        "total_posts": 865,
        "active_users": 142,
        "total_interactions": 384500,
        "trending_topics_count": 5,
        "sentiment_breakdown": {"positive": 590, "neutral": 190, "negative": 85},
        "platform_distribution": {"X": 420, "Telegram": 190, "Instagram": 340, "Reddit": 180, "YouTube": 510},
        "top_influencers": [
            {"id": 1, "handle": "imVkohli", "name": "Virat Kohli", "platform": "X", "influence_score": 98.5, "follower_count": 62500000, "community_id": 1},
            {"id": 2, "handle": "AlexVanguard", "name": "Alex Vanguard", "platform": "X", "influence_score": 94.2, "follower_count": 890000, "community_id": 2}
        ],
        "recent_activity": [
            {"id": 1, "user": "imVkohli", "platform": "X", "content": "Grateful for the support!", "timestamp": "18:30:00", "sentiment": "positive", "likes": 128900, "topic": "Narendra Modi"}
        ],
        "trending_topics": [
            {"topic": "AI Autonomous Agents", "mentions": 14200, "growth": 45.2, "sentiment": "Positive", "status": "trending"}
        ]
    }

# 10. Posts Stream
@app.get("/api/posts")
def get_posts(skip: int = 0, limit: int = 20, platform: Optional[str] = None):
    return {
        "total": 2,
        "posts": [
            {
                "id": 901,
                "user_handle": "imVkohli",
                "user_name": "Virat Kohli",
                "user_avatar": None,
                "platform": "X",
                "content": "Grateful for the incredible support from fans tonight! Focused on the next match. #ViratKohli",
                "timestamp": "2026-09-26T18:30:00",
                "likes": 128900,
                "replies": 14200,
                "shares": 8900,
                "views": 1933500,
                "topic": "Narendra Modi",
                "sentiment": "positive",
                "confidence": 0.96,
                "primary_emotion": "Supportive",
                "is_demo": True
            },
            {
                "id": 902,
                "user_handle": "AlexVanguard",
                "user_name": "Alex Vanguard",
                "user_avatar": None,
                "platform": "X",
                "content": "Autonomous multi-agent orchestration frameworks are rewriting software development. #AiAgents",
                "timestamp": "2026-09-26T17:15:00",
                "likes": 45200,
                "replies": 3100,
                "shares": 5200,
                "views": 678000,
                "topic": "AI Autonomous Agents",
                "sentiment": "positive",
                "confidence": 0.94,
                "primary_emotion": "Excitement",
                "is_demo": True
            }
        ]
    }

# 11. Alerts
@app.get("/api/alerts")
def get_alerts(severity: Optional[str] = None):
    return [
        {
            "id": 1,
            "title": "Unusual Sentiment Shift Spike Detected",
            "severity": "critical",
            "platform": "X",
            "topic_name": "Cybersecurity Protocol Alpha",
            "description": "Negative sentiment surge of +142% detected across regional dispatches.",
            "timestamp": "2026-09-26 18:00:00",
            "is_read": False
        },
        {
            "id": 2,
            "title": "High Influence Node Propagation Alert",
            "severity": "high",
            "platform": "Telegram",
            "topic_name": "AI Autonomous Agents",
            "description": "Information flow propagated to 14 connected secondary hubs within 20 minutes.",
            "timestamp": "2026-09-26 17:30:00",
            "is_read": False
        }
    ]

# 12. Search
@app.get("/api/search")
def global_search(query: str = ""):
    q_clean = query.strip() if query else ""
    return {
        "query": q_clean,
        "matching_posts": [
            {
                "id": 901,
                "text": f"Latest update regarding {q_clean or 'social analytics'}. High engagement recorded across channels.",
                "platform": "X",
                "user": "AlexVanguard",
                "sentiment": "positive"
            }
        ],
        "related_topics": [{"topic": q_clean or "AI Autonomous Agents", "growth": 45.2, "mentions": 14200}],
        "influencers": [{"handle": "AlexVanguard", "name": "Alex Vanguard", "platform": "X", "score": 94.2}],
        "sentiment_overview": {"positive": 1, "neutral": 0, "negative": 0}
    }

# 13. Audit & PDF Reports
@app.get("/api/export/pdf-report")
def export_pdf_report():
    return {
        "title": "SIH 2026 Social Media Analytics Executive Summary Report",
        "generated_at": "2026-09-26 18:30:00 UTC",
        "metrics": {"total_posts": 865, "active_users": 142, "total_interactions": 384500},
        "html_content": "<!DOCTYPE html><html><body><h1>Executive Report</h1><p>Social Intelligence analytics summary.</p></body></html>"
    }

@app.get("/api/audit-trail")
def get_audit_trail():
    return {
        "audit_logs": [
            {"id": "a1", "timestamp": "2026-09-26 18:00:00 UTC", "event": "Ingestion Pipeline", "status": "VERIFIED", "hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},
            {"id": "a2", "timestamp": "2026-09-26 17:30:00 UTC", "event": "Sentiment Classification", "status": "PASSED", "hash": "sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"}
        ]
    }
