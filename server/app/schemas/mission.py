from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MissionResponse(BaseModel):
    id: int
    name: str
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    icon: str
    mission_type: str
    xp_reward: int
    coin_reward: int
    star_reward: int
    target_count: int
    condition_type: str
    current_count: int = 0
    completed: bool = False
    claimed: bool = False
    reset_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MissionClaimResponse(BaseModel):
    xp_earned: int
    coins_earned: int
    stars_earned: int
    message: str
