from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user, require_admin
from app.models.subject import Subject
from app.models.game import Game
from app.models.user import User
from app.schemas.game import SubjectResponse, GameResponse

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("/", response_model=List[SubjectResponse])
def list_subjects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return db.query(Subject).filter(Subject.is_active == True).order_by(Subject.order).all()


@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.is_active == True).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject


@router.get("/{subject_id}/games", response_model=List[GameResponse])
def get_subject_games(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return db.query(Game).filter(Game.subject_id == subject_id, Game.is_active == True).order_by(Game.order).all()
