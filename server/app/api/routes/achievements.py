from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.achievement import Achievement, UserAchievement
from app.schemas.achievement import AchievementResponse

router = APIRouter(prefix="/achievements", tags=["achievements"])


@router.get("/", response_model=List[AchievementResponse])
def list_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    achievements = db.query(Achievement).filter(Achievement.is_active == True).all()
    earned_map = {
        ua.achievement_id: ua.earned_at
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    }
    result = []
    for a in achievements:
        d = AchievementResponse.model_validate(a)
        d.earned = a.id in earned_map
        d.earned_at = earned_map.get(a.id)
        result.append(d)
    return result
