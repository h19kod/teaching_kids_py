from sqlalchemy import Column, Integer, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Statistics(Base):
    __tablename__ = "statistics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True, index=True)
    games_played = Column(Integer, default=0)
    games_completed = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    best_score = Column(Float, default=0.0)
    total_xp = Column(Integer, default=0)
    total_coins = Column(Integer, default=0)
    total_time_seconds = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    total_answers = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    best_streak = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="statistics")
    subject = relationship("Subject", back_populates="statistics")
