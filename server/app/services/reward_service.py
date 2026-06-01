from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.reward import Reward, Inventory


class RewardService:

    @staticmethod
    def buy_reward(db: Session, user: User, reward_id: int) -> dict:
        reward = db.query(Reward).filter(Reward.id == reward_id, Reward.is_active == True).first()
        if not reward:
            raise HTTPException(status_code=404, detail="Reward not found")

        already_owned = db.query(Inventory).filter(
            Inventory.user_id == user.id, Inventory.reward_id == reward_id
        ).first()
        if already_owned:
            raise HTTPException(status_code=400, detail="Already owned")

        if user.level < reward.unlock_level:
            raise HTTPException(status_code=400, detail=f"Requires level {reward.unlock_level}")

        if reward.cost_gems > 0:
            if user.gems < reward.cost_gems:
                raise HTTPException(status_code=400, detail="Not enough gems")
            user.gems -= reward.cost_gems
        else:
            if user.coins < reward.cost_coins:
                raise HTTPException(status_code=400, detail="Not enough coins")
            user.coins -= reward.cost_coins

        item = Inventory(user_id=user.id, reward_id=reward_id)
        db.add(item)
        db.commit()
        db.refresh(user)

        return {
            "success": True,
            "message": f"Purchased {reward.name}!",
            "remaining_coins": user.coins,
            "remaining_gems": user.gems,
        }

    @staticmethod
    def equip_reward(db: Session, user: User, inventory_id: int) -> dict:
        item = db.query(Inventory).filter(
            Inventory.id == inventory_id, Inventory.user_id == user.id
        ).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        db.query(Inventory).filter(
            Inventory.user_id == user.id,
            Inventory.reward.has(reward_type=item.reward.reward_type),
        ).update({"is_equipped": False})
        item.is_equipped = True
        db.commit()
        return {"success": True, "message": "Item equipped"}
