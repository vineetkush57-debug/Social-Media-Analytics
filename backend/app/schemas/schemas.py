from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    handle: str
    name: str
    platform: str
    follower_count: int = 0
    verified: bool = False
    influence_score: float = 0.0
    community_id: int = 0
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class SentimentSchema(BaseModel):
    sentiment: str
    confidence: float
    excitement: float
    anxiety: float
    anger: float
    supportive: float
    against: float
    sarcasm: float
    primary_emotion: str

class PostBase(BaseModel):
    user_id: int
    platform: str
    content: str
    likes_count: int = 0
    replies_count: int = 0
    shares_count: int = 0
    views_count: int = 0
    url: Optional[str] = None
    language: str = "en"
    topic_name: Optional[str] = None

class PostResponse(PostBase):
    id: int
    timestamp: datetime
    is_demo: bool
    user: Optional[UserResponse] = None
    sentiment: Optional[SentimentSchema] = None
    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    total_posts: int
    active_users: int
    total_interactions: int
    trending_topics_count: int
    sentiment_breakdown: Dict[str, int]
    platform_distribution: Dict[str, int]
    top_influencers: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
    trending_topics: List[Dict[str, Any]]

class SentimentSummaryResponse(BaseModel):
    distribution: Dict[str, int]
    emotions: Dict[str, float]
    timeline: List[Dict[str, Any]]
    platform_wise: Dict[str, Dict[str, int]]
    topic_wise: Dict[str, Dict[str, int]]
    recent_analyzed: List[Dict[str, Any]]

class DemographicSummaryResponse(BaseModel):
    age_brackets: Dict[str, float]
    geographic_distribution: Dict[str, float]
    languages: Dict[str, float]
    professional_interests: Dict[str, float]
    disclaimer: str

class TrendItem(BaseModel):
    topic: str
    category: str
    mentions: int
    growth: float
    sentiment: str
    status: str  # trending, rising, falling
    first_detected: str
    forecast_score: float

class NetworkNode(BaseModel):
    id: str
    label: str
    platform: str
    followers: int
    influence_score: float
    community: int
    degree_centrality: float
    betweenness_centrality: float
    pagerank: float

class NetworkEdgeSchema(BaseModel):
    source: str
    target: str
    type: str
    weight: int

class NetworkResponse(BaseModel):
    nodes: List[NetworkNode]
    edges: List[NetworkEdgeSchema]
    communities_count: int
    top_hub_user: str

class PropagationCascadeStep(BaseModel):
    stage: str  # ORIGIN, AMPLIFICATION, INFLUENCERS, COMMUNITIES, SPREAD
    timestamp: str
    actor: str
    platform: str
    description: str
    reach: int
    sentiment_shift: str

class PropagationResponse(BaseModel):
    topic: str
    origin_user: str
    origin_platform: str
    first_detected: str
    peak_activity: str
    major_amplifier: str
    communities_reached: int
    total_cascade_reach: int
    cascade_steps: List[PropagationCascadeStep]
    timeline_series: List[Dict[str, Any]]

class TimelineEvent(BaseModel):
    id: int
    timestamp: str
    topic: str
    platform: str
    user_handle: str
    event_type: str
    content: str
    sentiment: str
    reach: int

class AlertItem(BaseModel):
    id: int
    title: str
    severity: str
    platform: str
    topic_name: str
    description: str
    timestamp: str
    is_read: bool

class SearchResponse(BaseModel):
    query: str
    matching_posts: List[Dict[str, Any]]
    related_topics: List[Dict[str, Any]]
    influencers: List[Dict[str, Any]]
    sentiment_overview: Dict[str, int]
