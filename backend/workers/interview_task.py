import os
import time
from sqlalchemy.orm import Session
from backend.models import InterviewStateTrack, InterviewStatus
from interviewer_agent.crews.interview_crew.interview_crew import InterviewCrew

def run_crew_1_async(db: Session, track_id: int, job_desc: str, cv_text: str):
    """Background Task execution worker processing dynamic primary questions"""
    track = db.query(InterviewStateTrack).filter(InterviewStateTrack.id == track_id).first()
    if not track:
        return

    try:
        # Restoring rate-limit protective spacing rules
        time.sleep(3)
        
        # Instantiate your clean, untouched operational engine
        crew_engine = InterviewCrew()
        result = crew_engine.question_generation_crew().kickoff(inputs={
            "job_description": job_desc,
            "cv_text": cv_text,
            "primary_answers": "Pending live input collection from Web Dashboard page text fields"
        })
        
        track.primary_questions = result.raw
        track.status = InterviewStatus.PRIMARY_QUESTIONS_READY
        db.commit()
    except Exception as err:
        print(f"[SYSTEM BACKEND CRASH ERROR IN CREW 1 WORKER]: {err}")

def run_crew_2_async(db: Session, track_id: int, job_desc: str, cv_text: str, primary_ans: str):
    """Background Task execution worker processing context-aware follow-up queries"""
    track = db.query(InterviewStateTrack).filter(InterviewStateTrack.id == track_id).first()
    if not track:
        return

    try:
        time.sleep(3)
        crew_engine = InterviewCrew()
        result = crew_engine.followup_generation_crew().kickoff(inputs={
            "cv_text": cv_text,
            "job_description": job_desc,
            "candidate_answers": primary_ans
        })
        
        track.followup_questions = result.raw
        track.status = InterviewStatus.FOLLOWUP_QUESTIONS_READY
        db.commit()
    except Exception as err:
        print(f"[SYSTEM BACKEND CRASH ERROR IN CREW 2 WORKER]: {err}")

def run_crew_3_async(db: Session, track_id: int, job_desc: str, cv_text: str, prim_q: str, prim_a: str, foll_q: str, foll_a: str):
    """Background Task execution worker calculating final scorecard evaluation metrics matrix"""
    track = db.query(InterviewStateTrack).filter(InterviewStateTrack.id == track_id).first()
    if not track:
        return

    try:
        time.sleep(3)
        crew_engine = InterviewCrew()
        result = crew_engine.final_grading_crew().kickoff(inputs={
            "cv_text": cv_text,
            "job_description": job_desc,
            "primary_questions_report": prim_q,
            "candidate_answers": prim_a,
            "followup_questions_report": foll_q,
            "followup_answers": foll_a
        })
        
        track.final_scorecard = result.raw
        track.status = InterviewStatus.COMPLETED
        db.commit()
    except Exception as err:
        print(f"[SYSTEM BACKEND CRASH ERROR IN CREW 3 WORKER]: {err}")
