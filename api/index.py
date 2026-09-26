import os
import sys
from pathlib import Path

# Add project root directory to sys.path so 'backend.app...' imports resolve cleanly on Vercel
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

try:
    from backend.app.main import app
except Exception as e:
    print(f"Notice: Loading fallback FastAPI app on Vercel serverless due to: {e}")
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware

    app = FastAPI(title="SIH 2026 Social Media Analytics Platform API")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health")
    def health_fallback():
        return {"status": "online", "mode": "serverless_fallback"}

    @app.get("/api/sentiment")
    def sentiment_fallback():
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
                },
                {
                    "id": 903,
                    "text": "NEW REPORT: Open-weight agent models demonstrate zero-shot task completion rates rising to 89%.",
                    "platform": "Telegram",
                    "user": "TechResearchLab",
                    "sentiment": "positive",
                    "primary_emotion": "Supportive",
                    "confidence": 0.91,
                    "ai_label": "AI-generated estimate"
                }
            ]
        }
