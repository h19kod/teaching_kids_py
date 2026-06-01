from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.game import Game
from app.models.user import User
from app.schemas.game import GameResponse, GamePlayRequest
from app.services.game_service import GameService

router = APIRouter(prefix="/games", tags=["games"])


@router.get("/", response_model=List[GameResponse])
def list_games(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return db.query(Game).filter(Game.is_active == True).order_by(Game.subject_id, Game.order).all()


@router.get("/{game_id}", response_model=GameResponse)
def get_game(
    game_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    game = db.query(Game).filter(Game.id == game_id, Game.is_active == True).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


@router.post("/play")
def start_game(
    data: GamePlayRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return GameService.start_game(db, data.game_id, data.difficulty)
