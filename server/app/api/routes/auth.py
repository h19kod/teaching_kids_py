from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.dependencies import get_current_active_user, require_parent_or_admin
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return AuthService.login(db, data)


@router.post("/register", response_model=TokenResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return AuthService.register(db, data)


@router.post("/child-login/{child_id}", response_model=TokenResponse)
def child_login(
    child_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_parent_or_admin),
):
    return AuthService.child_login(db, child_id, current_user)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.post("/logout")
def logout(current_user: User = Depends(get_current_active_user)):
    return {"message": "Logged out successfully"}
