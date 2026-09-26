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

# Attempt to mount existing backend router
try:
    from backend.app.api.routes import router
    from backend.app.api.image import router as image_router
    app.include_router(router)
    app.include_router(image_router)
except Exception as err:
    print(f"Notice: Main router mounting note: {err}")

# Fallback handlers for full frontend coverage on Vercel serverless
@app.get("/api/health")
def health_fallback():
    return {"status": "online", "mode": "production_serverless"}

@app.get("/api/config/status")
def config_status_fallback():
    return {
        "mode": "DEMO MODE",
        "active_sources": ["X (Twitter)", "Telegram", "Instagram", "Reddit", "YouTube"],
        "has_x_api": False,
        "has_instagram_api": False,
        "has_telegram_api": False,
        "has_openai_api": False
    }

@app.get("/api/timeline")
def timeline_fallback(topic: Optional[str] = None, platform: Optional[str] = None, sentiment: Optional[str] = None):
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
        },
        {
            "id": "t3",
            "timestamp": "2026-09-26 15:45 UTC",
            "topic": "Cybersecurity Protocol Alpha",
            "platform": "Telegram",
            "user_handle": "@TechResearchLab",
            "event_type": "Security Alert",
            "content": "NEW REPORT: Open-weight agent models demonstrate zero-shot task completion rates rising to 89%.",
            "sentiment": "neutral",
            "engagement": 18400,
            "reach": 276000,
            "description": "Published on Telegram by @TechResearchLab"
        },
        {
            "id": "t4",
            "timestamp": "2026-09-26 14:10 UTC",
            "topic": "Green Tech Energy Grid",
            "platform": "Instagram",
            "user_handle": "@EcoEnergyHub",
            "event_type": "Viral Spike",
            "content": "Smart grid edge AI deployment reduces local data center energy consumption by 34%.",
            "sentiment": "positive",
            "engagement": 32100,
            "reach": 481500,
            "description": "Published on Instagram by @EcoEnergyHub"
        }
    ]

@app.get("/api/dashboard/summary")
def dashboard_summary_fallback():
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

@app.get("/api/posts")
def posts_fallback(skip: int = 0, limit: int = 20, platform: Optional[str] = None):
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

@app.get("/api/alerts")
def alerts_fallback(severity: Optional[str] = None):
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
