# TalentCore AI — Autonomous Multi-Agent Corporate Recruitment Pipeline

An enterprise-grade, full-stack recruitment ecosystem designed to eliminate 
hiring bias and automate deep technical candidate screening. This platform 
deploys a decoupled, multi-stage asynchronous multi-agent framework built 
with **CrewAI, FastAPI (Python 3.12), and React 18**.

---

## 🏗️ System Architecture & Data Flow

TalentCore AI isolates its heavy multi-agent execution context onto background 
threads using native Python event pools, preventing user interface freezes 
or connection thread blockages during token processing loops.

+----------------------------------------+|    React 18 / Tailwind CSS Client      |+----------------------------+-----------+|v  (REST API / OAuth2 Bearer Tokens)+----------------------------+-----------+|  FastAPI Async Backend Routing Gateway |+----------------------------+-----------+|v  (asyncio.to_thread Event Pools)+-------------------------------------------------------+-------------------------------------------------------+|  AGENTIC COMPLIANCE ORCHESTRATION PIPELINE LOGIC ENGINES                                                      ||                                                                                                               ||  [ Crew 1: Profile Scanners ] ---> [ Crew 2: Cross-Examiners ] ---> [ Crew 3: HR Grading Compliance Panel ]    |+-------------------------------------------------------+-------------------------------------------------------+|v  (LiteLLM Automated Fault-Tolerance Layer)+----------------------------+-----------+|   Google Gemini API Quota  | Multi-Key ||   Multi-Key Rotation Hub   | Fallback  |+----------------------------+-----------+

## 🧠 Multi-Agent Compliance Pipeline

The backend background worker orchestrates three independent CrewAI agent 
frameworks to cross-examine technical candidate competencies:

1. **Crew 1 (Profile Scanner)**: Triggered instantly upon PDF resume upload. 
It parses structural text strings, cross-references them against job requirements, 
identifies background gaps, and drafts 3 highly specific technical scenario queries.

2. **Crew 2 (Cross-Examiner)**: Engages when the candidate submits their primary 
answers. It dynamically scans responses for superficial engineering buzzwords, 
cross-checks them against the initial queries, and generates 2 detailed 
follow-up probing questions.

3. **Crew 3 (HR Grading Compliance Panel)**: Compiles the final evaluation metrics. 
It grades the candidate across a strict 4-dimension matrix, generates a structured 
markdown assessment report, and appends deterministic hiring recommendations 
based on verbatim textual evidence.

---

## 🎨 System Workspaces & UI Innovation

- **The Candidate Pod**: An immersive workspace detailed with a responsive, 
**GPU-Accelerated CSS Vector Processing Orb** that dynamically transforms its 
expressions (Thinking, Talking, Celebrating) in real-time based on background 
agent calculation milestones.

- **Corporate Command Center**: An Indigo Deep-Tech administrative workspace 
featuring a **Dual-Pane Operations Hub**. It includes **independent component 
scroll lanes** to keep tracking matrices securely anchored and features 
**React-Markdown rendering engines** that parse raw text tokens into data grids.

- **Decision Engine Controls**: Interactive header utilities that read the true 
evaluation scorecard content, automatically displaying an ambient green 
**"Advance to Next Round"** click action or a red **"Send Rejection Notice"** 
button to log real-time email dispatch traces in the terminal.

## 📦 Local Workspace Installation & Quickstart

Ensure you have Python >=3.12 and Node.js >=18 installed on your MacBook. This 
project uses [UV](https://astral.sh) for high-speed package management 
and environment tracking.

### 1. Configure the Shared Environment (`.env`)
Create a `.env` file at your backend root directory and add your unnumbered 
multi-key Gemini API tokens to support automated rate-limit rotation:
```text
GEMINI_API_KEY_1=AIzaSy...
GEMINI_API_KEY_2=AIzaSy...
GEMINI_API_KEY_3=AIzaSy...
```

### 2. Initialize the Backend Server
```bash
# Navigate to the backend directory context
cd backend

# Install dependencies and spin up the FastAPI service via UV
uv run uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```
*Your backend will initialize a persistent SQLite pool and watch for network 
handshakes on port `8000`.*

### 3. Initialize the Frontend Interface
Open a second terminal window pane and boot your Vite dev server:
```bash
# Navigate to the frontend workspace
cd frontend

# Install UI modules and launch the client portal
npm install
npm run dev
```
*Open your web browser and navigate to `http://localhost:5173/` to log into 
your client accounts.*

### 🔐 Administrative Compliance Verification Accounts:
- **HR Administrator Desk Login**:
  - **Email**: `admin@company.com`
  - **Password**: `SecurePassword123`
- **Candidate Interface Suite**: Click register to establish a localized testing 
profile, upload a text-based PDF resume, and run the complete multi-stage 
automated consultation pipeline.
