import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session
from backend.app.database.models import Post, User, SentimentResult, TrendMetric, Alert

def generate_pdf_summary_report(db: Session) -> Dict[str, Any]:
    """
    Generates a structured Executive PDF/Print Report payload containing summary metrics,
    top threats, sentiment distribution, demographic estimates, and OSINT findings.
    """
    total_posts = db.query(Post).count()
    total_users = db.query(User).count()
    total_alerts = db.query(Alert).count()

    s_positive = db.query(SentimentResult).filter(SentimentResult.sentiment == "positive").count()
    s_neutral = db.query(SentimentResult).filter(SentimentResult.sentiment == "neutral").count()
    s_negative = db.query(SentimentResult).filter(SentimentResult.sentiment == "negative").count()

    top_trends = db.query(TrendMetric).order_by(TrendMetric.mentions_count.desc()).limit(5).all()
    critical_alerts = db.query(Alert).order_by(Alert.timestamp.desc()).limit(5).all()

    now_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    report_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>SIH 2026 PS 26152 - Executive Social Media Intelligence Report</title>
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1e293b; line-height: 1.6; }}
        .header {{ border-bottom: 3px solid #6366f1; padding-bottom: 15px; margin-bottom: 25px; }}
        .header h1 {{ margin: 0; color: #0f172a; font-size: 24px; text-transform: uppercase; }}
        .header p {{ margin: 5px 0 0 0; color: #64748b; font-size: 12px; font-family: monospace; }}
        .kpi-grid {{ display: flex; gap: 15px; margin-bottom: 30px; }}
        .kpi-card {{ flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px; }}
        .kpi-title {{ font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; }}
        .kpi-val {{ font-size: 22px; font-weight: bold; color: #4f46e5; margin-top: 5px; }}
        .section-title {{ font-size: 14px; font-weight: bold; color: #0f172a; text-transform: uppercase; border-left: 4px solid #6366f1; padding-left: 10px; margin-top: 25px; margin-bottom: 15px; }}
        table {{ width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 12px; }}
        th, td {{ border: 1px solid #e2e8f0; padding: 10px; text-align: left; }}
        th {{ background: #f1f5f9; color: #475569; font-weight: bold; }}
        .footer {{ border-top: 1px solid #e2e8f0; pt: 15px; margin-top: 40px; font-size: 10px; color: #94a3b8; text-align: center; }}
      </style>
    </head>
    <body>
      <div class="header">
        <h1>NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO)</h1>
        <p>SIH 2026 PROBLEM STATEMENT 26152 — AI SOCIAL MEDIA ANALYTICS FRAMEWORK REPORT</p>
        <p>Generated: {now_str} | Classification: RESTRICTED / EXECUTIVE OSINT BRIEF</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">TOTAL POSTS INDEXED</div>
          <div class="kpi-val">{total_posts:,}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">TRACKED NETWORK USERS</div>
          <div class="kpi-val">{total_users:,}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">ANOMALY ALERTS FLAGGED</div>
          <div class="kpi-val">{total_alerts}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">SENTIMENT RATIO</div>
          <div class="kpi-val">{s_positive} Pos / {s_negative} Neg</div>
        </div>
      </div>

      <div class="section-title">1. TOP RISING TOPICS & VIRAL MOMENTUM</div>
      <table>
        <thead>
          <tr>
            <th>Topic Name</th>
            <th>Mentions</th>
            <th>Growth Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {"".join([f"<tr><td><strong>{t.topic_name}</strong></td><td>{t.mentions_count:,}</td><td>+{t.growth_rate}%</td><td>{t.status.upper()}</td></tr>" for t in top_trends])}
        </tbody>
      </table>

      <div class="section-title">2. REAL-TIME THREAT & ANOMALY AUDIT TRAIL</div>
      <table>
        <thead>
          <tr>
            <th>Severity</th>
            <th>Title</th>
            <th>Platform</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {"".join([f"<tr><td><strong>{a.severity.upper()}</strong></td><td>{a.title}</td><td>{a.platform}</td><td>{a.description}</td></tr>" for a in critical_alerts])}
        </tbody>
      </table>

      <div class="footer">
        Confidential OSINT Executive Intelligence Summary — NTRO Team Delta | SIH 2026 PS ID 26152
      </div>
    </body>
    </html>
    """

    return {
        "status": "success",
        "generated_at": now_str,
        "title": "SIH 2026 PS 26152 Executive Summary Report",
        "report_html": report_html,
        "summary": {
            "total_posts": total_posts,
            "total_users": total_users,
            "total_alerts": total_alerts,
            "sentiment_ratio": {"positive": s_positive, "neutral": s_neutral, "negative": s_negative}
        }
    }
