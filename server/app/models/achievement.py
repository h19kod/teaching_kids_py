from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    icon = Column(String(50), default="🏆")
    rarity = Column(String(20), default="common")
    xp_reward = Column(Integer, default=50)
    coin_reward = Column(Integer, default=20)
    condition_type = Column(String(50), nullable=False)
    condition_value = Column(Integer, default=1)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    is_active = Column(Boolean, default=True)

    user_achievements = relationship("UserAchievement", back_populates="achievement")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False, index=True)
    earned_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
