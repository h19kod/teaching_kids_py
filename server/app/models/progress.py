from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, Boolean, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False, index=True)

    score = Column(Float, default=0)
    max_score = Column(Float, default=100)
    xp_earned = Column(Integer, default=0)
    coins_earned = Column(Integer, default=0)
    stars_earned = Column(Integer, default=0)
    difficulty = Column(Integer, default=1)
    time_spent_seconds = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    completed = Column(Boolean, default=True)
    answers_data = Column(String(2000), nullable=True)

    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="progress_records")
    game = relationship("Game", back_populates="progress_records")
    subject = relationship("Subject")
