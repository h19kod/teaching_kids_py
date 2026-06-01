from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AchievementResponse(BaseModel):
    id: int
    name: str
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    icon: str
    rarity: str
    xp_reward: int
    coin_reward: int
    condition_type: str
    condition_value: int
    earned: bool = False
    earned_at: Optional[datetime] = None

    class Config:
        from_attributes = True
