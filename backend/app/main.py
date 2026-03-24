from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import scriptures, topics, verses, chat

app = FastAPI(
    title="Mumuksha API",
    description="Semantic Spiritual Learning System — Tamil Siddhar texts with AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scriptures.router)
app.include_router(topics.router)
app.include_router(verses.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {
        "name": "Mumuksha API",
        "version": "1.0.0",
        "description": "Semantic Spiritual Learning System for Tamil Siddhar texts",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
