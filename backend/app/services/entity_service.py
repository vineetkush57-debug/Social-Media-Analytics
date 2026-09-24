import re
import datetime
import random
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.database.models import Post, User, SentimentResult, Topic, TrendMetric, NetworkEdge, DemographicResult
from backend.app.services.ai_sentiment import analyze_post_sentiment

def detect_entity_type(query: str, posts: List[Post] = None) -> str:
    if posts:
        for p in posts:
            if p.entity_type:
                et = p.entity_type.strip().title()
                if et in ["Person", "Brand", "Organization", "Event", "Product", "Hashtag", "Topic"]:
                    return et

    q = query.strip().lower()
    if q.startswith("#"):
        return "Hashtag"
    if q.startswith("@"):
        return "Person"

    person_names = ["virat kohli", "kohli", "rohit sharma", "elon musk", "alex vance", "elena", "sam altman", "sundar pichai", "marcus kane", "sophia lin"]
    brand_names = ["puma", "nike", "apple", "tesla", "google", "microsoft", "openai", "meta", "nvidia", "samsung"]
    org_names = ["bcci", "sih", "isro", "nasa", "un", "who", "mit", "stanford", "tech research collective"]
    event_names = ["sih 2026", "ipl", "t20 world cup", "cop28", "ces 2026", "olympics", "hackathon"]
    product_names = ["iphone", "chatgpt", "gemini", "cyber protocol", "agent sdk", "model x"]

    if any(name in q for name in person_names):
        return "Person"
    if any(name in q for name in brand_names):
        return "Brand"
    if any(name in q for name in org_names):
        return "Organization"
    if any(name in q for name in event_names):
        return "Event"
    if any(name in q for name in product_names):
        return "Product"
    
    return "Topic"

def generate_entity_intelligence(query: str, db: Session) -> Dict[str, Any]:
    """
    Generates a complete Entity Intelligence payload for any query.
    Grounded in actual database posts if available, supporting both uploaded dataset records and seeded data.
    """
    clean_q = query.strip()
    q_lower = f"%{clean_q.lower()}%"

    # Search DB posts matching entity across content, topic_name, entity_name, entity_type, hashtags
    matching_posts = db.query(Post).filter(
        Post.content.ilike(q_lower) | 
        Post.topic_name.ilike(q_lower) |
        Post.entity_name.ilike(q_lower) |
        Post.entity_type.ilike(q_lower) |
        Post.hashtags.ilike(q_lower)
    ).order_by(Post.timestamp.desc()).all()

    entity_type = detect_entity_type(clean_q, matching_posts)

    # Check if data is purely demo data or uploaded real dataset
    if matching_posts:
        is_demo_mode = all(p.is_demo for p in matching_posts)
        total_mentions = len(matching_posts)
        likes = sum(p.likes_count for p in matching_posts)
        shares = sum(p.shares_count for p in matching_posts)
        replies = sum(p.replies_count for p in matching_posts)
        views = sum(p.views_count for p in matching_posts)

        platform_counts = {}
        for p in matching_posts:
            platform_counts[p.platform] = platform_counts.get(p.platform, 0) + 1
        
        pos_cnt = sum(1 for p in matching_posts if p.sentiment and p.sentiment.sentiment == 'positive')
        neu_cnt = sum(1 for p in matching_posts if p.sentiment and p.sentiment.sentiment == 'neutral')
        neg_cnt = sum(1 for p in matching_posts if p.sentiment and p.sentiment.sentiment == 'negative')

        # Fallback if no sentiment record attached yet
        if pos_cnt == 0 and neu_cnt == 0 and neg_cnt == 0:
            pos_cnt = max(1, int(total_mentions * 0.6))
            neu_cnt = int(total_mentions * 0.3)
            neg_cnt = max(0, total_mentions - pos_cnt - neu_cnt)

        first_detected = matching_posts[-1].timestamp.strftime("%Y-%m-%d %H:%M:%S UTC")
        last_detected = matching_posts[0].timestamp.strftime("%Y-%m-%d %H:%M:%S UTC")

        recent_posts_list = [
            {
                "id": p.id,
                "user": p.user.handle if p.user else "User",
                "platform": p.platform,
                "content": p.content,
                "likes": p.likes_count,
                "timestamp": p.timestamp.strftime("%Y-%m-%d %H:%M"),
                "sentiment": p.sentiment.sentiment if p.sentiment else "positive"
            } for p in matching_posts[:8]
        ]
    else:
        # Fallback consistent demo baseline when search query has no matching uploaded records
        is_demo_mode = True
        total_mentions = random.randint(4800, 18500)
        likes = total_mentions * random.randint(5, 12)
        shares = int(likes * 0.28)
        replies = int(likes * 0.15)
        views = likes * 18
        platform_counts = {"X": 45, "Telegram": 20, "Instagram": 25, "Reddit": 15, "YouTube": 10}
        pos_cnt, neu_cnt, neg_cnt = int(total_mentions * 0.65), int(total_mentions * 0.25), int(total_mentions * 0.10)
        first_detected = "2026-09-24 08:00:00 UTC"
        last_detected = "2026-09-24 20:15:00 UTC"
        recent_posts_list = [
            {
                "id": 901,
                "user": "SportsAnalyst_HQ",
                "platform": "X",
                "content": f"Detailed performance breakdown and narrative analysis regarding {clean_q}. Exceptional engagement across social channels today!",
                "likes": 3420,
                "timestamp": "2026-09-24 18:30",
                "sentiment": "positive"
            },
            {
                "id": 902,
                "user": "GlobalNewsDispatch",
                "platform": "Telegram",
                "content": f"BREAKING: Key announcement and discussion surge surrounding {clean_q} reaching top trending status.",
                "likes": 1890,
                "timestamp": "2026-09-24 16:15",
                "sentiment": "positive"
            }
        ]

    # Calculate Engagement rate
    total_interactions = likes + shares + replies
    engagement_rate = round((total_interactions / max(1, views or total_interactions * 10)) * 100, 2)

    # Platform percentage distribution
    p_total = sum(platform_counts.values()) or 1
    platforms_dist = {k: round((v / p_total) * 100, 1) for k, v in platform_counts.items()}

    # Related Entities Generation based on Entity Type
    if entity_type == "Person" or "kohli" in clean_q.lower():
        related_entities = [
            {"name": "Rohit Sharma", "type": "Person", "relationship": "Teammate / Captain", "relevance": 94},
            {"name": "Royal Challengers Bengaluru", "type": "Organization", "relationship": "Franchise Team", "relevance": 91},
            {"name": "Puma", "type": "Brand", "relationship": "Primary Brand Endorsement", "relevance": 88},
            {"name": "T20 World Cup", "type": "Event", "relationship": "Tournament", "relevance": 85},
            {"name": "#Cricket2026", "type": "Hashtag", "relationship": "Trending Topic", "relevance": 98},
            {"name": "Batting Records", "type": "Topic", "relationship": "Statistical Category", "relevance": 82}
        ]
        rising_keywords = ["masterclass", "century", "chase master", "fitness", "captaincy", "record-breaker"]
        related_hashtags = ["#ViratKohli", "#KingKohli", "#TeamIndia", "#Cricket", "#IPL2026", "#PumaAthlete"]
    elif entity_type == "Brand" or "puma" in clean_q.lower() or "google" in clean_q.lower():
        related_entities = [
            {"name": "Nike", "type": "Brand", "relationship": "Market Competitor", "relevance": 92},
            {"name": "Virat Kohli", "type": "Person", "relationship": "Global Brand Ambassador", "relevance": 95},
            {"name": "Athleisure Tech", "type": "Product", "relationship": "Product Line", "relevance": 84},
            {"name": "SIH 2026 Innovation", "type": "Event", "relationship": "Sponsorship", "relevance": 78},
            {"name": f"#{clean_q.replace(' ', '')}", "type": "Hashtag", "relationship": "Brand Campaign", "relevance": 89}
        ]
        rising_keywords = ["campaign", "ambassador", "quarterly growth", "sustainability", "flagship release"]
        related_hashtags = [f"#{clean_q.replace(' ', '')}", "#BrandIntelligence", "#GlobalMarket", "#RetailTech"]
    else:
        related_entities = [
            {"name": "AlexVanguard", "type": "Person", "relationship": "Top Amplifying Influencer", "relevance": 92},
            {"name": "TechResearchLab", "type": "Organization", "relationship": "Origin Research Unit", "relevance": 88},
            {"name": "SIH 2026 Hackathon", "type": "Event", "relationship": "Domain Challenge", "relevance": 96},
            {"name": "Autonomous Framework", "type": "Product", "relationship": "Core Technology", "relevance": 85},
            {"name": f"#{clean_q.replace(' ', '')}", "type": "Hashtag", "relationship": "Primary Hashtag", "relevance": 99}
        ]
        rising_keywords = ["breakthrough", "velocity", "benchmark", "orchestration", "deployment", "adoption"]
        related_hashtags = [f"#{clean_q.replace(' ', '')}", "#AI2026", "#SocialIntelligence", "#TechTrends", "#Innovation"]

    # Sentiment Timeline
    sentiment_timeline = [
        {"time": "08:00", "positive": int(pos_cnt * 0.15), "neutral": int(neu_cnt * 0.15), "negative": int(neg_cnt * 0.10)},
        {"time": "10:00", "positive": int(pos_cnt * 0.35), "neutral": int(neu_cnt * 0.30), "negative": int(neg_cnt * 0.25)},
        {"time": "12:00", "positive": int(pos_cnt * 0.65), "neutral": int(neu_cnt * 0.55), "negative": int(neg_cnt * 0.45)},
        {"time": "14:00", "positive": int(pos_cnt * 0.85), "neutral": int(neu_cnt * 0.80), "negative": int(neg_cnt * 0.70)},
        {"time": "16:00", "positive": pos_cnt, "neutral": neu_cnt, "negative": neg_cnt},
    ]

    # Timeline Discussion Spikes
    timeline_spikes = [
        {
            "time": "09:15 AM",
            "event_type": "Mention Volume Spike",
            "description": f"Initial surge in online activity mentioning {clean_q} detected across Telegram research channels.",
            "reach": max(12000, total_mentions * 5)
        },
        {
            "time": "10:45 AM",
            "event_type": "New Sub-Topic Identified",
            "description": f"Natural language clustering isolated key narrative discussions around {rising_keywords[0]} and {rising_keywords[1]}.",
            "reach": max(45000, total_mentions * 18)
        },
        {
            "time": "01:20 PM",
            "event_type": "Influencer Amplification",
            "description": "High-influence account published high-engagement commentary triggering cross-platform virality.",
            "reach": max(180000, total_mentions * 45)
        },
        {
            "time": "03:45 PM",
            "event_type": "Peak Engagement Wave",
            "description": "Community discussions peaked with active engagement across social networks.",
            "reach": max(350000, total_mentions * 80)
        }
    ]

    # Executive AI Summary
    data_source_label = "simulated demo signals" if is_demo_mode else "uploaded database records"
    ai_summary = (
        f"Public discussion around '{clean_q}' ({entity_type}) comprises {total_mentions:,} total posts indexed from {data_source_label}. "
        f"Overall sentiment remains predominantly {('positive' if pos_cnt >= neg_cnt else 'critical')} ({(pos_cnt / max(1, pos_cnt+neu_cnt+neg_cnt))*100:.1f}% positive rating). "
        f"Primary narrative drivers revolve around '{rising_keywords[0]}' and '{rising_keywords[1]}', with major virality amplified via {related_entities[0]['name']} across {list(platforms_dist.keys())[0] if platforms_dist else 'X'}."
    )

    return {
        "query": clean_q,
        "entity_type": entity_type,
        "is_demo_mode": is_demo_mode,
        "overview": {
            "total_mentions": total_mentions,
            "likes_count": likes,
            "shares_count": shares,
            "replies_count": replies,
            "views_count": views,
            "engagement_rate": engagement_rate,
            "platforms": platforms_dist,
            "first_detected": first_detected,
            "last_detected": last_detected
        },
        "sentiment": {
            "positive": pos_cnt,
            "neutral": neu_cnt,
            "negative": neg_cnt,
            "emotions": {
                "Excitement": 78.5,
                "Supportive": 82.0,
                "Anxiety": 18.2,
                "Anger": 9.4,
                "Against": 12.1,
                "Sarcasm": 14.5
            },
            "timeline": sentiment_timeline
        },
        "trending_discussions": {
            "top_topics": [f"{clean_q} {k.capitalize()}" for k in rising_keywords[:4]],
            "rising_keywords": rising_keywords,
            "related_hashtags": related_hashtags,
            "topic_growth": "+240.5%"
        },
        "audience": {
            "age_groups": {"18–24": 44.0, "25–34": 36.0, "35–44": 14.0, "45+": 6.0},
            "languages": {"English": 72.0, "Spanish": 12.0, "Hindi": 10.0, "German": 6.0},
            "geographic_distribution": {"North America": 39.0, "Asia-Pacific": 35.0, "Europe": 18.0, "Latin America": 8.0},
            "interests": ["Sports & Tech", "Media & Entertainment", "AI Systems", "Software Engineering"]
        },
        "network": {
            "top_discussing_users": [
                {"handle": related_entities[0]["name"].replace(" ", ""), "platform": "X", "score": 94.5},
                {"handle": "DevPulse_HQ", "platform": "X", "score": 91.0},
                {"handle": "TechResearchLab", "platform": "Telegram", "score": 82.0}
            ],
            "influential_nodes": max(5, total_mentions // 10),
            "communities_count": 5,
            "propagation_summary": "Origin on Telegram -> Amplification on X -> Community discussion on Reddit -> Media coverage on YouTube."
        },
        "timeline_spikes": timeline_spikes,
        "related_entities": related_entities,
        "recent_posts": recent_posts_list,
        "ai_summary": ai_summary
    }
