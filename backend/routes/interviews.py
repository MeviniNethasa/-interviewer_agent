import os
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from pypdf import PdfReader
from backend.database import get_db
from backend.models import User, UserRole, Job, Application, InterviewStateTrack, InterviewStatus, HiringVerdict
from backend.security import get_current_user
from backend.workers.interview_task import run_crew_1_async, run_crew_2_async, run_crew_3_async


router = APIRouter(prefix="/api/interviews", tags=["Interviews"])
UPLOAD_DIR = "output/cv_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/apply/{job_id}", status_code=status.HTTP_201_CREATED)
def apply_for_job(
    job_id: int, 
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
  
  """Endpoint: Convert incoming binary PDF file data, map Application parameters, and fire Crew 1"""
  if current_user.role != UserRole.CANDIDATE:
        raise HTTPException(status_code=403, detail="Only candidate profiles can initialize applications.")
        
  job = db.query(Job).filter(Job.id == job_id, Job.is_active == True).first()
  if not job:
        raise HTTPException(status_code=404, detail="Target job campaign data not found or inactive.")

    # Secure persistent document string layout processing
  file_name = f"{current_user.id}_{int(os.time()) if hasattr(os, 'time') else 2026}_{file.filename}"
  file_path = os.path.join(UPLOAD_DIR, file_name)
  with open(file_path, "wb") as f:
        f.write(file.file.read())

  try:
        reader = PdfReader(file_path)
        extracted_text = "".join([page.extract_text() + "\n" for page in reader.pages if page.extract_text()])
  except Exception as err:
        raise HTTPException(status_code=420, detail=f"Failed to read file characters: {err}")
  
  # Initialize transactional record tracking states
  new_app = Application(candidate_id=current_user.id, job_id=job.id, cv_text=extracted_text, cv_file_path=file_path)
  db.add(new_app)
  db.flush()

  new_track = InterviewStateTrack(application_id=new_app.id, status=InterviewStatus.NOT_STARTED)
  db.add(new_track)
  db.commit()

  # Fire async background process thread running Crew 1 model
  background_tasks.add_task(run_crew_1_async, db, new_track.id, job.description, extracted_text)
    
  return {"message": "Application received. AI is evaluating documents. Check state metrics for questions.", "application_id": new_app.id}

@router.get("/status/{application_id}")
def get_interview_status(application_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Endpoint: Dynamic state tracker checking processing milestones for UI updates"""
    track = db.query(InterviewStateTrack).filter(InterviewStateTrack.application_id == application_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Interview process tracking index not found.")

    # Guardrail: Hide data results from candidates to enforce compliance guidelines
    if current_user.role == UserRole.CANDIDATE and current_user.id != track.application.candidate_id:
        raise HTTPException(status_code=403, detail="Unauthorized data access attempt.")

    response_data = {
        "status": track.status,
        "primary_questions": track.primary_questions,
        "followup_questions": track.followup_questions
    }

    # Admins maintain comprehensive full visibility access
    if current_user.role == UserRole.ADMIN:
        response_data["final_scorecard"] = track.final_scorecard
        response_data["verdict"] = track.verdict
        
    return response_data

@router.post("/submit-primary/{application_id}")
def submit_primary_answers(
    application_id: int, 
    answers: dict, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Endpoint: Log Candidate primary responses and trigger Crew 2 follow-up checks"""
    track = db.query(InterviewStateTrack).filter(InterviewStateTrack.application_id == application_id).first()
    if not track or track.status != InterviewStatus.PRIMARY_QUESTIONS_READY:
        raise HTTPException(status_code=400, detail="Invalid operational timeline state transition workflow.")

    primary_text_ans = answers.get("answers", "")
    track.primary_answers = primary_text_ans
    track.status = InterviewStatus.PRIMARY_ANSWERS_SUBMITTED
    db.commit()

    background_tasks.add_task(
        run_crew_2_async, db, track.id, track.application.job.description, 
        track.application.cv_text, primary_text_ans
    )
    return {"message": "Primary responses logged. Cross-examination models deployed."}

@router.post("/submit-followup/{application_id}")
def submit_followup_answers(
    application_id: int, 
    answers: dict, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Endpoint: Log Candidate defense strings and trigger Crew 3 evaluation engines"""
    track = db.query(InterviewStateTrack).filter(InterviewStateTrack.application_id == application_id).first()
    if not track or track.status != InterviewStatus.FOLLOWUP_QUESTIONS_READY:
        raise HTTPException(status_code=400, detail="Invalid tracking timeline operations.")

    followup_text_ans = answers.get("answers", "")
    track.followup_answers = followup_text_ans
    db.commit()

    background_tasks.add_task(
        run_crew_3_async, db, track.id, track.application.job.description,
        track.application.cv_text, track.primary_questions, track.primary_answers,
        track.followup_questions, followup_text_ans
    )
    return {"message": "Final interview metrics submitted cleanly. Assessment calculation initialized."}

@router.post("/verdict/{application_id}")
def issue_hiring_verdict(application_id: int, data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Endpoint: Executive operational interface processing definitive admin hiring choices"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied. Operation restricted to system administrators.")

    track = db.query(InterviewStateTrack).filter(InterviewStateTrack.application_id == application_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Target record parameters not found.")

    target_verdict = data.get("verdict")
    if target_verdict not in [v.value for v in HiringVerdict]:
        raise HTTPException(status_code=400, detail="Invalid metric schema valuation.")

    track.verdict = HiringVerdict(target_verdict)
    db.commit()
    return {"message": f"Hiring operational parameters finalized successfully as: {target_verdict.upper()}"}