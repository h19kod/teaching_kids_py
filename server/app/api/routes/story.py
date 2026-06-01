from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.story import StoryChapter, StoryProgress
from app.schemas.story import StoryChapterResponse, StoryCompleteRequest, StoryCompleteResponse
from datetime import datetime

router = APIRouter(prefix="/story", tags=["story"])


@router.get("/chapters", response_model=List[StoryChapterResponse])
def get_chapters(
    subject_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = db.query(StoryChapter).filter(StoryChapter.is_active == True)
    if subject_id:
        query = query.filter(StoryChapter.subject_id == subject_id)
    chapters = query.order_by(StoryChapter.subject_id, StoryChapter.order).all()

    progress_map = {
        sp.chapter_id: sp
        for sp in db.query(StoryProgress).filter(StoryProgress.user_id == current_user.id).all()
    }
    result = []
    for ch in chapters:
        sp = progress_map.get(ch.id)
        d = StoryChapterResponse.model_validate(ch)
        d.unlocked = current_user.xp >= ch.unlock_xp
        d.completed = sp.completed if sp else False
        d.current_page = sp.current_page if sp else 0
        result.append(d)
    return result


@router.post("/complete", response_model=StoryCompleteResponse)
def complete_chapter(
    data: StoryCompleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    chapter = db.query(StoryChapter).filter(StoryChapter.id == data.chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    sp = db.query(StoryProgress).filter(
        StoryProgress.user_id == current_user.id,
        StoryProgress.chapter_id == data.chapter_id,
    ).first()

    xp_earned = 0
    if not sp:
        sp = StoryProgress(user_id=current_user.id, chapter_id=data.chapter_id)
        db.add(sp)

    if not sp.completed:
        sp.completed = True
        sp.completed_at = datetime.utcnow()
        current_user.xp += chapter.xp_reward
        xp_earned = chapter.xp_reward

    db.commit()
    return StoryCompleteResponse(xp_earned=xp_earned, message="Chapter completed!")
