from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.progress import Progress
from app.schemas.leaderboard import LeaderboardEntryResponse

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


def build_leaderboard(db: Session, current_user: User, subject_id: int = None, limit: int = 20):
    query = db.query(
        User.id,
        User.username,
        User.display_name,
        User.avatar,
        User.level,
        User.xp,
        func.sum(Progress.xp_earned).label("xp_gained"),
        func.count(Progress.id).label("games_played"),
    ).join(Progress, Progress.user_id == User.id)

    if subject_id:
        query = query.filter(Progress.subject_id == subject_id)

    rows = (
        query.group_by(User.id)
        .order_by(desc("xp_gained"))
        .limit(limit)
        .all()
    )

    result = []
    for rank, row in enumerate(rows, 1):
        result.append(LeaderboardEntryResponse(
            rank=rank,
            user_id=row.id,
            username=row.username,
            display_name=row.display_name,
            avatar=row.avatar,
            level=row.level,
            score=float(row.xp or 0),
            xp_gained=int(row.xp_gained or 0),
            games_played=int(row.games_played or 0),
            is_current_user=row.id == current_user.id,
        ))
    return result


@router.get("/global", response_model=List[LeaderboardEntryResponse])
def global_leaderboard(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return build_leaderboard(db, current_user, limit=limit)


@router.get("/subject/{subject_id}", response_model=List[LeaderboardEntryResponse])
def subject_leaderboard(
    subject_id: int,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return build_leaderboard(db, current_user, subject_id=subject_id, limit=limit)


@router.get("/weekly", response_model=List[LeaderboardEntryResponse])
def weekly_leaderboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    from datetime import datetime, timedelta
    week_ago = datetime.utcnow() - timedelta(days=7)
    query = db.query(
        User.id,
        User.username,
        User.display_name,
        User.avatar,
        User.level,
        User.xp,
        func.sum(Progress.xp_earned).label("xp_gained"),
        func.count(Progress.id).label("games_played"),
    ).join(Progress, Progress.user_id == User.id).filter(Progress.completed_at >= week_ago)

    rows = query.group_by(User.id).order_by(desc("xp_gained")).limit(20).all()
    result = []
    for rank, row in enumerate(rows, 1):
        result.append(LeaderboardEntryResponse(
            rank=rank,
            user_id=row.id,
            username=row.username,
            display_name=row.display_name,
            avatar=row.avatar,
            level=row.level,
            score=float(row.xp or 0),
            xp_gained=int(row.xp_gained or 0),
            games_played=int(row.games_played or 0),
            is_current_user=row.id == current_user.id,
        ))
    return result
