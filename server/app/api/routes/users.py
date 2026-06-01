from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.dependencies import get_current_active_user, require_admin, require_parent_or_admin
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserCreate, ChildCreate, PasswordChange
from app.core.security import get_password_hash, verify_password

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/me/change-password")
def change_password(
    data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if not current_user.hashed_password or not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.get("/children", response_model=List[UserResponse])
def get_children(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent_or_admin),
):
    return db.query(User).filter(User.parent_id == current_user.id, User.role == "child").all()


@router.post("/children", response_model=UserResponse)
def create_child(
    data: ChildCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent_or_admin),
):
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    child = User(
        username=data.username,
        display_name=data.display_name or data.username,
        avatar=data.avatar or "🦁",
        role="child",
        parent_id=current_user.id,
    )
    db.add(child)
    db.commit()
    db.refresh(child)
    return child


@router.delete("/children/{child_id}")
def delete_child(
    child_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent_or_admin),
):
    child = db.query(User).filter(User.id == child_id, User.parent_id == current_user.id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    db.delete(child)
    db.commit()
    return {"message": "Child removed"}


@router.get("/", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return db.query(User).all()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}", "is_active": user.is_active}
