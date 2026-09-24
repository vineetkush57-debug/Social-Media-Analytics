import re
import math
from textblob import TextBlob

def analyze_post_sentiment(text: str) -> dict:
    """
    Analyzes sentiment (positive, neutral, negative) and estimates fine-grained emotions
    (Excitement, Anxiety, Anger, Supportive, Against, Sarcasm) with confidence rating.
    """
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1.0 to 1.0
    subjectivity = blob.sentiment.subjectivity  # 0.0 to 1.0

    lower_text = text.lower()

    # Determine core sentiment category
    if polarity > 0.15:
        sentiment = "positive"
        confidence = min(0.98, 0.65 + polarity * 0.35)
    elif polarity < -0.15:
        sentiment = "negative"
        confidence = min(0.98, 0.65 + abs(polarity) * 0.35)
    else:
        sentiment = "neutral"
        confidence = min(0.95, 0.70 + (1.0 - subjectivity) * 0.25)

    # Keyword and structural emotion heuristics
    excitement_words = ["amazing", "revolution", "breakthrough", "future", "insane", "incredible", "game-changer", "hyped", "love", "awesome"]
    anxiety_words = ["risk", "fear", "danger", "threat", "uncertain", "worry", "alarm", "crisis", "vulnerability"]
    anger_words = ["terrible", "scam", "worst", "fail", "horrible", "outrage", "disaster", "hate", "corrupt"]
    supportive_words = ["agree", "support", "great work", "solid", "kudos", "proud", "forward", "promising"]
    against_words = ["reject", "oppose", "ban", "stop", "against", "flawed", "overrated"]
    sarcasm_words = ["yeah right", "surely", "totally safe", "what could go wrong", "genius move", "obviously", "brilliant strategy"]

    excitement = sum(1 for w in excitement_words if w in lower_text) * 0.25 + (polarity if polarity > 0 else 0) * 0.5
    anxiety = sum(1 for w in anxiety_words if w in lower_text) * 0.3 + (subjectivity * 0.3 if polarity < 0 else 0)
    anger = sum(1 for w in anger_words if w in lower_text) * 0.35 + (abs(polarity) if polarity < -0.3 else 0) * 0.5
    supportive = sum(1 for w in supportive_words if w in lower_text) * 0.3 + (polarity if polarity > 0 else 0) * 0.4
    against = sum(1 for w in against_words if w in lower_text) * 0.35 + (abs(polarity) if polarity < 0 else 0) * 0.4
    sarcasm = sum(1 for w in sarcasm_words if w in lower_text) * 0.4 + (0.2 if "?" in text and "!" in text else 0)

    # Base baseline normalization
    excitement = round(min(1.0, max(0.05, excitement + 0.1)), 2)
    anxiety = round(min(1.0, max(0.05, anxiety + 0.05)), 2)
    anger = round(min(1.0, max(0.05, anger + 0.05)), 2)
    supportive = round(min(1.0, max(0.1, supportive + 0.15)), 2)
    against = round(min(1.0, max(0.05, against + 0.05)), 2)
    sarcasm = round(min(1.0, max(0.02, sarcasm + 0.02)), 2)

    # Determine primary emotion
    emotions_map = {
        "Excitement": excitement,
        "Anxiety": anxiety,
        "Anger": anger,
        "Supportive": supportive,
        "Against": against,
        "Sarcasm": sarcasm,
    }
    primary_emotion = max(emotions_map, key=emotions_map.get)

    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 2),
        "excitement": excitement,
        "anxiety": anxiety,
        "anger": anger,
        "supportive": supportive,
        "against": against,
        "sarcasm": sarcasm,
        "primary_emotion": primary_emotion
    }
