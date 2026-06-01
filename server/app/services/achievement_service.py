from typing import List
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.achievement import Achievement, UserAchievement
from app.models.progress import Progress
from app.models.statistics import Statistics
from app.models.notification import Notification
from datetime import datetime


class AchievementService:

    @staticmethod
    def check_and_award(db: Session, user: User) -> List[Achievement]:
        already_earned = {ua.achievement_id for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()}
        achievements = db.query(Achievement).filter(Achievement.is_active == True).all()
        unlocked = []

        total_stat = db.query(Statistics).filter(Statistics.user_id == user.id, Statistics.subject_id == None).first()
        games_played = total_stat.games_played if total_stat else 0
        total_xp = user.xp

        for ach in achievements:
            if ach.id in already_earned:
                continue
            earned = False
            ct = ach.condition_type
            cv = ach.condition_value

            if ct == "games_played" and games_played >= cv:
                earned = True
            elif ct == "xp_total" and total_xp >= cv:
                earned = True
            elif ct == "level_reached" and user.level >= cv:
                earned = True
            elif ct == "stars_total" and user.stars >= cv:
                earned = True
            elif ct == "streak_days" and user.streak_days >= cv:
                earned = True
            elif ct == "coins_total" and user.coins >= cv:
                earned = True

            if earned:
                ua = UserAchievement(user_id=user.id, achievement_id=ach.id)
                db.add(ua)
                user.xp += ach.xp_reward
                user.coins += ach.coin_reward
                notif = Notification(
                    user_id=user.id,
                    title=f"Achievement Unlocked: {ach.name}",
                    title_ar=f"إنجاز جديد: {ach.name_ar or ach.name}",
                    message=f"You earned {ach.xp_reward} XP!",
                    notification_type="achievement",
                    icon=ach.icon,
                )
                db.add(notif)
                unlocked.append(ach)

        if unlocked:
            db.commit()
        return unlocked
