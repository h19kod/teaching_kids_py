from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StoryChapterResponse(BaseModel):
    id: int
    subject_id: int
    title: str
    title_ar: Optional[str] = None
    content: str
    content_ar: Optional[str] = None
    illustration: str
    order: int
    unlock_xp: int
    xp_reward: int
    completed: bool = False
    unlocked: bool = False
    current_page: int = 0

    class Config:
        from_attributes = True


class StoryCompleteRequest(BaseModel):
    chapter_id: int


class StoryCompleteResponse(BaseModel):
    xp_earned: int
    message: str
