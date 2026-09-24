from typing import Dict, Any, List

def trace_information_propagation(topic_name: str = "AI Autonomous Agents") -> Dict[str, Any]:
    """
    Returns the multi-stage propagation cascade and viral velocity curve for a topic.
    """
    cascade_steps = [
        {
            "stage": "ORIGIN",
            "timestamp": "08:00 AM",
            "actor": "@TechResearchLab",
            "platform": "Telegram",
            "description": "Initial whitepaper benchmark published on encrypted channel.",
            "reach": 1200,
            "sentiment_shift": "Neutral (+0.05)"
        },
        {
            "stage": "AMPLIFICATION",
            "timestamp": "09:15 AM",
            "actor": "@DevPulse_HQ",
            "platform": "X",
            "description": "Cross-posted summary thread with code snippet demonstration.",
            "reach": 45000,
            "sentiment_shift": "Positive (+0.42)"
        },
        {
            "stage": "INFLUENCERS",
            "timestamp": "10:30 AM",
            "actor": "@AlexVanguard",
            "platform": "X",
            "description": "Key tech influencer quote-tweeted: 'This is the biggest leap in multi-agent systems this year.'",
            "reach": 380000,
            "sentiment_shift": "Highly Positive (+0.88)"
        },
        {
            "stage": "COMMUNITIES",
            "timestamp": "11:45 AM",
            "actor": "r/ArtificialIntelligence",
            "platform": "Reddit",
            "description": "Front-page discussion thread pinned with 1,400+ comments.",
            "reach": 850000,
            "sentiment_shift": "Mixed / Excited (+0.65)"
        },
        {
            "stage": "SPREAD",
            "timestamp": "01:00 PM",
            "actor": "TechDaily Global",
            "platform": "YouTube",
            "description": "Video deep-dive published, causing secondary viral wave across Instagram & X.",
            "reach": 2400000,
            "sentiment_shift": "Strong Consensus (+0.75)"
        }
    ]

    timeline_series = [
        {"time": "08:00", "velocity": 120, "mentions": 120, "sentiment": 0.1},
        {"time": "09:00", "velocity": 850, "mentions": 970, "sentiment": 0.4},
        {"time": "10:00", "velocity": 3400, "mentions": 4370, "sentiment": 0.7},
        {"time": "11:00", "velocity": 8900, "mentions": 13270, "sentiment": 0.85},
        {"time": "12:00", "velocity": 14200, "mentions": 27470, "sentiment": 0.82},
        {"time": "13:00", "velocity": 18500, "mentions": 45970, "sentiment": 0.78},
        {"time": "14:00", "velocity": 12400, "mentions": 58370, "sentiment": 0.75},
        {"time": "15:00", "velocity": 8100, "mentions": 66470, "sentiment": 0.72}
    ]

    return {
        "topic": topic_name,
        "origin_user": "@TechResearchLab",
        "origin_platform": "Telegram",
        "first_detected": "08:00 AM UTC",
        "peak_activity": "01:00 PM UTC",
        "major_amplifier": "@AlexVanguard",
        "communities_reached": 6,
        "total_cascade_reach": 3676200,
        "cascade_steps": cascade_steps,
        "timeline_series": timeline_series
    }
