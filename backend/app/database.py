import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

DATABASE_URL = os.getenv("DATABASE_URL")

# Tratamento para URLs do Render que iniciam com postgres://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL) if DATABASE_URL else None
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) if engine else None

def get_db():
    if not SessionLocal:
        raise Exception("DATABASE_URL não configurada no ambiente.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    if engine:
        Base.metadata.create_all(bind=engine)
