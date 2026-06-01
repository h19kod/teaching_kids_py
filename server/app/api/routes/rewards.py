from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.reward import Reward, Inventory
from app.schemas.reward import RewardResponse, PurchaseRequest, InventoryResponse
from app.services.reward_service import RewardService

router = APIRouter(prefix="/rewards", tags=["rewards"])


@router.get("/", response_model=List[RewardResponse])
def list_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    rewards = db.query(Reward).filter(Reward.is_active == True).all()
    owned_ids = {inv.reward_id for inv in db.query(Inventory).filter(Inventory.user_id == current_user.id).all()}
    result = []
    for r in rewards:
        d = RewardResponse.model_validate(r)
        d.owned = r.id in owned_ids
        result.append(d)
    return result


@router.post("/buy")
def buy_reward(
    data: PurchaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return RewardService.buy_reward(db, current_user, data.reward_id)


@router.get("/inventory", response_model=List[InventoryResponse])
def get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    items = db.query(Inventory).filter(Inventory.user_id == current_user.id).all()
    result = []
    for item in items:
        result.append(InventoryResponse(
            id=item.id,
            reward_id=item.reward_id,
            reward_name=item.reward.name,
            reward_icon=item.reward.icon,
            reward_type=item.reward.reward_type,
            is_equipped=item.is_equipped,
            purchased_at=item.purchased_at,
        ))
    return result


@router.post("/inventory/{inventory_id}/equip")
def equip_item(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return RewardService.equip_reward(db, current_user, inventory_id)
