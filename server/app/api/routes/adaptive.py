from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.services.adaptive_service import AdaptiveService

router = APIRouter(prefix="/adaptive", tags=["adaptive"])


@router.get("/recommendations")
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return AdaptiveService.get_recommendations(db, current_user)


@router.post("/adjust-difficulty")
def adjust_difficulty(
    game_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return AdaptiveService.adjust_difficulty(db, current_user, game_id)
