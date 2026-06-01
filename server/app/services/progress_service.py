import math
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.progress import Progress
from app.models.statistics import Statistics
from app.models.leaderboard import LeaderboardEntry
from app.schemas.game import ProgressSubmitRequest, ProgressSubmitResponse
from app.services.achievement_service import AchievementService
from app.services.mission_service import MissionService
from datetime import datetime


def calculate_level(xp: int) -> int:
    if xp < 100:
        return 1
    return min(50, int(math.log(xp / 100, 1.5)) + 2)


def calculate_xp_reward(score: float, max_score: float, difficulty: int, time_seconds: int) -> int:
    base_xp = int((score / max(max_score, 1)) * 50)
    difficulty_bonus = difficulty * 10
    time_bonus = max(0, 10 - (time_seconds // 30))
    return base_xp + difficulty_bonus + time_bonus


class ProgressService:

    @staticmethod
    def submit(db: Session, user: User, data: ProgressSubmitRequest) -> ProgressSubmitResponse:
        xp_earned = calculate_xp_reward(data.score, data.max_score, data.difficulty, data.time_spent_seconds)
        coins_earned = max(1, int(xp_earned * 0.5))
        stars_earned = 1 if data.score >= data.max_score * 0.6 else 0
        if data.score >= data.max_score * 0.9:
            stars_earned = 3
        elif data.score >= data.max_score * 0.7:
            stars_earned = 2

        progress = Progress(
            user_id=user.id,
            game_id=data.game_id,
            subject_id=data.subject_id,
            score=data.score,
            max_score=data.max_score,
            xp_earned=xp_earned,
            coins_earned=coins_earned,
            stars_earned=stars_earned,
            difficulty=data.difficulty,
            time_spent_seconds=data.time_spent_seconds,
            correct_answers=data.correct_answers,
            total_questions=data.total_questions,
            answers_data=data.answers_data,
        )
        db.add(progress)

        old_level = user.level
        user.xp += xp_earned
        user.coins += coins_earned
        user.stars += stars_earned
        user.level = calculate_level(user.xp)
        level_up = user.level > old_level

        ProgressService._update_statistics(db, user, data, xp_earned, coins_earned)

        db.commit()
        db.refresh(user)

        achievements = AchievementService.check_and_award(db, user)
        missions = MissionService.update_progress(db, user, data)

        return ProgressSubmitResponse(
            xp_earned=xp_earned,
            coins_earned=coins_earned,
            stars_earned=stars_earned,
            total_xp=user.xp,
            level_up=level_up,
            new_level=user.level,
            achievements_unlocked=[{"id": a.id, "name": a.name, "icon": a.icon} for a in achievements],
            missions_updated=[{"id": m.id, "name": m.mission.name} for m in missions],
        )

    @staticmethod
    def _update_statistics(db: Session, user: User, data: ProgressSubmitRequest, xp: int, coins: int):
        for subject_id in [None, data.subject_id]:
            stat = db.query(Statistics).filter(
                Statistics.user_id == user.id,
                Statistics.subject_id == subject_id,
            ).first()
            if not stat:
                stat = Statistics(user_id=user.id, subject_id=subject_id)
                db.add(stat)
            stat.games_played += 1
            stat.games_completed += 1
            stat.total_xp += xp
            stat.total_coins += coins
            stat.total_time_seconds += data.time_spent_seconds
            stat.correct_answers += data.correct_answers
            stat.total_answers += data.total_questions
            if data.total_questions > 0:
                new_avg = data.score / data.max_score * 100
                stat.avg_score = (stat.avg_score * (stat.games_played - 1) + new_avg) / stat.games_played
                stat.best_score = max(stat.best_score, new_avg)
