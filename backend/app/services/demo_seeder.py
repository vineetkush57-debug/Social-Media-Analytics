import random
import datetime
from sqlalchemy.orm import Session
from backend.app.database.models import (
    User, Post, Comment, Interaction, SentimentResult,
    DemographicResult, Topic, TrendMetric, NetworkEdge, Alert
)
from backend.app.services.ai_sentiment import analyze_post_sentiment

DEMO_USERS_DATA = [
    {"handle": "AlexVanguard", "name": "Alex Vance", "platform": "X", "follower_count": 485000, "verified": True, "influence_score": 94.5, "community_id": 1, "bio": "AI Systems Architect & Tech Futurist."},
    {"handle": "ElenaData", "name": "Elena Rostova", "platform": "X", "follower_count": 210000, "verified": True, "influence_score": 88.2, "community_id": 1, "bio": "Data Scientist | NLP & Knowledge Graphs."},
    {"handle": "TechResearchLab", "name": "Tech Research Collective", "platform": "Telegram", "follower_count": 142000, "verified": False, "influence_score": 82.0, "community_id": 2, "bio": "Deep tech dispatches and open benchmarks."},
    {"handle": "DevPulse_HQ", "name": "DevPulse", "platform": "X", "follower_count": 390000, "verified": True, "influence_score": 91.0, "community_id": 1, "bio": "Global software engineer news and trends."},
    {"handle": "CyberSentinel", "name": "Marcus Kane", "platform": "Reddit", "follower_count": 95000, "verified": False, "influence_score": 79.4, "community_id": 3, "bio": "Cybersecurity researcher & white-hat auditor."},
    {"handle": "AIVisualizer", "name": "Sophia Lin", "platform": "Instagram", "follower_count": 310000, "verified": True, "influence_score": 86.7, "community_id": 4, "bio": "Creating visual explanations of neural networks."},
    {"handle": "FutureTechBytes", "name": "David Miller", "platform": "YouTube", "follower_count": 890000, "verified": True, "influence_score": 96.1, "community_id": 2, "bio": "Weekly tech breakdowns & deep dives."},
    {"handle": "CodeArtisan", "name": "Rahul Sharma", "platform": "Reddit", "follower_count": 64000, "verified": False, "influence_score": 73.8, "community_id": 3, "bio": "Full-stack developer building open source tools."},
    {"handle": "CryptoQuantum", "name": "SatoshiN", "platform": "Telegram", "follower_count": 118000, "verified": False, "influence_score": 77.2, "community_id": 5, "bio": "Quantum cryptography and decentralized consensus."},
    {"handle": "EthicsInAI", "name": "Dr. Sarah Chen", "platform": "X", "follower_count": 175000, "verified": True, "influence_score": 84.9, "community_id": 1, "bio": "Research fellow in AI alignment & safety policies."},
    {"handle": "imVkohli", "name": "Virat Kohli", "platform": "X", "follower_count": 62000000, "verified": True, "influence_score": 99.8, "community_id": 4, "bio": "Athlete | Indian Cricketer | Puma Brand Ambassador."}
]

DEMO_POSTS_DATA = [
    {
        "user_handle": "imVkohli",
        "platform": "X",
        "topic_name": "Cricket & Sports",
        "entity_name": "Virat Kohli",
        "entity_type": "Person",
        "content": "Grateful for the incredible support from fans tonight! Focused on the next match and putting our best foot forward. #ViratKohli #TeamIndia #Cricket",
        "likes_count": 245000,
        "replies_count": 18200,
        "shares_count": 42000,
        "views_count": 4800000
    },
    {
        "user_handle": "AlexVanguard",
        "platform": "X",
        "topic_name": "AI Autonomous Agents",
        "entity_name": "AI Agents",
        "entity_type": "Technology",
        "content": "Autonomous multi-agent orchestration frameworks are rewriting software development. The performance jumps we are seeing this week are unprecedented. @DevPulse_HQ #AiAgents #Tech2026",
        "likes_count": 4210,
        "replies_count": 530,
        "shares_count": 1420,
        "views_count": 189000
    },
    {
        "user_handle": "ElenaData",
        "platform": "X",
        "topic_name": "AI Autonomous Agents",
        "entity_name": "AI Agents",
        "entity_type": "Technology",
        "content": "Benchmarking autonomous reasoning across 50,000 tasks. The confidence score calibration in these modern multi-agent systems is genuinely impressive. @AlexVanguard #AI #NLP",
        "likes_count": 2840,
        "replies_count": 190,
        "shares_count": 680,
        "views_count": 94000
    },
    {
        "user_handle": "TechResearchLab",
        "platform": "Telegram",
        "topic_name": "AI Autonomous Agents",
        "entity_name": "AI Research",
        "entity_type": "Topic",
        "content": "NEW REPORT: Open-weight agent models demonstrate zero-shot task completion rates rising from 42% to 89% in controlled benchmark environments.",
        "likes_count": 3900,
        "replies_count": 410,
        "shares_count": 1150,
        "views_count": 125000
    },
    {
        "user_handle": "DevPulse_HQ",
        "platform": "X",
        "topic_name": "AI Autonomous Agents",
        "entity_name": "DevOps",
        "entity_type": "Domain",
        "content": "Major shift in tech stack adoption: 68% of enterprise engineering teams report integrating autonomous agent workflows in Q3 2026. @AlexVanguard #DevOps #SoftwareEngineering",
        "likes_count": 5120,
        "replies_count": 640,
        "shares_count": 1890,
        "views_count": 240000
    },
    {
        "user_handle": "CyberSentinel",
        "platform": "Reddit",
        "topic_name": "Cybersecurity Protocol Alpha",
        "entity_name": "Cybersecurity",
        "entity_type": "Domain",
        "content": "Detailed vulnerability breakdown of legacy authentication protocols under quantum-resistant encryption audits. Everyone needs to patch immediately.",
        "likes_count": 1850,
        "replies_count": 310,
        "shares_count": 490,
        "views_count": 67000
    },
    {
        "user_handle": "AIVisualizer",
        "platform": "Instagram",
        "topic_name": "AI Autonomous Agents",
        "entity_name": "AI Agents",
        "entity_type": "Technology",
        "content": "Visualizing how autonomous agents plan, delegate, and execute complex code refactoring across microservices! Swipe for the complete flow diagram 📊✨ @imVkohli",
        "likes_count": 8940,
        "replies_count": 480,
        "shares_count": 2100,
        "views_count": 310000
    },
    {
        "user_handle": "FutureTechBytes",
        "platform": "YouTube",
        "topic_name": "AI Autonomous Agents",
        "entity_name": "AI Research",
        "entity_type": "Topic",
        "content": "The Future of Autonomous AI Systems: How 2026 AI Agents Are Replacing Static Automation [Deep Dive Video & Full Source Code]",
        "likes_count": 15400,
        "replies_count": 1280,
        "shares_count": 4300,
        "views_count": 520000
    },
    {
        "user_handle": "EthicsInAI",
        "platform": "X",
        "topic_name": "AI Autonomous Agents",
        "entity_name": "AI Ethics",
        "entity_type": "Topic",
        "content": "While autonomous agent velocity is staggering, guardrails and human oversight remain essential. We cannot trade auditability for speed. @ElenaData #AIEthics",
        "likes_count": 3100,
        "replies_count": 420,
        "shares_count": 910,
        "views_count": 112000
    },
    {
        "user_handle": "CryptoQuantum",
        "platform": "Telegram",
        "topic_name": "Quantum Computing Paradigm",
        "entity_name": "Quantum",
        "entity_type": "Technology",
        "content": "Quantum supremacy claims verified in key distribution protocols. Zero-knowledge cryptography is officially essential.",
        "likes_count": 1450,
        "replies_count": 180,
        "shares_count": 390,
        "views_count": 45000
    },
    {
        "user_handle": "CodeArtisan",
        "platform": "Reddit",
        "topic_name": "Green Tech Energy Grid",
        "entity_name": "CleanTech",
        "entity_type": "Domain",
        "content": "Smart grid analytics powered by edge AI reduced local datacenter energy waste by 34%. Here is the open-source hardware schematic.",
        "likes_count": 2100,
        "replies_count": 240,
        "shares_count": 560,
        "views_count": 78000
    }
]

def seed_database(db: Session) -> bool:
    """
    Clears existing records and seeds rich, realistic, internally consistent demo data.
    """
    try:
        # Clear existing demo records while preserving user-uploaded non-demo posts
        db.query(Alert).delete()
        db.query(NetworkEdge).delete()
        db.query(TrendMetric).delete()
        db.query(Topic).delete()
        db.query(DemographicResult).delete()
        db.query(SentimentResult).filter(SentimentResult.post.has(Post.is_demo == True)).delete(synchronize_session=False)
        db.query(Interaction).delete()
        db.query(Comment).filter(Comment.post.has(Post.is_demo == True)).delete(synchronize_session=False)
        db.query(Post).filter(Post.is_demo == True).delete(synchronize_session=False)
        db.commit()

        # 1. Seed Users
        user_objects = {}
        for udata in DEMO_USERS_DATA:
            user = db.query(User).filter(User.handle == udata["handle"]).first()
            if not user:
                user = User(
                    handle=udata["handle"],
                    name=udata["name"],
                    platform=udata["platform"],
                    follower_count=udata["follower_count"],
                    verified=udata["verified"],
                    influence_score=udata["influence_score"],
                    community_id=udata["community_id"],
                    bio=udata["bio"],
                    avatar_url=f"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                )
                db.add(user)
            else:
                user.name = udata["name"]
                user.platform = udata["platform"]
                user.follower_count = udata["follower_count"]
                user.verified = udata["verified"]
                user.influence_score = udata["influence_score"]
                user.community_id = udata["community_id"]
                user.bio = udata["bio"]
            db.flush()
            user_objects[udata["handle"]] = user

        # 2. Seed Topics
        topics_data = [
            {"name": "AI Autonomous Agents", "category": "AI / ML", "keywords": '["agent", "autonomous", "orchestration", "llm", "benchmark"]'},
            {"name": "Cricket & Sports", "category": "Sports", "keywords": '["cricket", "kohli", "teamindia", "ipl", "match"]'},
            {"name": "Cybersecurity Protocol Alpha", "category": "Security", "keywords": '["encryption", "vulnerability", "patch", "zero-trust", "quantum"]'},
            {"name": "Green Tech Energy Grid", "category": "CleanTech", "keywords": '["edge-ai", "energy", "grid", "sustainability", "hardware"]'},
            {"name": "Quantum Computing Paradigm", "category": "Hardware", "keywords": '["quantum", "cryptography", "zero-knowledge", "supremacy"]'},
            {"name": "DeCentralized FinTech", "category": "Finance", "keywords": '["defi", "consensus", "smart-contract", "tokenomics"]'}
        ]
        for tdata in topics_data:
            topic = Topic(name=tdata["name"], category=tdata["category"], keywords=tdata["keywords"])
            db.add(topic)

        # 3. Seed Posts & Sentiment
        now = datetime.datetime.utcnow()
        post_objects = []
        for idx, pdata in enumerate(DEMO_POSTS_DATA):
            u_obj = user_objects.get(pdata["user_handle"])
            time_offset = datetime.timedelta(hours=idx * 2)
            post = Post(
                user_id=u_obj.id if u_obj else 1,
                platform=pdata["platform"],
                content=pdata["content"],
                timestamp=now - time_offset,
                likes_count=pdata["likes_count"],
                replies_count=pdata["replies_count"],
                shares_count=pdata["shares_count"],
                views_count=pdata["views_count"],
                topic_name=pdata["topic_name"],
                entity_name=pdata.get("entity_name"),
                entity_type=pdata.get("entity_type"),
                hashtags="#Cricket #ViratKohli #AI" if "Kohli" in pdata["content"] else "#AI #Tech2026",
                is_demo=True
            )
            db.add(post)
            db.flush()
            post_objects.append(post)

            # Analyze sentiment and store
            sent_analysis = analyze_post_sentiment(pdata["content"])
            sentiment_res = SentimentResult(
                post_id=post.id,
                sentiment=sent_analysis["sentiment"],
                confidence=sent_analysis["confidence"],
                excitement=sent_analysis["excitement"],
                anxiety=sent_analysis["anxiety"],
                anger=sent_analysis["anger"],
                supportive=sent_analysis["supportive"],
                against=sent_analysis["against"],
                sarcasm=sent_analysis["sarcasm"],
                primary_emotion=sent_analysis["primary_emotion"]
            )
            db.add(sentiment_res)

            # Add comments
            c1 = Comment(
                post_id=post.id,
                user_id=random.choice(list(user_objects.values())).id,
                content="Totally agree with this breakdown! The speed of iteration is insane.",
                timestamp=now - time_offset + datetime.timedelta(minutes=15),
                likes_count=45
            )
            c2 = Comment(
                post_id=post.id,
                user_id=random.choice(list(user_objects.values())).id,
                content="What are the implications for legacy infrastructure safety though?",
                timestamp=now - time_offset + datetime.timedelta(minutes=30),
                likes_count=18
            )
            db.add(c1)
            db.add(c2)

        # 4. Seed Demographics
        demo_records = [
            # Age
            ("age_group", "18-24", 32.0, 14400),
            ("age_group", "25-34", 28.0, 12600),
            ("age_group", "35-44", 18.0, 8100),
            ("age_group", "45-54", 12.0, 5400),
            ("age_group", "55+", 10.0, 4500),
            # Geo
            ("geographic_region", "Central India", 31.0, 13950),
            ("geographic_region", "North India", 24.0, 10800),
            ("geographic_region", "West India", 19.0, 8550),
            ("geographic_region", "South India", 16.0, 7200),
            ("geographic_region", "East India", 10.0, 4500),
            # Language
            ("language", "English", 38.0, 17100),
            ("language", "Hindi", 34.0, 15300),
            ("language", "Hinglish", 18.0, 8100),
            ("language", "Other", 10.0, 4500),
            # Interests
            ("professional_interest", "Technology", 30.0, 13500),
            ("professional_interest", "Sports", 24.0, 10800),
            ("professional_interest", "Business", 18.0, 8100),
            ("professional_interest", "Education", 16.0, 7200),
            ("professional_interest", "Entertainment", 12.0, 5400),
        ]
        for cat, lbl, pct, cnt in demo_records:
            d_res = DemographicResult(category_type=cat, label=lbl, percentage=pct, count=cnt)
            db.add(d_res)

        # 5. Seed Trend Metrics
        trends_data = [
            {"topic_name": "Virat Kohli", "mentions_count": 8940, "growth_rate": 310.5, "sentiment_score": 0.88, "status": "trending"},
            {"topic_name": "AI Autonomous Agents", "mentions_count": 4280, "growth_rate": 240.5, "sentiment_score": 0.78, "status": "trending"},
            {"topic_name": "Cybersecurity Protocol Alpha", "mentions_count": 2150, "growth_rate": 115.2, "sentiment_score": -0.32, "status": "rising"},
            {"topic_name": "Green Tech Energy Grid", "mentions_count": 1840, "growth_rate": 84.0, "sentiment_score": 0.65, "status": "rising"},
            {"topic_name": "Quantum Computing Paradigm", "mentions_count": 950, "growth_rate": -12.4, "sentiment_score": 0.45, "status": "falling"},
            {"topic_name": "DeCentralized FinTech", "mentions_count": 1120, "growth_rate": -28.0, "sentiment_score": 0.12, "status": "falling"}
        ]
        for tr in trends_data:
            t_metric = TrendMetric(
                topic_name=tr["topic_name"],
                mentions_count=tr["mentions_count"],
                growth_rate=tr["growth_rate"],
                sentiment_score=tr["sentiment_score"],
                status=tr["status"]
            )
            db.add(t_metric)

        # 6. Seed Interactions & Network Edges
        u_list = list(user_objects.values())
        interaction_types = ["mention", "reply", "share", "interaction"]
        for i in range(len(u_list)):
            for j in range(len(u_list)):
                if i != j and (i + j) % 2 == 0:
                    src = u_list[i]
                    tgt = u_list[j]
                    itype = random.choice(interaction_types)
                    edge_type = "mention" if itype == "mention" else ("reply" if itype == "reply" else "retweet")
                    
                    # Add Interaction
                    db.add(Interaction(
                        source_user_id=src.id,
                        target_user_id=tgt.id,
                        post_id=post_objects[0].id if post_objects else None,
                        interaction_type=itype,
                        timestamp=now - datetime.timedelta(hours=random.randint(1, 48))
                    ))

                    # Add NetworkEdge
                    db.add(NetworkEdge(
                        source_user_id=src.id,
                        target_user_id=tgt.id,
                        edge_type=edge_type,
                        weight=random.randint(1, 15)
                    ))

        # 7. Seed Alerts
        alerts_list = [
            {
                "title": "Viral Engagement Spike: Virat Kohli",
                "severity": "critical",
                "platform": "X",
                "topic_name": "Virat Kohli",
                "description": "Mentions & retweets jumped +310% in the last 2 hours following live match performance."
            },
            {
                "title": "Rapid Trend Spike: AI Autonomous Agents",
                "severity": "critical",
                "platform": "X",
                "topic_name": "AI Autonomous Agents",
                "description": "Mentions surged +240% in the last 2 hours following multi-agent benchmark releases."
            },
            {
                "title": "Negative Sentiment Spike Detected",
                "severity": "warning",
                "platform": "Reddit",
                "topic_name": "Cybersecurity Protocol Alpha",
                "description": "Anxiety and vulnerability keywords increased 48% in technical subreddits."
            },
            {
                "title": "High Influence User Activity",
                "severity": "info",
                "platform": "YouTube",
                "topic_name": "AI Autonomous Agents",
                "description": "@FutureTechBytes published deep-dive reaching 520,000 views within 3 hours."
            }
        ]
        for al in alerts_list:
            alert = Alert(
                title=al["title"],
                severity=al["severity"],
                platform=al["platform"],
                topic_name=al["topic_name"],
                description=al["description"],
                timestamp=now - datetime.timedelta(minutes=random.randint(10, 120))
            )
            db.add(alert)

        db.commit()
        return True
    except Exception as ex:
        db.rollback()
        print(f"Error seeding demo database: {ex}")
        return False
