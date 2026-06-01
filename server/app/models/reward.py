from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_ar = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    description_ar = Column(Text, nullable=True)
    icon = Column(String(50), default="🎁")
    reward_type = Column(String(50), default="avatar_frame")
    cost_coins = Column(Integer, default=100)
    cost_gems = Column(Integer, default=0)
    rarity = Column(String(20), default="common")
    image_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_limited = Column(Boolean, default=False)
    unlock_level = Column(Integer, default=1)

    inventory = relationship("Inventory", back_populates="reward")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    reward_id = Column(Integer, ForeignKey("rewards.id"), nullable=False, index=True)
    purchased_at = Column(DateTime(timezone=True), server_default=func.now())
    is_equipped = Column(Boolean, default=False)

    user = relationship("User", back_populates="inventory")
    reward = relationship("Reward", back_populates="inventory")
