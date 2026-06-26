#  Enterprise AI Hiring Platform using CrewAI Flows & Google Gemini 2.5 Flash

An enterprise-grade multi-agent AI hiring platform that conducts structured technical interviews using CrewAI Flows, Google Gemini 2.5 Flash, and a Human-in-the-Loop (HITL) workflow.

Unlike traditional machine learning recruitment systems, this project implements a dynamic sequential multi-agent architecture, where specialized AI agents collaborate to analyze candidate resumes, generate interview questions, conduct follow-up questioning, and produce evidence-based hiring assessments.

---

##  Features

- 📄 Resume (CV) Analysis
- 💼 Job Description Matching
- 🤖 Multi-Agent Interview Pipeline using CrewAI
- 👤 Human-in-the-Loop Interactive Interview
- 🎯 Context-aware Technical & Behavioral Question Generation
- 🔍 Intelligent Cross-Examination Based on Candidate Responses
- 📊 Multi-Dimensional Candidate Evaluation
- 📝 Automated Markdown Assessment Report
- ⚡ Powered by Google Gemini 2.5 Flash

---

#  System Architecture

Candidate CV + Job Description              │              ▼ ────────────────────────────────────────── Crew 1 – Question Generation Team ────────────────────────────────────────── • CV Scanner Agent • Primary Interviewer Agent               │              ▼ Human answers technical interview questions               │              ▼ ────────────────────────────────────────── Crew 2 – Cross Examination Team ────────────────────────────────────────── • Follow-up Interviewer Agent               │              ▼ Human answers follow-up questions               │              ▼ ────────────────────────────────────────── Crew 3 – HR Compliance & Grading Team ────────────────────────────────────────── • Grading Panel Agent               │              ▼ candidate_assessment.md

---

#  AI Agent Workflow

## Crew 1 – Question Generation Team

### CV Scanner Agent
- Extracts relevant technical skills from the resume
- Compares candidate experience against the job description
- Identifies missing technologies and potential skill gaps

### Primary Interviewer Agent
- Generates three contextual interview questions
- Combines technical, behavioral, and scenario-based questions
- Avoids generic interview prompts

---

## Crew 2 – Cross-Examination Team

### Follow-up Interviewer Agent
- Evaluates candidate responses
- Detects shallow or incomplete explanations
- Generates targeted probing questions
- Challenges technical reasoning with deeper follow-ups

---

## Crew 3 – HR Compliance & Audit Team

### Grading Panel Agent
Produces a structured hiring assessment using:

- Stack Match
- Problem Solving Ability
- Communication Skills
- Experience & Seniority

Every evaluation is supported using verbatim candidate quotes, ensuring transparent and explainable AI decision making.

---

#  Human-in-the-Loop Workflow

The application pauses at predefined checkpoints to collect live candidate responses before continuing the AI workflow.

Resume + JD       │       ▼ Generate Questions       │       ▼ Wait for Candidate Responses       │       ▼ Generate Follow-up Questions       │       ▼ Wait for Follow-up Responses       │       ▼ Generate Hiring Assessment

---

#  Tech Stack

### AI Framework
- CrewAI
- CrewAI Flows

### Large Language Model
- Google Gemini 2.5 Flash

### Programming Language
- Python 3.12+

### Configuration
- YAML
- Pydantic

### Package Management
- uv

### Output
- Markdown Reports

---

# 📂 Project Structure

interviewer_agent/ │ ├── .venv/ │ ├── output/ │   └── candidate_assessment.md │ ├── src/ │   └── interviewer_agent/ │       │ │       ├── crews/ │       │   └── interview_crew/ │       │       ├── config/ │       │       │   ├── agents.yaml │       │       │   └── tasks.yaml │       │       │ │       │       └── interview_crew.py │       │ │       └── main.py │ ├── interview_flow_chart.html │ └── pyproject.toml

---

#  Installation

Clone the repository

bash git clone https://github.com/yourusername/interviewer-agent.git 

Navigate into the project

bash cd interviewer-agent 

Install dependencies

bash uv sync 

Configure your Google AI Studio API key

bash GEMINI_API_KEY=your_api_key 

Run the application

bash python src/interviewer_agent/main.py 

---

#  Example Workflow

1. Provide the candidate resume.
2. Provide the job description.
3. AI generates interview questions.
4. Candidate answers interactively.
5. AI performs cross-examination.
6. Candidate answers follow-up questions.
7. AI generates a comprehensive hiring assessment.
8. Report is saved as:

output/candidate_assessment.md

---

#  Key Design Principles

- Sequential Multi-Agent Collaboration
- Human-in-the-Loop Decision Making
- Explainable AI
- Context-Aware Interviewing
- Deterministic Evaluation
- Modular Crew Architecture
- Evidence-Based Candidate Assessment

---

#  Future Improvements

- Voice-based interviews using Speech-to-Text
- Video interview support
- Retrieval-Augmented Generation (RAG) for company-specific knowledge
- PDF report generation
- Candidate scoring dashboard
- ATS integration
- Multi-language interview support
- Web-based interface with Streamlit or React

---

#  Learning Outcomes

This project demonstrates practical experience with:

- Multi-Agent AI Systems
- CrewAI Flows
- Agent Orchestration
- Prompt Engineering
- Human-in-the-Loop AI
- LLM Application Development
- Workflow Automation
- Context Management with Pydantic
- Google Gemini API Integration
- Explainable AI for Recruitment

---

# 👤 Author

Mevini Munaweera

Data Science Undergraduate 

LinkedIn: https://www.linkedin.com/in/mevini-munaweera

GitHub: MeviniNethasa
