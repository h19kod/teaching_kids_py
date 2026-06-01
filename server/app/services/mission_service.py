from typing import List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.mission import Mission, UserMission
from app.schemas.game import ProgressSubmitRequest


class MissionService:

    @staticmethod
    def get_or_assign_missions(db: Session, user: User) -> List[UserMission]:
        now = datetime.utcnow()
        existing = db.query(UserMission).filter(UserMission.user_id == user.id).all()
        active_mission_ids = {um.mission_id for um in existing if not um.claimed}

        missions = db.query(Mission).filter(Mission.is_active == True).all()
        for mission in missions:
            if mission.id not in active_mission_ids:
                um = UserMission(
                    user_id=user.id,
                    mission_id=mission.id,
                    reset_at=now + timedelta(hours=24) if mission.reset_type == "daily" else now + timedelta(weeks=1),
                )
                db.add(um)
        db.commit()
        return db.query(UserMission).filter(UserMission.user_id == user.id).all()

    @staticmethod
    def update_progress(db: Session, user: User, data: ProgressSubmitRequest) -> List[UserMission]:
        user_missions = db.query(UserMission).filter(
            UserMission.user_id == user.id,
            UserMission.completed == False,
        ).all()
        updated = []
        for um in user_missions:
            mission = um.mission
            ct = mission.condition_type
            progressed = False

            if ct == "play_games":
                um.current_count += 1
                progressed = True
            elif ct == "score_perfect" and data.score >= data.max_score * 0.95:
                um.current_count += 1
                progressed = True
            elif ct == "play_subject" and data.subject_id == mission.subject_id:
                um.current_count += 1
                progressed = True

            if progressed and um.current_count >= mission.target_count:
                um.completed = True
                um.completed_at = datetime.utcnow()
            if progressed:
                updated.append(um)

        db.commit()
        return updated

    @staticmethod
    def claim_reward(db: Session, user: User, user_mission_id: int) -> dict:
        um = db.query(UserMission).filter(
            UserMission.id == user_mission_id,
            UserMission.user_id == user.id,
            UserMission.completed == True,
            UserMission.claimed == False,
        ).first()
        if not um:
            return {"success": False, "message": "Mission not found or already claimed"}
        mission = um.mission
        user.xp += mission.xp_reward
        user.coins += mission.coin_reward
        user.stars += mission.star_reward
        um.claimed = True
        db.commit()
        return {
            "success": True,
            "xp_earned": mission.xp_reward,
            "coins_earned": mission.coin_reward,
            "stars_earned": mission.star_reward,
            "message": f"Claimed rewards for: {mission.name}",
        }
