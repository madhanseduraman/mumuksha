# Mumuksha — Semantic Spiritual Learning System

> **Mumuksha** (முமுக்ஷு) — Sanskrit for "one who desires liberation"

A production-grade AI-powered platform for exploring Tamil Siddhar spiritual texts. Built as a Responsible AI system combining semantic search, dual-model AI comparison (Gemini + Sarvam AI), and culturally grounded explanations.

## Features

- **Scripture Explorer** — Browse Sivavakiyar's 99 songs organized by spiritual topics
- **Semantic Search** — Vector-based search across Tamil verses and explanations
- **Dual-Model AI Chat** — Side-by-side responses from Gemini and Sarvam AI
- **Topic Navigation** — AI-clustered themes (Mantra, Yoga, Liberation, etc.)
- **Verse Explanation** — Click any verse to get deep AI-powered explanation
- **Responsible AI** — Citations always grounded in source verses

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| State | Zustand + React Query |
| Backend | FastAPI (Python 3.11) |
| RAG | LangChain + sentence-transformers |
| Database | Supabase (PostgreSQL + pgvector) |
| AI | Gemini API (primary) + Sarvam AI (secondary) |
| Deploy | Vercel (frontend) + Railway (backend) |

## Data Source

- **Sivavakiyar** — 10th–11th century Tamil Siddhar
- 99 songs with Tamil verse + Tamil explanation
- Topics: Mantra, Yoga, Liberation, Body & Soul, Divine Knowledge, Critique of Rituals, Shiva & Shakti, Inner Transformation

## Project Structure

```
mumuksha/
├── frontend/          # React + Vite + TypeScript app
├── backend/           # FastAPI Python backend
├── data/              # Source data (Sivavakiyar JSON)
└── supabase/          # SQL schema for Supabase
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your API keys
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # set VITE_API_URL
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
SARVAM_API_KEY=your_sarvam_api_key
```

### Frontend (`frontend/.env.local`)
```
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Responsible AI Principles

1. **Grounded** — All AI responses cite source verses
2. **Multi-perspective** — Gemini and Sarvam provide different interpretations
3. **Transparent** — Sources always shown alongside answers
4. **Culturally aware** — Sarvam AI provides India-rooted context

## Dissertation Context

This system is designed as a real-world **Responsible AI** case study, demonstrating:
- Bias detection in AI interpretation of sacred texts
- Multi-model perspective comparison
- Cultural sensitivity in AI responses
- Explainability through grounded citations
