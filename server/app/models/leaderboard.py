from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class LeaderboardEntry(Base):
    __tablename__ = "leaderboard_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True, index=True)
    period_type = Column(String(20), default="weekly")
    week_number = Column(Integer, nullable=True)
    month_number = Column(Integer, nullable=True)
    year = Column(Integer, nullable=True)
    score = Column(Float, default=0)
    xp_gained = Column(Integer, default=0)
    games_played = Column(Integer, default=0)
    rank = Column(Integer, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User")
    subject = relationship("Subject")
