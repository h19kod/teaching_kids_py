from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.progress import Progress
from app.schemas.game import ProgressSubmitRequest, ProgressSubmitResponse, ProgressResponse
from app.services.progress_service import ProgressService

router = APIRouter(prefix="/progress", tags=["progress"])


@router.post("/submit", response_model=ProgressSubmitResponse)
def submit_progress(
    data: ProgressSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return ProgressService.submit(db, current_user, data)


@router.get("/history", response_model=List[ProgressResponse])
def get_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return (
        db.query(Progress)
        .filter(Progress.user_id == current_user.id)
        .order_by(Progress.completed_at.desc())
        .limit(limit)
        .all()
    )


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    from app.models.statistics import Statistics
    from sqlalchemy import func

    stats = db.query(Statistics).filter(Statistics.user_id == current_user.id).all()
    result = {}
    for s in stats:
        key = str(s.subject_id) if s.subject_id else "overall"
        result[key] = {
            "games_played": s.games_played,
            "avg_score": round(s.avg_score, 2),
            "best_score": round(s.best_score, 2),
            "total_xp": s.total_xp,
            "total_time_seconds": s.total_time_seconds,
            "correct_answers": s.correct_answers,
            "total_answers": s.total_answers,
            "accuracy": round(s.correct_answers / max(s.total_answers, 1) * 100, 1),
        }
    return result
