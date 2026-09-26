import os
import sys
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

is_vercel = bool(os.getenv("VERCEL"))
default_db_path = "/tmp/sih_sma.db" if is_vercel else "./sih_sma.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{default_db_path}")

# For SQLite, enable check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def migrate_db_columns():
    """Applies schema migrations for new Post columns if missing in database."""
    try:
        with engine.connect() as conn:
            inspector = inspect(engine)
            if "posts" in inspector.get_table_names():
                columns = [c["name"] for c in inspector.get_columns("posts")]
                if "entity_name" not in columns:
                    conn.execute(text("ALTER TABLE posts ADD COLUMN entity_name VARCHAR"))
                if "entity_type" not in columns:
                    conn.execute(text("ALTER TABLE posts ADD COLUMN entity_type VARCHAR"))
                if "hashtags" not in columns:
                    conn.execute(text("ALTER TABLE posts ADD COLUMN hashtags TEXT"))
                conn.commit()
    except Exception as ex:
        print(f"Migration check warning: {ex}")

def get_db():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        pass
    db = SessionLocal()
    try:
        from backend.app.database.models import Post
        if db.query(Post).count() == 0:
            from backend.app.services.demo_seeder import seed_database
            seed_database(db)
    except Exception as e:
        print(f"[DB Auto-Init Notice]: {e}")
    try:
        yield db
    finally:
        db.close()
