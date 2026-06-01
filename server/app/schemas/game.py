from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class SubjectResponse(BaseModel):
    id: int
    name: str
    name_ar: Optional[str] = None
    world_type: str
    icon: str
    color: str
    bg_gradient: Optional[str] = None
    description: Optional[str] = None
    unlock_level: int
    order: int

    class Config:
        from_attributes = True


class GameResponse(BaseModel):
    id: int
    name: str
    name_ar: Optional[str] = None
    subject_id: int
    description: Optional[str] = None
    game_type: str
    thumbnail: str
    min_difficulty: int
    max_difficulty: int
    xp_per_win: int
    coin_reward: int
    star_reward: int
    unlock_level: int
    time_limit_seconds: int
    game_config: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class GamePlayRequest(BaseModel):
    game_id: int
    difficulty: int = 1


class GamePlayResponse(BaseModel):
    session_id: str
    game: GameResponse
    questions: List[Dict[str, Any]]
    time_limit: int
    difficulty: int


class ProgressSubmitRequest(BaseModel):
    game_id: int
    subject_id: int
    score: float
    max_score: float = 100
    difficulty: int
    time_spent_seconds: int
    correct_answers: int
    total_questions: int
    answers_data: Optional[str] = None


class ProgressSubmitResponse(BaseModel):
    xp_earned: int
    coins_earned: int
    stars_earned: int
    total_xp: int
    level_up: bool
    new_level: int
    achievements_unlocked: List[Dict[str, Any]] = []
    missions_updated: List[Dict[str, Any]] = []


class ProgressResponse(BaseModel):
    id: int
    game_id: int
    subject_id: int
    score: float
    xp_earned: int
    coins_earned: int
    difficulty: int
    time_spent_seconds: int
    correct_answers: int
    total_questions: int
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
