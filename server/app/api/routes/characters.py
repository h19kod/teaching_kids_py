from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.character import Character

router = APIRouter(prefix="/characters", tags=["characters"])


@router.get("/")
def list_characters(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return db.query(Character).filter(Character.user_id == current_user.id).all()


@router.post("/")
def create_character(
    name: str,
    avatar_emoji: str = "🦁",
    color: str = "#6366f1",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    char = Character(
        user_id=current_user.id,
        name=name,
        avatar_emoji=avatar_emoji,
        color=color,
    )
    db.add(char)
    db.commit()
    db.refresh(char)
    return char


@router.post("/{char_id}/equip")
def equip_character(
    char_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    char = db.query(Character).filter(Character.id == char_id, Character.user_id == current_user.id).first()
    if not char:
        raise HTTPException(status_code=404, detail="Character not found")
    db.query(Character).filter(Character.user_id == current_user.id).update({"is_active": False})
    char.is_active = True
    current_user.avatar = char.avatar_emoji
    db.commit()
    return {"message": f"Character '{char.name}' equipped!"}
