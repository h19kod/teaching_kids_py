from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.mission import Mission, UserMission
from app.services.mission_service import MissionService

router = APIRouter(prefix="/missions", tags=["missions"])


@router.get("/")
def get_missions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    user_missions = MissionService.get_or_assign_missions(db, current_user)
    result = []
    for um in user_missions:
        if not um.mission:
            continue
        result.append({
            "id": um.id,
            "mission_id": um.mission_id,
            "name": um.mission.name,
            "name_ar": um.mission.name_ar,
            "description": um.mission.description,
            "description_ar": um.mission.description_ar,
            "icon": um.mission.icon,
            "mission_type": um.mission.mission_type,
            "xp_reward": um.mission.xp_reward,
            "coin_reward": um.mission.coin_reward,
            "star_reward": um.mission.star_reward,
            "target_count": um.mission.target_count,
            "current_count": um.current_count,
            "completed": um.completed,
            "claimed": um.claimed,
            "reset_at": um.reset_at,
        })
    return result


@router.post("/{user_mission_id}/claim")
def claim_mission(
    user_mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return MissionService.claim_reward(db, current_user, user_mission_id)
