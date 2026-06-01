from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True, index=True)
    hashed_password = Column(String(255), nullable=True)
    role = Column(String(20), default="child", nullable=False)
    is_active = Column(Boolean, default=True)

    display_name = Column(String(100), nullable=True)
    avatar = Column(String(255), default="🦁")
    bio = Column(Text, nullable=True)

    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    coins = Column(Integer, default=0)
    stars = Column(Integer, default=0)
    gems = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)

    parent_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    preferred_language = Column(String(10), default="ar")
    dark_mode = Column(Boolean, default=False)
    sound_enabled = Column(Boolean, default=True)

    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    children = relationship("User", backref="parent", foreign_keys=[parent_id], remote_side=[id])
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    user_achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    user_missions = relationship("UserMission", back_populates="user", cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="user", cascade="all, delete-orphan")
    story_progress = relationship("StoryProgress", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    statistics = relationship("Statistics", back_populates="user", cascade="all, delete-orphan")
    characters = relationship("Character", back_populates="user", cascade="all, delete-orphan")
