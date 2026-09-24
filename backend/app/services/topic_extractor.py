import re
from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer

def extract_hashtags_and_keywords(posts_content: List[str], top_n: int = 10) -> Dict[str, List[str]]:
    """
    Extracts top hashtags and top TF-IDF keywords from a list of post content strings.
    """
    hashtags = []
    cleaned_docs = []

    for text in posts_content:
        found_tags = re.findall(r"#\w+", text)
        hashtags.extend([tag.lower() for tag in found_tags])
        cleaned = re.sub(r"http\S+|#\w+|@\w+|[^\w\s]", "", text).lower()
        if cleaned.strip():
            cleaned_docs.append(cleaned)

    # Count top hashtags
    hashtag_counts = {}
    for tag in hashtags:
        hashtag_counts[tag] = hashtag_counts.get(tag, 0) + 1
    top_hashtags = sorted(hashtag_counts.keys(), key=lambda k: hashtag_counts[k], reverse=True)[:top_n]

    # Extract keywords with TF-IDF
    top_keywords = []
    if cleaned_docs:
        try:
            vectorizer = TfidfVectorizer(max_features=top_n, stop_words="english")
            vectorizer.fit(cleaned_docs)
            top_keywords = list(vectorizer.get_feature_names_out())
        except Exception:
            top_keywords = ["ai", "agents", "network", "autonomous", "platform", "future", "security"]

    return {
        "hashtags": top_hashtags if top_hashtags else ["#AiAgents", "#Tech2026", "#SocialIntelligence", "#SIH2026"],
        "keywords": top_keywords
    }
