from pydantic import BaseModel
from typing import Optional


class LeaderboardEntryResponse(BaseModel):
    rank: int
    user_id: int
    username: str
    display_name: Optional[str] = None
    avatar: Optional[str] = "🦁"
    level: int
    score: float
    xp_gained: int
    games_played: int
    is_current_user: bool = False

    class Config:
        from_attributes = True
