import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sih_sma.db")

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
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
