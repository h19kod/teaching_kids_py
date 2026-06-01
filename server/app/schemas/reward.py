from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RewardResponse(BaseModel):
    id: int
    name: str
    name_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    icon: str
    reward_type: str
    cost_coins: int
    cost_gems: int
    rarity: str
    is_limited: bool
    unlock_level: int
    owned: bool = False

    class Config:
        from_attributes = True


class PurchaseRequest(BaseModel):
    reward_id: int


class PurchaseResponse(BaseModel):
    success: bool
    message: str
    remaining_coins: int
    remaining_gems: int


class InventoryResponse(BaseModel):
    id: int
    reward_id: int
    reward_name: str
    reward_icon: str
    reward_type: str
    is_equipped: bool
    purchased_at: Optional[datetime] = None

    class Config:
        from_attributes = True
