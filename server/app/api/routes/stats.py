from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.core.dependencies import get_current_active_user, require_admin
from app.models.user import User
from app.models.statistics import Statistics
from app.models.progress import Progress
from app.models.achievement import UserAchievement

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/overview")
def get_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    overall = db.query(Statistics).filter(
        Statistics.user_id == current_user.id, Statistics.subject_id == None
    ).first()
    achievements_count = db.query(func.count(UserAchievement.id)).filter(
        UserAchievement.user_id == current_user.id
    ).scalar()
    recent = (
        db.query(Progress)
        .filter(Progress.user_id == current_user.id)
        .order_by(Progress.completed_at.desc())
        .limit(5)
        .all()
    )
    return {
        "user": {
            "xp": current_user.xp,
            "level": current_user.level,
            "coins": current_user.coins,
            "stars": current_user.stars,
            "gems": current_user.gems,
            "streak_days": current_user.streak_days,
        },
        "overall": {
            "games_played": overall.games_played if overall else 0,
            "avg_score": round(overall.avg_score, 1) if overall else 0,
            "total_xp": overall.total_xp if overall else 0,
            "total_time_seconds": overall.total_time_seconds if overall else 0,
            "accuracy": round(overall.correct_answers / max(overall.total_answers, 1) * 100, 1) if overall else 0,
        },
        "achievements_earned": achievements_count or 0,
        "recent_activity": [
            {
                "game_id": p.game_id,
                "subject_id": p.subject_id,
                "score": p.score,
                "xp_earned": p.xp_earned,
                "completed_at": p.completed_at,
            }
            for p in recent
        ],
    }


@router.get("/admin/overview")
def admin_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    from app.models.game import Game
    from app.models.subject import Subject

    total_users = db.query(func.count(User.id)).scalar()
    total_games_played = db.query(func.count(Progress.id)).scalar()
    total_xp_awarded = db.query(func.sum(Progress.xp_earned)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    children_count = db.query(func.count(User.id)).filter(User.role == "child").scalar()
    parents_count = db.query(func.count(User.id)).filter(User.role == "parent").scalar()

    return {
        "total_users": total_users,
        "active_users": active_users,
        "children_count": children_count,
        "parents_count": parents_count,
        "total_games_played": total_games_played,
        "total_xp_awarded": total_xp_awarded,
        "total_subjects": db.query(func.count(Subject.id)).scalar(),
        "total_games": db.query(func.count(Game.id)).scalar(),
    }
