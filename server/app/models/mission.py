from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    icon = Column(String(50), default="🎯")
    mission_type = Column(String(50), default="daily")
    reset_type = Column(String(20), default="daily")
    xp_reward = Column(Integer, default=30)
    coin_reward = Column(Integer, default=10)
    star_reward = Column(Integer, default=1)
    target_count = Column(Integer, default=1)
    condition_type = Column(String(50), nullable=False)
    condition_value = Column(Integer, default=1)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    is_active = Column(Boolean, default=True)

    user_missions = relationship("UserMission", back_populates="mission")


class UserMission(Base):
    __tablename__ = "user_missions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False, index=True)
    current_count = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    claimed = Column(Boolean, default=False)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    reset_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="user_missions")
    mission = relationship("Mission", back_populates="user_missions")
