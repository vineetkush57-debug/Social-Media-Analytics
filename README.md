# SIH 2026 Social Media Analytics Platform (#26152)

> Production-Style AI Social Intelligence Prototype for **Smart India Hackathon (SIH) 2026**

---

## 🌟 Overview

The **SIH 2026 Social Media Analytics Platform** is a full-stack AI-powered intelligence platform built for real-time conversation monitoring, emerging trend detection, sentiment and emotion classification, network influence mapping, audience clustering, and multi-stage information propagation analysis across X, Telegram, Instagram, Reddit, and YouTube.

### Core Value Flow
```
SOCIAL MEDIA DATA
       ↓
DATA INGESTION & PARSING
       ↓
PROCESSING & STORAGE (SQLite / PostgreSQL)
       ↓
AI/ML ENGINE (Sentiment, Emotion, TF-IDF, NetworkX)
       ↓
TREND + SENTIMENT + NETWORK INTELLIGENCE
       ↓
AUDIENCE INTELLIGENCE
       ↓
ACTIONABLE INSIGHTS & VIRAL CASCADE PROPAGATION
```

---

## 🎨 Visual Identity & Architecture

- **Visual Aesthetics**: SentientX / Awwwards-inspired cinematic dark interface (`#06070B`), glassmorphism, subtle radial glows, fine borders (`border-white/[0.08]`), electric accents (indigo `#6366F1`, cyan `#06B6D4`, emerald `#10B981`, rose `#F43F5E`), and large typography.
- **Frontend Stack**: React, Vite, Tailwind CSS, Lucide React, Recharts, Cytoscape.js.
- **Backend Stack**: Python, FastAPI, SQLAlchemy, Pydantic, NetworkX, Scikit-learn, TextBlob.
- **Database**: SQLite (built-in zero-config file database) / PostgreSQL compatible.

---

## 🚀 Quick Start Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & NPM

### 1. Setup Backend & Virtual Environment

```bash
# Clone or navigate to directory
cd SIH-SMA

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux/macOS:
source venv/bin/activate

# Install backend dependencies
pip install fastapi uvicorn sqlalchemy pydantic networkx scikit-learn numpy pandas python-multipart textblob
```

### 2. Start Backend API Server

```bash
# From workspace root directory
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
> Note: On first run, the system automatically creates `sih_sma.db` and seeds the SIH 2026 consistent demo dataset!

### 3. Setup & Start Frontend

```bash
# Open a second terminal tab & navigate to frontend
cd frontend

# Install NPM dependencies
npm install

# Start Vite development server
npm run dev -- --port 5173
```

---

## 🔗 Key URLs & Services

- **Frontend Platform**: `http://127.0.0.1:5173/`
- **FastAPI REST API**: `http://127.0.0.1:8000/api`
- **Swagger Interactive API Documentation**: `http://127.0.0.1:8000/docs`
- **Re-Seed Demo Endpoint**: `POST http://127.0.0.1:8000/api/demo/seed`
- **CSV/JSON Upload Endpoint**: `POST http://127.0.0.1:8000/api/posts/upload`

---

## 🏆 SIH 2026 Judging Demonstration Scenario

During a 3-minute judging presentation:

1. Open `http://127.0.0.1:5173/` (Landing Page with animated particle canvas).
2. Click **"VIEW SIH DEMO"** or **"SIH DEMO SCENARIO"** in the topbar.
3. Follow the guided 7-step scenario:
   - **Step 1**: Ingestion Sources (`/sources`)
   - **Step 2**: Sentiment & Emotion Intelligence Engine (`/sentiment`)
   - **Step 3**: Audience & Demographic Clustering (`/demographics`)
   - **Step 4**: Rising Trend Detection & Velocity Projection (`/trends`)
   - **Step 5**: Cytoscape Graph Topology & PageRank (`/network`)
   - **Step 6**: Multi-Stage Information Propagation (`/propagation`)
   - **Step 7**: Executive Intelligence Synthesis (`/dashboard`)
