import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    handle = Column(String, unique=True, index=True)
    name = Column(String)
    platform = Column(String, index=True)  # X, Telegram, Instagram, Reddit, YouTube
    follower_count = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    influence_score = Column(Float, default=0.0)
    community_id = Column(Integer, default=0)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    posts = relationship("Post", back_populates="user")
    comments = relationship("Comment", back_populates="user")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    platform = Column(String, index=True)
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    likes_count = Column(Integer, default=0)
    replies_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    url = Column(String, nullable=True)
    language = Column(String, default="en")
    topic_name = Column(String, index=True, nullable=True)
    is_demo = Column(Boolean, default=True)

    user = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post")
    sentiment = relationship("SentimentResult", back_populates="post", uselist=False)

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    likes_count = Column(Integer, default=0)

    post = relationship("Post", back_populates="comments")
    user = relationship("User", back_populates="comments")

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    source_user_id = Column(Integer, ForeignKey("users.id"))
    target_user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    interaction_type = Column(String)  # mention, reply, share
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class SentimentResult(Base):
    __tablename__ = "sentiment_results"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), unique=True)
    sentiment = Column(String)  # positive, neutral, negative
    confidence = Column(Float, default=0.0)
    excitement = Column(Float, default=0.0)
    anxiety = Column(Float, default=0.0)
    anger = Column(Float, default=0.0)
    supportive = Column(Float, default=0.0)
    against = Column(Float, default=0.0)
    sarcasm = Column(Float, default=0.0)
    primary_emotion = Column(String, default="Supportive")
    analyzed_at = Column(DateTime, default=datetime.datetime.utcnow)

    post = relationship("Post", back_populates="sentiment")

class DemographicResult(Base):
    __tablename__ = "demographic_results"

    id = Column(Integer, primary_key=True, index=True)
    category_type = Column(String)  # age_group, geographic_region, language, professional_interest
    label = Column(String)
    percentage = Column(Float)
    count = Column(Integer)

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String, default="Technology")
    keywords = Column(Text)  # JSON or comma separated string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class TrendMetric(Base):
    __tablename__ = "trend_metrics"

    id = Column(Integer, primary_key=True, index=True)
    topic_name = Column(String, index=True)
    mentions_count = Column(Integer, default=0)
    growth_rate = Column(Float, default=0.0)
    sentiment_score = Column(Float, default=0.0)  # -1.0 to +1.0
    status = Column(String, default="trending")  # trending, rising, falling
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class NetworkEdge(Base):
    __tablename__ = "network_edges"

    id = Column(Integer, primary_key=True, index=True)
    source_user_id = Column(Integer, ForeignKey("users.id"))
    target_user_id = Column(Integer, ForeignKey("users.id"))
    edge_type = Column(String)  # mention, reply, retweet, share
    weight = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    severity = Column(String)  # critical, warning, info
    platform = Column(String)
    topic_name = Column(String)
    description = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    is_read = Column(Boolean, default=False)
