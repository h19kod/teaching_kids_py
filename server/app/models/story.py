from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class StoryChapter(Base):
    __tablename__ = "story_chapters"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    title_ar = Column(String(200), nullable=True)
    content = Column(Text, nullable=False)
    content_ar = Column(Text, nullable=True)
    illustration = Column(String(50), default="📖")
    order = Column(Integer, default=0)
    unlock_xp = Column(Integer, default=0)
    xp_reward = Column(Integer, default=20)
    is_active = Column(Boolean, default=True)

    subject = relationship("Subject", back_populates="story_chapters")
    story_progress = relationship("StoryProgress", back_populates="chapter")


class StoryProgress(Base):
    __tablename__ = "story_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    chapter_id = Column(Integer, ForeignKey("story_chapters.id"), nullable=False, index=True)
    completed = Column(Boolean, default=False)
    current_page = Column(Integer, default=0)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="story_progress")
    chapter = relationship("StoryChapter", back_populates="story_progress")
