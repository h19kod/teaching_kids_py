from sqlalchemy import Column, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100), nullable=True)
    world_type = Column(String(50), nullable=False)
    icon = Column(String(50), default="📚")
    color = Column(String(20), default="#6366f1")
    bg_gradient = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    unlock_level = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)

    games = relationship("Game", back_populates="subject", cascade="all, delete-orphan")
    story_chapters = relationship("StoryChapter", back_populates="subject", cascade="all, delete-orphan")
    statistics = relationship("Statistics", back_populates="subject")
