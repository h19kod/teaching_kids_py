from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, Float, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100), nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    description = Column(Text, nullable=True)
    game_type = Column(String(50), nullable=False)
    thumbnail = Column(String(255), default="🎮")
    min_difficulty = Column(Integer, default=1)
    max_difficulty = Column(Integer, default=5)
    xp_per_win = Column(Integer, default=10)
    coin_reward = Column(Integer, default=5)
    star_reward = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    unlock_level = Column(Integer, default=1)
    time_limit_seconds = Column(Integer, default=60)
    game_config = Column(JSON, nullable=True)
    order = Column(Integer, default=0)

    subject = relationship("Subject", back_populates="games")
    progress_records = relationship("Progress", back_populates="game")
