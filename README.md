# SkillMap

SkillMap is a full-stack Student Skill Profile Clustering tool.

## Project Structure

```text
SkillMap/
├── models/                 # Trained ML artifacts (.pkl)
├── app/
│   ├── backend/            # Flask API
│   │   ├── app.py
│   │   └── requirements.txt
│   └── frontend/           # React + Vite UI
├── data/
├── resume/
└── .venv/                  # Local virtual environment (ignored)
```

## Features

- Resume text analysis and cluster prediction
- Cluster confidence score and top terms extraction
- Cluster dashboard with profile cards and size bar chart
- Dark-themed UI with routing and animations

## Tech Stack

- Backend: Flask, scikit-learn, spaCy
- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts, Framer Motion

## Prerequisites

- Python 3.10+ (project currently works with Python 3.14 in this workspace)
- Node.js 18+
- npm

## Setup and Run

### 1) Backend

```powershell
cd app/backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py
```

Backend URL: http://localhost:5000

### 2) Frontend

```powershell
cd app/frontend
npm install
npm run dev
```

Frontend URL: http://localhost:5173

## API Endpoints

### POST /predict

Request body:

```json
{
  "resume_text": "your resume content"
}
```

Response shape:

```json
{
  "cluster_id": 0,
  "cluster_name": "Information Technology",
  "top_terms": ["python", "sql", "api"],
  "confidence": 0.8732
}
```

### GET /clusters

Response shape:

```json
{
  "clusters": [
    {
      "id": 0,
      "name": "Information Technology",
      "size": 120,
      "key_terms": ["python", "cloud", "backend"]
    }
  ]
}
```

## Collaboration Note: Virtual Environment Is Ignored

This repository intentionally ignores local virtual environments so each collaborator can manage their own local Python setup.

- Ignored path: `.venv/`
- Why: virtual environments are machine-specific and should not be committed
- What to do: create your own local venv and install dependencies from `app/backend/requirements.txt`

Example:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r app/backend/requirements.txt
```

## Notes

- If `pickle5` fails to install on newer Python versions, it is usually not needed because modern Python already includes pickle support.
- Keep model files under `models/` and do not rename them unless backend loading logic is updated.
