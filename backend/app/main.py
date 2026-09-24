import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database.session import engine, Base, SessionLocal
from backend.app.api.routes import router
from backend.app.services.demo_seeder import seed_database

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-seed if database is freshly created
db = SessionLocal()
try:
    from backend.app.database.models import Post
    if db.query(Post).count() == 0:
        print("Empty database detected. Seeding initial SIH 2026 demo dataset...")
        seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="SIH 2026 Social Media Analytics Platform API",
    description="Production AI/ML Social Intelligence API backend with trend detection, sentiment analysis, network topology, and information propagation tracking.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local SIH demo flexibility
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
