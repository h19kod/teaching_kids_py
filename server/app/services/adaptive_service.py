from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.models.progress import Progress
from app.models.game import Game
from app.models.subject import Subject
from app.models.statistics import Statistics


class AdaptiveService:

    @staticmethod
    def get_recommendations(db: Session, user: User) -> Dict[str, Any]:
        recent_progress = (
            db.query(Progress)
            .filter(Progress.user_id == user.id)
            .order_by(Progress.completed_at.desc())
            .limit(20)
            .all()
        )

        subject_performance: Dict[int, List[float]] = {}
        for p in recent_progress:
            subject_performance.setdefault(p.subject_id, []).append(p.score / max(p.max_score, 1))

        weak_subjects = []
        strong_subjects = []
        for subj_id, scores in subject_performance.items():
            avg = sum(scores) / len(scores)
            if avg < 0.6:
                weak_subjects.append(subj_id)
            elif avg >= 0.85:
                strong_subjects.append(subj_id)

        recommended_games = []
        for subj_id in (weak_subjects or list(subject_performance.keys()))[:2]:
            games = db.query(Game).filter(Game.subject_id == subj_id, Game.is_active == True).limit(3).all()
            for g in games:
                recommended_games.append({
                    "game_id": g.id,
                    "game_name": g.name,
                    "subject_id": subj_id,
                    "reason": "needs_practice",
                    "suggested_difficulty": AdaptiveService._suggest_difficulty(db, user.id, g.id),
                })

        if not recommended_games:
            games = db.query(Game).filter(Game.is_active == True).limit(4).all()
            for g in games:
                recommended_games.append({
                    "game_id": g.id,
                    "game_name": g.name,
                    "subject_id": g.subject_id,
                    "reason": "general",
                    "suggested_difficulty": 1,
                })

        return {
            "recommended_games": recommended_games[:6],
            "weak_subjects": weak_subjects,
            "strong_subjects": strong_subjects,
            "overall_level": user.level,
            "suggested_daily_goal": 3,
        }

    @staticmethod
    def _suggest_difficulty(db: Session, user_id: int, game_id: int) -> int:
        recent = (
            db.query(Progress)
            .filter(Progress.user_id == user_id, Progress.game_id == game_id)
            .order_by(Progress.completed_at.desc())
            .limit(5)
            .all()
        )
        if not recent:
            return 1
        avg_score = sum(p.score / max(p.max_score, 1) for p in recent) / len(recent)
        last_diff = recent[0].difficulty
        if avg_score >= 0.85:
            return min(5, last_diff + 1)
        elif avg_score < 0.5:
            return max(1, last_diff - 1)
        return last_diff

    @staticmethod
    def adjust_difficulty(db: Session, user: User, game_id: int) -> Dict[str, Any]:
        suggested = AdaptiveService._suggest_difficulty(db, user.id, game_id)
        return {
            "game_id": game_id,
            "suggested_difficulty": suggested,
            "reason": "Based on your recent performance",
        }
