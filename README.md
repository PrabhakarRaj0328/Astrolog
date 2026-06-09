# Astro Project

This repository contains the Astro web application, consisting of a **Next.js** frontend and a **FastAPI (Python)** backend.

## Project Structure

- `frontend/` - Contains the Next.js frontend application.
- `backend/` - Contains the FastAPI backend application.

## Getting Started

### 1. Running the Next.js Frontend

The frontend is built with Next.js and uses standard npm scripts.

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start and be available at [http://localhost:3000](http://localhost:3000).

### 2. Running the FastAPI Backend

The backend is built with Python and FastAPI. It is recommended to use a virtual environment.

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn main:app --reload
```

The backend API will start and be available at [http://localhost:8000](http://localhost:8000).
You can view the interactive API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

## Features
- **Frontend**: Mock OTP Authentication, Role-based Access Control (User/Admin), responsive Vanilla CSS styling.
- **Backend**: Foundational FastAPI setup with CORS middleware configured for the Next.js frontend.
