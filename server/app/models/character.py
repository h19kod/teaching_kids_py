from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    avatar_emoji = Column(String(50), default="🦁")
    color = Column(String(20), default="#6366f1")
    outfit = Column(String(50), nullable=True)
    accessory = Column(String(50), nullable=True)
    background = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=False)
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="characters")
