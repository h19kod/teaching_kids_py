from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.database import create_tables, SessionLocal
from app.api.routes import (
    auth, users, subjects, games, progress,
    adaptive, missions, rewards, achievements,
    story, characters, leaderboard, stats,
    notifications, certificates,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🚀 Starting {settings.APP_NAME}...")
    create_tables()
    db = SessionLocal()
    try:
        from app.seed.seed_data import run_all_seeds
        run_all_seeds(db)
    finally:
        db.close()
    print(f"✅ {settings.APP_NAME} is ready!")
    yield
    print(f"👋 Shutting down {settings.APP_NAME}...")


app = FastAPI(
    title=settings.APP_NAME,
    description="🎓 Kids Learning Adventure — FastAPI Backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(subjects.router, prefix=API_PREFIX)
app.include_router(games.router, prefix=API_PREFIX)
app.include_router(progress.router, prefix=API_PREFIX)
app.include_router(adaptive.router, prefix=API_PREFIX)
app.include_router(missions.router, prefix=API_PREFIX)
app.include_router(rewards.router, prefix=API_PREFIX)
app.include_router(achievements.router, prefix=API_PREFIX)
app.include_router(story.router, prefix=API_PREFIX)
app.include_router(characters.router, prefix=API_PREFIX)
app.include_router(leaderboard.router, prefix=API_PREFIX)
app.include_router(stats.router, prefix=API_PREFIX)
app.include_router(notifications.router, prefix=API_PREFIX)
app.include_router(certificates.router, prefix=API_PREFIX)


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs": "/api/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
